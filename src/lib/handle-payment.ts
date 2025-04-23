import { PlanType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

export default async function handlePayment({
  subscription,
}: {
  subscription: PlanType
}) {
  const response = await fetch('/api/razorpay-order/create', {
    method: 'POST',
    body: JSON.stringify({ subscription }),
  })

  const data = await response.json()

  console.log(`recieved data from /api/rp/create in handlepayment ,`, data)

  interface PaymentData {
    key: string | undefined
    order_id: string
    handler: (response: RazorpayResponse) => Promise<void>
  }
  interface RazorpayResponse {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }

  const paymentData: PaymentData = {
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
        redirect('/billing/success')
      } else {
        // This block wil mostly not execute i.e. would be handled by Razorpay
        toast.error('Payment failed')
      }
    },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payment = new (window as any).Razorpay(paymentData)
  payment.open()
}
