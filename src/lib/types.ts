import { ResumeValues } from '@/shemas'
import { Prisma } from '@prisma/client'

export interface DocumentEditorFormProps {
  resumeData: ResumeValues
  setResumeData: (data: ResumeValues) => void
}

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
  projects: true,
  Certificate: true,
  CourseWork: true,
} satisfies Prisma.ResumeInclude

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude
}>
