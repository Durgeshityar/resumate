import { Metadata } from 'next'

import { currentUser } from '@/lib/auth-util'
import { resumeDataInclude } from '@/lib/types'
import ResumeItem from './_components/resume-item'
import HeroSection from './_components/hero-section'
import { db } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Your Resumes',
  description: 'Create and manage your professional resumes and cover letters',
}

export default async function Page() {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const [resumes, totalCount] = await Promise.all([
    db.resume.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: resumeDataInclude,
    }),
    db.resume.count({
      where: {
        userId: user.id,
      },
    }),
  ])

  const totalResumes = totalCount ?? 0

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <HeroSection canCreate={totalResumes < 1} totalResumes={totalResumes} />

        {resumes && resumes.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resumes.map((resume) => (
                <ResumeItem key={resume.id} resume={resume} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground">
              No resumes yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating your first resume
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
