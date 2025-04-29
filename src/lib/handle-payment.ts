import { PlanType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { sendPaymentSuccessEmail } from './mail'
import { fetchSubscriptionDetails } from '@/actions/user/subscription-actions'

// Define Razorpay on window
declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance
    }
  }
}

interface RazorpayOptions {
  key: string | undefined
  order_id: string
  handler: (response: RazorpayResponse) => Promise<void>
  [key: string]: unknown
}

interface RazorpayInstance {
  open: () => void
  [key: string]: unknown
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export default async function handlePayment({
  subscription,
}: {
  subscription: PlanType
}) {
  const { isSubscribed, user } = await fetchSubscriptionDetails()

  if (
    (isSubscribed && subscription === user?.Subscription?.plan) ||
    (isSubscribed && user?.Subscription?.plan === PlanType.LIFETIME)
  ) {
    toast.error(
      user?.Subscription?.plan === PlanType.LIFETIME
        ? 'You already have a lifetime subscription'
        : 'You already have a subscription'
    )
    return
  }

  const response = await fetch('/api/razorpay-order/create', {
    method: 'POST',
    body: JSON.stringify({ subscription }),
  })

  const data = await response.json()

  console.log(
    `received data from /api/razorpay-order/create in handlePayment:`,
    data
  )

  const paymentData: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    order_id: data.id,
    handler: async function (response: RazorpayResponse) {
      const verification_res = await fetch('/api/razorpay-order/verify', {
        method: 'POST',
        body: JSON.stringify({
          orderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      })

      const data = await verification_res.json()
      console.log(data)

      if (data.isOk) {
        toast.success('Payment successful')

        if (user && user.email) {
          await sendPaymentSuccessEmail(user.email, subscription)
        }

        redirect('/billing/success')
      } else {
        // This block will mostly not execute i.e. would be handled by Razorpay
        toast.error('Payment failed')
      }
    },
  }

  try {
    console.log('Initializing Razorpay with:', {
      key: paymentData.key,
      order_id: paymentData.order_id,
      window_razorpay_exists:
        typeof window !== 'undefined' && !!window.Razorpay,
    })

    // Check if Razorpay script is loaded
    if (typeof window === 'undefined' || !window.Razorpay) {
      console.error('Razorpay script not loaded')
      toast.error(
        'Payment gateway not loaded. Please refresh the page and try again.'
      )
      return
    }

    const payment = new window.Razorpay(paymentData)
    payment.open()
  } catch (error) {
    console.error('Error initializing Razorpay:', error)
    toast.error('Failed to initialize payment gateway')
  }
}
