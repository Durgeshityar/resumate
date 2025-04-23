'use client'

import { Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import usePremiumModal from '@/hooks/use-premium-model'

import { PlanType } from '@prisma/client'
import handlePayment from '@/lib/handle-payment'

const premiumFeatures = ['AI tools', 'Up to 3 resumes']
const premiumPlusFeatures = ['Infinite resumes', 'Design customizations']

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resumate Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Get a Premium subscription to unlock more features.</p>
          <div className="flex">
            <div className=" flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold"> Premium</h3>
              <ul className="list-inside space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handlePayment({ subscription: PlanType.MONTHLY })
                }
              >
                Get Premium
              </Button>
            </div>
            <div className="border-l mx-6" />
            <div className=" flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold bg-gradient-to-r from-green-600 to-gray-400 bg-clip-text text-transparent">
                Premium Plus
              </h3>
              <ul className="list-inside space-y-2">
                {premiumPlusFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={'premium'}
                onClick={() => handlePayment({ subscription: PlanType.YEARLY })}
              >
                {' '}
                Get Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
