import { Metadata } from 'next'
import { currentUser } from '@/lib/auth-util'
import { resumeDataInclude } from '@/lib/types'
import { db } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Generate Cover Letter',
  description: 'Create a personalized cover letter based on your resume',
}

export default async function NewCoverLetterPage({
  searchParams,
}: {
  searchParams: { resumeId?: string }
}) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const params = await searchParams
  const resumeId = params.resumeId

  const resume = resumeId
    ? await db.resume.findFirst({
        where: {
          id: resumeId,
          userId: user.id,
        },
        include: resumeDataInclude,
      })
    : null

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Generate Cover Letter</h1>

          {/* Cover letter generation form will be added here */}
          <div className="space-y-6 rounded-lg border p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {resume ? 'Using Resume: ' + resume.title : 'Select a Resume'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {resume
                  ? 'Your cover letter will be generated based on this resume'
                  : 'Please select a resume to generate a matching cover letter'}
              </p>
            </div>

            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground">
                Coming Soon
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Cover letter generation features are under development
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
