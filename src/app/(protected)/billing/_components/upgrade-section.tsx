'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, Sparkles } from 'lucide-react'
import { PlanType } from '@prisma/client'
import handlePayment from '@/lib/handle-payment'
import { toast } from 'sonner'
import type { ExtendedUser } from '@/next-auth'

const LIFETIME_PRICE = 140

const features = [
  'AI-powered resume builder & optimization',
  'AI-powered cover letter builder',
  'ATS-friendly formats',
  'Unlimited exports',
  'Priority support',
  'One-time payment, lifetime access',
]

interface UpgradeSectionProps {
  user: ExtendedUser
  currentPlan: string
}

export default function UpgradeSection({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user,
  currentPlan,
}: UpgradeSectionProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Skip rendering if user already has lifetime subscription
  if (currentPlan === 'LIFETIME') {
    return null
  }

  const initiatePayment = async () => {
    try {
      setIsLoading(true)
      await handlePayment({
        subscription: PlanType.LIFETIME,
      })
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
      <Card className="border-2 border-blue-500/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-500">
              RECOMMENDED
            </span>
          </div>
          <CardTitle>Lifetime Access</CardTitle>
          <CardDescription>
            {currentPlan === 'FREE'
              ? 'Upgrade to lifetime access and never worry about payments again'
              : 'Upgrade from monthly to lifetime and save in the long run'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-baseline mb-6">
            <span className="text-3xl font-bold">${LIFETIME_PRICE}</span>
            <span className="ml-2 text-muted-foreground">one-time payment</span>
          </div>

          <ul className="space-y-2 mb-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0 mt-1" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 pt-4">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={initiatePayment}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Upgrade to Lifetime'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
