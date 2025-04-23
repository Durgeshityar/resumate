import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const optionalString = z.string().trim().optional().or(z.literal(''))

// RESUME SCHEMA

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
})

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>

export const personalInfoSchema = z.object({
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
  linkedinUrl: optionalString,
  xUrl: optionalString,
  githubUrl: optionalString,
})

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      })
    )
    .optional(),
})

export type workExperienceValues = z.infer<typeof workExperienceSchema>

export type workExperience = NonNullable<
  z.infer<typeof workExperienceSchema>['workExperiences']
>[number]

export const projectSchema = z.object({
  projects: z
    .array(
      z.object({
        title: optionalString,
        organisationName: optionalString,
        projectUrl: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      })
    )
    .optional(),
})

export type ProjectValues = z.infer<typeof projectSchema>

export type project = NonNullable<
  z.infer<typeof projectSchema>['projects']
>[number]

export const certificateSchema = z.object({
  certificates: z
    .array(
      z.object({
        title: optionalString,
        source: optionalString,
        duration: optionalString,
        description: optionalString,
      })
    )
    .optional(),
})

export type CertificateValues = z.infer<typeof certificateSchema>

export const courseworkSchema = z.object({
  CourseWork: z
    .array(
      z.object({
        title: optionalString,
        source: optionalString,
        duration: optionalString,
        skills: optionalString,
        description: optionalString,
      })
    )
    .optional(),
})

export type CourseWorkValues = z.infer<typeof courseworkSchema>

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      })
    )
    .optional(),
})

export type EducationValues = z.infer<typeof educationSchema>

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
})

export type SkillsValues = z.infer<typeof skillsSchema>

export const summarySchema = z.object({
  summary: optionalString,
})

export type SummaryValues = z.infer<typeof summarySchema>

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...projectSchema.shape,
  ...courseworkSchema.shape,
  ...certificateSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
})

export type ResumeValues = z.infer<typeof resumeSchema> & {
  id?: string
}

// AI fearures Schema

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .min(20, 'Must be atleast 20 Characters'),
})

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
})

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>

export const generateProjectSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .min(20, 'Must be at least 20 Characters'),
})

export type GenerateProjectInput = z.infer<typeof generateProjectSchema>

// AUTH SCHEMA

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    { message: 'New Password is required!', path: ['newPassword'] }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false
      }

      return true
    },
    { message: 'Password is required!', path: ['password'] }
  )

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  code: z.optional(z.string()),
})

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
})

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Minimum 6 characters required' }),
})

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(6, { message: 'Minimum 6 characters required' }),
})
