import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { currentUser } from '@/lib/auth-util'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { CoverLetter } from '@prisma/client'
import CoverLetterActions from '@/components/cover-letters/CoverLetterActions'

export const metadata: Metadata = {
  title: 'Cover Letter',
  description: 'View your personalized cover letter',
}

type CoverLetterWithResume = CoverLetter & {
  resume: {
    title: string | null
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CoverLetterPage({ params }: PageProps) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  // Await params before accessing its properties (required in Next.js 15+ dynamic routes)
  const { id } = await params

  if (!id) {
    notFound()
  }

  // Use try-catch to handle potential error if the model isn't available yet
  try {
    const coverLetter = (await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        resume: {
          select: {
            title: true,
          },
        },
      },
    })) as CoverLetterWithResume | null

    if (!coverLetter) {
      notFound()
    }

    const formattedDate = format(coverLetter.createdAt, 'MMMM dd, yyyy')

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col space-y-3 mb-6">
              <Link href="/cover-letters">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Cover Letters
                </Button>
              </Link>
              <CoverLetterActions
                id={coverLetter.id}
                content={coverLetter.content}
              />
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold">{coverLetter.title}</h1>
              <p className="text-muted-foreground mt-1">
                Created on {formattedDate} • Based on resume:{' '}
                {coverLetter.resume.title}
              </p>
            </div>

            <div className="space-y-6 rounded-lg border p-6 bg-white w-full">
              <div className="prose max-w-none whitespace-pre-wrap">
                {coverLetter.content}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error: unknown) {
    console.error('Error loading cover letter:', error)
    // If the model isn't available yet or other error occurs
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">
              Cover Letter Not Available
            </h1>
            <p className="text-muted-foreground mb-6">
              The cover letter feature is currently being set up. Please try
              again later.
            </p>
            <Link href="/cover-letters/new">
              <Button>Create a Cover Letter</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }
}
