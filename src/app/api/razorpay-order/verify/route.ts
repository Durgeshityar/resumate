import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { razorpay } from '@/lib/razorpay'
import { PlanType } from '@prisma/client'

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

  try {
    // Fetch order details from Razorpay to get user and subscription info
    const order = await razorpay.orders.fetch(orderId)
    const userId = order.notes?.userId as string
    const subscriptionType = order.notes?.subscriptionType as PlanType

    if (!userId || !subscriptionType) {
      throw new Error('Invalid order data')
    }

    // Calculate expiry date
    const expiryDate = new Date()
    if (subscriptionType === 'MONTHLY') {
      expiryDate.setMonth(expiryDate.getMonth() + 1)
    } else {
      // Set a far future date for LIFETIME (e.g., 100 years)
      expiryDate.setFullYear(expiryDate.getFullYear() + 100)
    }

    const subscriptionUpdate = await db.subscription.upsert({
      where: { userId },
      update: {
        plan: subscriptionType,
        paymentStatus: 'SUCCESSFUL',
        expiry: expiryDate,
        razorpayId: orderId,
      },
      create: {
        userId,
        plan: subscriptionType,
        paymentStatus: 'SUCCESSFUL',
        expiry: expiryDate,
        razorpayId: orderId,
      },
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
