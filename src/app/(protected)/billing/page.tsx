import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth-util'
import BillingClient from './_components/billing-client'

export const metadata: Metadata = {
  title: 'Billing',
}

export default async function BillingPage() {
  const user = await currentUser()

  if (!user) {
    return redirect('/auth/login')
  }

  // Fetch subscription data for initial state
  const subscription = await db.subscription.findUnique({
    where: {
      userId: user.id,
    },
  })

  return <BillingClient user={user} initialSubscription={subscription} />
}
