'use client'

import { Check } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import usePremiumModal from '@/hooks/use-premium-model'

import { PlanType } from '@prisma/client'
import handlePayment from '@/lib/handle-payment'

const MONTHLY_PRICE = 29
const YEARLY_PRICE = 140
const MONTHLY_SAVINGS = Math.round(
  (1 - YEARLY_PRICE / (MONTHLY_PRICE * 12)) * 100
)

const features = [
  'AI-powered resume builder & optimization',
  'AI-powered cover letter builder',
  'ATS-friendly formats',
  'Unlimited exports',
  'Priority support',
]

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold">
            Choose your Resumate plan
          </DialogTitle>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get full access to all premium features and supercharge your job
            search.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Plan */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-800">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold">Monthly</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold">${MONTHLY_PRICE}</span>
                    <span className="ml-1 text-gray-500">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 pt-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="size-4 text-green-500 shrink-0 mt-1" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-6"
                  onClick={() =>
                    handlePayment({ subscription: PlanType.MONTHLY })
                  }
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Yearly Plan */}
            <div className="border-2 border-blue-500 dark:border-blue-400 rounded-lg p-6 relative bg-white dark:bg-gray-800 shadow-md">
              <div className="absolute -top-3 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                BEST VALUE
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold">Annual</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold">${YEARLY_PRICE}</span>
                    <span className="ml-1 text-gray-500">/year</span>
                  </div>
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    Save {MONTHLY_SAVINGS}% compared to monthly
                  </p>
                </div>

                <ul className="space-y-3 pt-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="size-4 text-green-500 shrink-0 mt-1" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  onClick={() =>
                    handlePayment({ subscription: PlanType.YEARLY })
                  }
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            Upgrade anytime. Cancel anytime. No questions asked.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
