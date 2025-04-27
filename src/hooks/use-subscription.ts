import { useState, useEffect, useCallback } from 'react'
import { fetchSubscriptionDetails } from '@/actions/user/subscription-actions'
import { decreaseUserCredits } from '@/actions/ai/update-credits'
import { toast } from 'sonner'
import usePremiumModal from './use-premium-model'

// Custom event name for subscription updates
const SUBSCRIPTION_UPDATE_EVENT = 'subscription-update'

// Create a custom event with subscription data
function createSubscriptionUpdateEvent(data: {
  isSubscribed: boolean
  credits: number
}) {
  return new CustomEvent(SUBSCRIPTION_UPDATE_EVENT, {
    detail: data,
  })
}

// Type for the event detail
type SubscriptionUpdateEvent = CustomEvent<{
  isSubscribed: boolean
  credits: number
}>

export interface SubscriptionDetails {
  isSubscribed: boolean
  credits: number
  loading: boolean
  isFeatureAvailable: boolean
  subscriptionActions: {
    useFeature: () => Promise<boolean>
    refreshDetails: () => Promise<void>
    openPremiumModal: () => void
  }
}

export function useSubscription(): SubscriptionDetails {
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    isSubscribed: boolean
    credits: number
  }>({ isSubscribed: false, credits: 0 })
  const [loading, setLoading] = useState(true)
  const premiumModal = usePremiumModal()

  // Handle subscription update events from other components
  useEffect(() => {
    const handleSubscriptionUpdate = (event: Event) => {
      const customEvent = event as SubscriptionUpdateEvent

      setSubscriptionDetails(customEvent.detail)
    }

    // Add event listener
    window.addEventListener(SUBSCRIPTION_UPDATE_EVENT, handleSubscriptionUpdate)

    // Cleanup
    return () => {
      window.removeEventListener(
        SUBSCRIPTION_UPDATE_EVENT,
        handleSubscriptionUpdate
      )
    }
  }, [])

  const refreshDetails = useCallback(async () => {
    setLoading(true)
    try {
      const details = await fetchSubscriptionDetails()

      console.log('Subscription details received:', details)

      const updatedDetails = {
        isSubscribed: !!details.isSubscribed,
        // Explicitly handle 0 credits case
        credits:
          details.credits === 0
            ? 0
            : typeof details.credits === 'number'
            ? details.credits
            : 0,
      }

      console.log('Updated subscription details:', updatedDetails)

      // Update local state
      setSubscriptionDetails(updatedDetails)

      // Broadcast to other components
      window.dispatchEvent(createSubscriptionUpdateEvent(updatedDetails))
    } catch (error) {
      console.log('Error loading subscription details:', error)
      setSubscriptionDetails({ isSubscribed: false, credits: 0 })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshDetails()
  }, [refreshDetails])

  // Feature is available if user is subscribed OR has credits >= 0
  // No longer used in the return, but kept for potential future use
  // const isFeatureAvailable =
  //   subscriptionDetails.isSubscribed || subscriptionDetails.credits >= 0

  const openPremiumModal = useCallback(() => {
    premiumModal.setOpen(true)
  }, [premiumModal])

  // Function to use a premium feature and handle credit deduction
  const useFeature = useCallback(async (): Promise<boolean> => {
    console.log(
      'useFeature called, credits:',
      subscriptionDetails.credits,
      'isSubscribed:',
      subscriptionDetails.isSubscribed
    )

    // For users with 0 credits, immediately open premium modal and don't proceed
    if (
      !subscriptionDetails.isSubscribed &&
      subscriptionDetails.credits === 0
    ) {
      console.log('Opening premium modal due to 0 credits')
      premiumModal.setOpen(true)
      toast.error('No credits available. Please upgrade to continue.')
      return false
    }

    // Premium users can use features without credit deduction
    if (subscriptionDetails.isSubscribed) {
      return true
    }

    // Only deduct credit for non-premium users with available credits
    const result = await decreaseUserCredits()
    if (!result.success) {
      toast.error('Failed to update credits')
      return false
    }

    // Update local state with new credit balance
    const updatedDetails = {
      ...subscriptionDetails,
      credits: result.remainingCredits ?? subscriptionDetails.credits,
    }

    // Update local state
    setSubscriptionDetails(updatedDetails)

    // Broadcast to other components
    window.dispatchEvent(createSubscriptionUpdateEvent(updatedDetails))

    return true
  }, [subscriptionDetails, premiumModal])

  return {
    isSubscribed: subscriptionDetails.isSubscribed,
    credits: subscriptionDetails.credits,
    loading,
    isFeatureAvailable: !loading, // Always enable the button
    subscriptionActions: {
      useFeature,
      refreshDetails,
      openPremiumModal,
    },
  }
}
