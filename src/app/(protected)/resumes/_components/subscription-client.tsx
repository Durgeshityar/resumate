'use client'

import { useSubscription } from '@/hooks/use-subscription'
import { ReactNode, createContext, useContext } from 'react'

// Create a context to hold subscription data
const SubscriptionContext = createContext<ReturnType<
  typeof useSubscription
> | null>(null)

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    )
  }
  return context
}

interface SubscriptionProviderProps {
  children: ReactNode
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const subscription = useSubscription()

  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  )
}
