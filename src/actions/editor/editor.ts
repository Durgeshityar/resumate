'use server'

import { currentUser } from '@/lib/auth-util'
import { resumeSchema, ResumeValues } from '@/shemas'
import { db as prisma } from '@/lib/db'

export async function saveResume(values: ResumeValues) {
  const { id } = values

  const validatedValues = {
    ...values,
    certificates: values.certificates || [],
    CourseWork: values.CourseWork || [],
  }

  const {
    workExperiences,
    educations,
    certificates,
    CourseWork,
    ...ResumeValues
  } = resumeSchema.parse(validatedValues)

  const user = await currentUser()
  if (!user) {
    throw new Error('User not found')
  }
  const userId = user.id as string

  // TODO: check resume counts for non-premium users

  const existingResume = id
    ? await prisma?.resume.findUnique({ where: { id, userId } })
    : null

  if (id && !existingResume) {
    throw new Error('Resume not found')
  }

  if (id) {
    return prisma?.resume.update({
      where: { id },
      data: {
        ...ResumeValues,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate:
              exp.startDate && exp.startDate.trim() !== ''
                ? new Date(exp.startDate)
                : null,
            endDate:
              exp.endDate && exp.endDate.trim() !== ''
                ? new Date(exp.endDate)
                : null,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate:
              edu.startDate && edu.startDate.trim() !== ''
                ? new Date(edu.startDate)
                : null,
            endDate:
              edu.endDate && edu.endDate.trim() !== ''
                ? new Date(edu.endDate)
                : null,
          })),
        },
        projects: {
          deleteMany: {},
          create: ResumeValues.projects?.map((project) => {
            // Validate dates before creating Date objects
            let startDate = null
            let endDate = null

            try {
              if (project?.startDate && project.startDate.trim() !== '') {
                const date = new Date(project.startDate)
                if (!isNaN(date.getTime())) {
                  startDate = date
                }
              }

              if (project?.endDate && project.endDate.trim() !== '') {
                const date = new Date(project.endDate)
                if (!isNaN(date.getTime())) {
                  endDate = date
                }
              }
            } catch (error) {
              console.error('Date parsing error:', error)
              console.log('Invalid date values:', {
                startDate: project?.startDate,
                endDate: project?.endDate,
              })
            }

            return {
              title: project?.title,
              description: project?.description,
              startDate,
              endDate,
              organisationName: project?.organisationName,
              projectUrl: project?.projectUrl,
            }
          }),
        },
        Certificate: {
          deleteMany: {},
          create: certificates?.map((cert) => ({
            title: cert?.title,
            description: cert?.description,
            source: cert?.source,
            duration:
              cert?.duration && cert.duration.trim() !== ''
                ? new Date(cert.duration)
                : null,
          })),
        },
        CourseWork: {
          deleteMany: {},
          create: CourseWork?.map((course) => ({
            title: course?.title,
            description: course?.description,
            source: course?.source,
            duration:
              course?.duration && course.duration.trim() !== ''
                ? new Date(course.duration)
                : null,
            skills: course?.skills,
          })),
        },
        updatedAt: new Date(),
      },
    })
  } else {
    return prisma?.resume.create({
      data: {
        ...ResumeValues,
        userId,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate:
              exp.startDate && exp.startDate.trim() !== ''
                ? new Date(exp.startDate)
                : null,
            endDate:
              exp.endDate && exp.endDate.trim() !== ''
                ? new Date(exp.endDate)
                : null,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate:
              edu.startDate && edu.startDate.trim() !== ''
                ? new Date(edu.startDate)
                : null,
            endDate:
              edu.endDate && edu.endDate.trim() !== ''
                ? new Date(edu.endDate)
                : null,
          })),
        },
        projects: {
          create: ResumeValues.projects?.map((project) => {
            // Validate dates before creating Date objects
            let startDate = null
            let endDate = null

            try {
              if (project?.startDate && project.startDate.trim() !== '') {
                const date = new Date(project.startDate)
                if (!isNaN(date.getTime())) {
                  startDate = date
                }
              }

              if (project?.endDate && project.endDate.trim() !== '') {
                const date = new Date(project.endDate)
                if (!isNaN(date.getTime())) {
                  endDate = date
                }
              }
            } catch (error) {
              console.error('Date parsing error:', error)
              console.log('Invalid date values:', {
                startDate: project?.startDate,
                endDate: project?.endDate,
              })
            }

            return {
              title: project?.title,
              description: project?.description,
              startDate,
              endDate,
              organisationName: project?.organisationName,
              projectUrl: project?.projectUrl,
            }
          }),
        },
        Certificate: {
          create: certificates?.map((cert) => ({
            title: cert?.title,
            description: cert?.description,
            source: cert?.source,
            duration:
              cert?.duration && cert.duration.trim() !== ''
                ? new Date(cert.duration)
                : null,
          })),
        },
        CourseWork: {
          create: CourseWork?.map((course) => ({
            title: course?.title,
            description: course?.description,
            source: course?.source,
            duration:
              course?.duration && course.duration.trim() !== ''
                ? new Date(course.duration)
                : null,
            skills: course?.skills,
          })),
        },
      },
    })
  }
}
