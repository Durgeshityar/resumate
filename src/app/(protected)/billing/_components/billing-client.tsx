'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import UserCreditsDisplay from './user-credits-display'
import UpgradeSection from './upgrade-section'
import { useSubscriptionContext } from '../../resumes/_components/subscription-client'
import { useState } from 'react'
import { Subscription } from '@prisma/client'
import type { ExtendedUser } from '@/next-auth'

interface BillingClientProps {
  user: ExtendedUser
  initialSubscription: Subscription | null
}

export default function BillingClient({
  user,
  initialSubscription,
}: BillingClientProps) {
  const { isSubscribed } = useSubscriptionContext()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subscription, setSubscription] = useState<Subscription | null>(
    initialSubscription
  )

  const currentPlan = isSubscribed ? subscription?.plan || 'FREE' : 'FREE'

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the{' '}
              {currentPlan === 'FREE'
                ? 'Free'
                : currentPlan === 'MONTHLY'
                ? 'Pro Monthly'
                : 'Pro Lifetime'}{' '}
              plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge
                variant={currentPlan === 'FREE' ? 'outline' : 'default'}
                className="px-3 py-1"
              >
                {currentPlan === 'FREE'
                  ? 'Free'
                  : currentPlan === 'MONTHLY'
                  ? 'Pro Monthly'
                  : 'Pro Lifetime'}
              </Badge>

              {subscription && (
                <p className="text-sm text-muted-foreground">
                  {currentPlan !== 'FREE'
                    ? currentPlan === 'MONTHLY'
                      ? `Renews on ${new Date(
                          subscription.expiry
                        ).toLocaleDateString()}`
                      : 'Lifetime access - never expires'
                    : 'Limited features'}
                </p>
              )}
            </div>

            <div className="mt-4">
              <UserCreditsDisplay />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade section - only show for free or monthly plans */}
      {currentPlan !== 'LIFETIME' && (
        <UpgradeSection user={user} currentPlan={currentPlan} />
      )}

      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        {subscription ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">
                      Pro {subscription.plan.toLowerCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      subscription.paymentStatus === 'SUCCESSFUL'
                        ? 'bg-green-50 text-green-700'
                        : ''
                    }
                  >
                    {subscription.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No payment history available
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// PlanCard component for future reference
/*
interface PlanCardProps {
  title: string
  price: string
  period: string
  description: string
  features: string[]
  highlight?: boolean
  currentPlan?: boolean
  buttonText?: string
  buttonDisabled?: boolean
}

function PlanCard({
  title,
  price,
  period,
  description,
  features,
  highlight = false,
  currentPlan = false,
  buttonText = 'Choose Plan',
  buttonDisabled = false,
}: PlanCardProps) {
  return (
    <Card
      className={`relative overflow-hidden ${
        highlight ? 'border-primary shadow-lg' : ''
      }`}
    >
      {highlight && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-lg">Popular</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-3xl font-bold">{price}</span>
          {period && (
            <span className="text-muted-foreground ml-1">{period}</span>
          )}
        </div>
        <ul className="space-y-2">
          {features.map((feature: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={currentPlan ? 'outline' : highlight ? 'default' : 'outline'}
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
*/
