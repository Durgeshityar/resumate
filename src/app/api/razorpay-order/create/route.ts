import { NextResponse } from 'next/server'

import { currentUser } from '@/lib/auth-util'
import { razorpay } from '@/lib/razorpay'
import { PlanType } from '@prisma/client'
import { Console } from 'console'

export async function POST(request: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscription }: { subscription: PlanType } = await request.json()

    const prices = {
      MONTHLY: 29,
      YEARLY: 129,
    }

    if (!prices[subscription]) {
      return NextResponse.json(
        { error: 'Invalid subscription type. Use "MONTHLY" or "YEARLY".' },
        { status: 400 }
      )
    }
    const amount = prices[subscription]
    const orderAmount = Math.round(amount * 100)
    console.log('Order amount :', orderAmount)

    const planDescription =
      subscription === 'MONTHLY'
        ? `1 Month subscription for resumate at $${prices.MONTHLY}`
        : `1 Year subscription for resumate at $${prices.YEARLY}`

    // create razorpay ooder
    const order = await razorpay.orders.create({
      amount: orderAmount,
      currency: 'USD',
      receipt: `receipt-${Date.now()}`,
      notes: {
        subscriptionType: subscription,
        planDescription,
        userId: user.id as string,
        userName: user.name as string,
        userEmail: user.email as string,
      },
    })

    // Calculate expiry date
    const expiryDate = new Date()
    expiryDate.setMonth(
      expiryDate.getMonth() + (subscription === 'MONTHLY' ? 1 : 12)
    )
    try {
      await prisma?.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan: PlanType[subscription], // "MONTHLY" or "YEARLY"
          paymentStatus: 'PENDING',
          expiry: expiryDate,
          razorpayId: order.id,
        },
        create: {
          userId: user.id as string,
          plan: PlanType[subscription],
          paymentStatus: 'PENDING',
          expiry: expiryDate,
          razorpayId: order.id,
        },
      })
    } catch (dbError) {
      console.log('Error updatimg DB', dbError)
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error: 'Something went wrong!',
      },
      { status: 500 }
    )
  }
}
