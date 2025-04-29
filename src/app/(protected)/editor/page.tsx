import { currentUser } from '@/lib/auth-util'
import ResumeEditor from './_components/Resume-editor'
import { resumeDataInclude } from '@/lib/types'
import { Metadata } from 'next'
import { db } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Design your resume',
}
interface PageProps {
  searchParams: Promise<{ resumeId?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const resumeId = params.resumeId

  const user = await currentUser()
  if (!user) {
    throw new Error('User not found')
  }
  const userId = user.id as string

  const resumeToEdit = resumeId
    ? await db.resume.findUnique({
        where: {
          id: resumeId,
          userId,
        },
        include: resumeDataInclude,
      })
    : null

  return (
    <>
      <ResumeEditor resumeToEdit={resumeToEdit ?? null} />
    </>
  )
}
