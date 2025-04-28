import { NextResponse } from 'next/server'

import { currentUser } from '@/lib/auth-util'
import { razorpay } from '@/lib/razorpay'
import { PlanType } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscription }: { subscription: PlanType } = await request.json()

    const prices = {
      MONTHLY: 29,
      LIFETIME: 140,
    }

    if (!prices[subscription]) {
      return NextResponse.json(
        { error: 'Invalid subscription type. Use "MONTHLY" or "LIFETIME".' },
        { status: 400 }
      )
    }
    const amount = prices[subscription]
    const orderAmount = Math.round(amount * 100)
    console.log('Order amount :', orderAmount)

    const planDescription =
      subscription === 'MONTHLY'
        ? `1 Month subscription for resumate at $${prices.MONTHLY}`
        : `Lifetime subscription for resumate at $${prices.LIFETIME}`

    // create razorpay order
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

    return NextResponse.json({
      ...order,
      subscriptionType: subscription,
    })
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
