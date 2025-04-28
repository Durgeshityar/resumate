'use client'

import { useSubscriptionContext } from '../../resumes/_components/subscription-client'

export default function UserCreditsDisplay() {
  const { credits, loading, isSubscribed } = useSubscriptionContext()

  return (
    <p className="text-sm">
      Credits remaining:{' '}
      <span className="font-semibold">
        {loading ? 'Loading...' : isSubscribed ? 'Unlimited' : credits}
      </span>
    </p>
  )
}
