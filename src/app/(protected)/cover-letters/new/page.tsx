import { Metadata } from 'next'
import { currentUser } from '@/lib/auth-util'
import { resumeDataInclude } from '@/lib/types'
import { db } from '@/lib/db'
import CoverLetterForm from '@/components/cover-letters/CoverLetterForm'

export const metadata: Metadata = {
  title: 'Generate Cover Letter',
  description: 'Create a personalized cover letter based on your resume',
}

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>
}

export default async function NewCoverLetterPage({ searchParams }: PageProps) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const { resumeId } = await searchParams

  const resume = resumeId
    ? await db.resume.findFirst({
        where: {
          id: resumeId,
          userId: user.id,
        },
        include: resumeDataInclude,
      })
    : null

  const userResumes = await db.resume.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Generate Cover Letter</h1>

          <div className="space-y-6 rounded-lg border p-6">
            <CoverLetterForm
              resume={resume}
              resumeId={resumeId}
              userResumes={userResumes as { id: string; title: string }[]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
