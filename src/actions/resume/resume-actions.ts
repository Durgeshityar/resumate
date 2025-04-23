'use server'

import { currentUser } from '@/lib/auth-util'
import { del } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

export async function deleteResume(id: string) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const userId = user.id

  const resume = await prisma?.resume.findUnique({
    where: { id, userId },
  })

  if (!resume) {
    throw new Error('Resume not found')
  }

  if (resume.photoUrl) {
    await del(resume.photoUrl)
  }

  await prisma?.resume.delete({
    where: { id },
  })

  revalidatePath('/resumes')
}
