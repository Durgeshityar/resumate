'use client'

import { FileText, PlusSquare } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import usePremiumModal from '@/hooks/use-premium-model'

interface HeroSectionProps {
  canCreate: boolean
  totalResumes: number
}

export default function HeroSection({
  canCreate,
  totalResumes,
}: HeroSectionProps) {
  const premiumModal = usePremiumModal()

  const handlePremiumClick = () => {
    premiumModal.setOpen(true)
  }

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-secondary/50 to-background rounded-xl p-6 mb-8 bg-blue-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
            Your Professional Journey Starts Here
          </h1>
          <p className="text-lg leading-8 text-muted-foreground mb-8">
            Create stunning resumes and matching cover letters that help you
            stand out. You have created {totalResumes}{' '}
            {totalResumes === 1 ? 'resume' : 'resumes'} so far.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {canCreate ? (
              <Button size="lg" className="gap-2" asChild>
                <Link href="/editor">
                  <PlusSquare className="size-5" />
                  Create New Resume
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="gap-2" onClick={handlePremiumClick}>
                <PlusSquare className="size-5" />
                Create New Resume
              </Button>
            )}
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="/cover-letters">
                <FileText className="size-5" />
                Generate Cover Letter
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
