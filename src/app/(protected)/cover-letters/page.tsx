import { Metadata } from 'next'
import { FileText, PlusSquare } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Cover Letters',
  description: 'Generate and manage your professional cover letters',
}

export default async function CoverLettersPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-secondary/50 to-background rounded-xl p-6 mb-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
                Cover Letters
              </h1>
              <p className="text-lg leading-8 text-muted-foreground mb-8">
                Generate personalized cover letters that match your resumes and
                target specific job opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/cover-letters/new">
                    <PlusSquare className="size-5" />
                    New Cover Letter
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <Link href="/resumes">
                    <FileText className="size-5" />
                    View Resumes
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cover letters will be listed here in future updates */}
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">
            Coming Soon
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Cover letter management features are under development
          </p>
        </div>
      </main>
    </div>
  )
}
