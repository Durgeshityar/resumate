'use server'

import { getSubscriptionDetails } from '@/lib/get-subscription-detail'

export async function fetchSubscriptionDetails() {
  try {
    const details = await getSubscriptionDetails()
    console.log('Server action subscription details:', details)

    return {
      isSubscribed: details.isSubscribed,
      credits: details.credits,
      user: details.user,
    }
  } catch (error) {
    console.error('Error in fetchSubscriptionDetails:', error)
    return {
      isSubscribed: false,
      credits: 0,
    }
  }
}
