import { currentUser } from './auth-util'
import { db } from './db'

export const getSubscriptionDetails = async () => {
  const user = await currentUser()

  console.log(
    'Current user in getSubscriptionDetails:',
    user ? { id: user.id, email: user.email } : null
  )

  if (!user || !user.id) {
    console.log('No authenticated user found')
    return {
      isSubscribed: false,
      credits: 0,
    }
  }

  const fullUserDetail = await db.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      Subscription: true,
    },
  })

  console.log(
    'User DB details:',
    fullUserDetail
      ? {
          id: fullUserDetail.id,
          hasSubscription: !!fullUserDetail.Subscription,
          credits: fullUserDetail.credit,
        }
      : null
  )

  if (!fullUserDetail) {
    console.log('User not found in database')
    return {
      isSubscribed: false,
      credits: 0,
    }
  }

  const isSubscribed = fullUserDetail.Subscription
    ? fullUserDetail.Subscription.paymentStatus === 'SUCCESSFUL' &&
      new Date(fullUserDetail.Subscription.expiry) > new Date()
    : false

  return {
    isSubscribed,
    credits: fullUserDetail.credit,
  }
}
