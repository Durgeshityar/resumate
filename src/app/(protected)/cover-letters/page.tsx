import { Metadata } from 'next'
import { currentUser } from '@/lib/auth-util'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { CoverLetter } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Cover Letters',
  description: 'Manage your personalized cover letters',
}

type CoverLetterWithResume = CoverLetter & {
  resume: {
    title: string | null
  }
}

export default async function CoverLettersPage() {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  // Use try-catch to handle potential errors if the model isn't available yet
  let coverLetters: CoverLetterWithResume[] = []

  try {
    coverLetters = await db.coverLetter.findMany({
      where: {
        userId: user.id,
      },
      include: {
        resume: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  } catch (error) {
    // If there's an error, we'll just show an empty list
    console.error('Error fetching cover letters:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Cover Letters</h1>
            <Link href="/cover-letters/new">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                New Cover Letter
              </Button>
            </Link>
          </div>

          {coverLetters.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {coverLetters.map((letter) => (
                <Link
                  key={letter.id}
                  href={`/cover-letters/${letter.id}`}
                  className="block"
                >
                  <div className="h-full border rounded-lg p-5 hover:border-primary/50 transition-colors">
                    <FileText className="text-muted-foreground mb-3 h-6 w-6" />
                    <h2 className="font-semibold mb-1 line-clamp-1">
                      {letter.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">
                      Based on: {letter.resume.title || 'Untitled Resume'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {format(letter.updatedAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border rounded-lg">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No cover letters yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create personalized cover letters based on your resume and job
                descriptions.
              </p>
              <Link href="/cover-letters/new">
                <Button>Create Your First Cover Letter</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
