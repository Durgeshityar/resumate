import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_SECRET_ID!

  const sig = crypto
    .createHmac('sha256', keySecret)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex')
  return sig
}

export async function POST(request: NextRequest) {
  const { orderId, razorpayPaymentId, razorpaySignature } = await request.json()

  const signature = generatedSignature(orderId, razorpayPaymentId)
  if (signature !== razorpaySignature) {
    return NextResponse.json(
      { message: 'payment verification failed', isOk: false },
      { status: 400 }
    )
  }

  // updating user

  try {
    const subscriptionUpdate = await prisma?.subscription.update({
      where: { razorpayId: orderId },
      data: { paymentStatus: 'SUCCESSFUL' },
    })

    if (!subscriptionUpdate) {
      throw new Error('Failed to update subscription status')
    }

    return NextResponse.json(
      { message: 'Payment verified successfully', isOk: true },
      { status: 200 }
    )
  } catch (dbError) {
    console.error('Database update error:', dbError)
    return NextResponse.json(
      { message: 'Database update failed', isOk: false },
      { status: 500 }
    )
  }
}
