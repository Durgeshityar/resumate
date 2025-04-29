'use server'

import { currentUser } from '@/lib/auth-util'
import { resumeSchema, ResumeValues } from '@/shemas'
import { db } from '@/lib/db'

export async function saveResume(values: ResumeValues) {
  const { id } = values

  // Sanitize all dates in projects array before validation
  const sanitizedProjects = values.projects?.map((project) => {
    // For each project, sanitize the dates
    return {
      ...project,
      startDate: sanitizeDateString(project.startDate),
      endDate: sanitizeDateString(project.endDate),
    }
  })

  // Sanitize all dates in workExperiences array before validation
  const sanitizedWorkExperiences = values.workExperiences?.map((exp) => {
    return {
      ...exp,
      startDate: sanitizeDateString(exp.startDate),
      endDate: sanitizeDateString(exp.endDate),
    }
  })

  // Sanitize all dates in educations array before validation
  const sanitizedEducations = values.educations?.map((edu) => {
    return {
      ...edu,
      startDate: sanitizeDateString(edu.startDate),
      endDate: sanitizeDateString(edu.endDate),
    }
  })

  const validatedValues = {
    ...values,
    projects: sanitizedProjects || [],
    workExperiences: sanitizedWorkExperiences || [],
    educations: sanitizedEducations || [],
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
    ? await db.resume.findUnique({ where: { id, userId } })
    : null

  if (id && !existingResume) {
    throw new Error('Resume not found')
  }

  if (id) {
    return db.resume.update({
      where: { id },
      data: {
        ...ResumeValues,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => {
            // Validate dates before creating Date objects
            let startDate = null
            let endDate = null

            try {
              if (
                exp?.startDate &&
                typeof exp.startDate === 'string' &&
                exp.startDate.trim() !== ''
              ) {
                const dateStr = exp.startDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    startDate = parsedDate
                  }
                }
              }

              if (
                exp?.endDate &&
                typeof exp.endDate === 'string' &&
                exp.endDate.trim() !== ''
              ) {
                const dateStr = exp.endDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    endDate = parsedDate
                  }
                }
              }
            } catch (error) {
              console.error('Date parsing error:', error)
              console.log('Invalid date values:', {
                startDate: exp?.startDate,
                endDate: exp?.endDate,
              })
              // Ensure dates are null on error
              startDate = null
              endDate = null
            }

            return {
              position: exp?.position || '',
              company: exp?.company || '',
              startDate,
              endDate,
              description: exp?.description || '',
            }
          }),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => {
            // Validate dates before creating Date objects
            let startDate = null
            let endDate = null

            try {
              if (
                edu?.startDate &&
                typeof edu.startDate === 'string' &&
                edu.startDate.trim() !== ''
              ) {
                const dateStr = edu.startDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    startDate = parsedDate
                  }
                }
              }

              if (
                edu?.endDate &&
                typeof edu.endDate === 'string' &&
                edu.endDate.trim() !== ''
              ) {
                const dateStr = edu.endDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    endDate = parsedDate
                  }
                }
              }
            } catch (error) {
              console.error('Date parsing error:', error)
              console.log('Invalid date values:', {
                startDate: edu?.startDate,
                endDate: edu?.endDate,
              })
              // Ensure dates are null on error
              startDate = null
              endDate = null
            }

            return {
              degree: edu?.degree || '',
              school: edu?.school || '',
              startDate,
              endDate,
            }
          }),
        },
        projects: {
          deleteMany: {},
          create: ResumeValues.projects?.map((project) => {
            // Validate dates before creating Date objects
            let startDate = null
            let endDate = null

            try {
              if (
                project?.startDate &&
                typeof project.startDate === 'string' &&
                project.startDate.trim() !== ''
              ) {
                const dateStr = project.startDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    startDate = parsedDate
                  }
                }
              }

              if (
                project?.endDate &&
                typeof project.endDate === 'string' &&
                project.endDate.trim() !== ''
              ) {
                const dateStr = project.endDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    endDate = parsedDate
                  }
                }
              }
            } catch (error) {
              console.error('Date parsing error:', error)
              console.log('Invalid date values:', {
                startDate: project?.startDate,
                endDate: project?.endDate,
              })
              // Ensure dates are null on error
              startDate = null
              endDate = null
            }

            return {
              title: project?.title || '',
              description: project?.description || '',
              startDate,
              endDate,
              organisationName: project?.organisationName || '',
              projectUrl: project?.projectUrl || '',
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
    return db.resume.create({
      data: {
        ...ResumeValues,
        userId,
        workExperiences: {
          create: workExperiences?.map((exp) => {
            // Validate dates before creating Date objects
            let startDate = null
            let endDate = null

            try {
              if (
                exp?.startDate &&
                typeof exp.startDate === 'string' &&
                exp.startDate.trim() !== ''
              ) {
                const dateStr = exp.startDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    startDate = parsedDate
                  }
                }
              }

              if (
                exp?.endDate &&
                typeof exp.endDate === 'string' &&
                exp.endDate.trim() !== ''
              ) {
                const dateStr = exp.endDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    endDate = parsedDate
                  }
                }
              }
            } catch (error) {
              console.error('Date parsing error:', error)
              console.log('Invalid date values:', {
                startDate: exp?.startDate,
                endDate: exp?.endDate,
              })
              // Ensure dates are null on error
              startDate = null
              endDate = null
            }

            return {
              position: exp?.position || '',
              company: exp?.company || '',
              startDate,
              endDate,
              description: exp?.description || '',
            }
          }),
        },
        educations: {
          create: educations?.map((edu) => {
            // Validate dates before creating Date objects
            let startDate = null
            let endDate = null

            try {
              if (
                edu?.startDate &&
                typeof edu.startDate === 'string' &&
                edu.startDate.trim() !== ''
              ) {
                const dateStr = edu.startDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    startDate = parsedDate
                  }
                }
              }

              if (
                edu?.endDate &&
                typeof edu.endDate === 'string' &&
                edu.endDate.trim() !== ''
              ) {
                const dateStr = edu.endDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    endDate = parsedDate
                  }
                }
              }
            } catch (error) {
              console.error('Date parsing error:', error)
              console.log('Invalid date values:', {
                startDate: edu?.startDate,
                endDate: edu?.endDate,
              })
              // Ensure dates are null on error
              startDate = null
              endDate = null
            }

            return {
              degree: edu?.degree || '',
              school: edu?.school || '',
              startDate,
              endDate,
            }
          }),
        },
        projects: {
          create: ResumeValues.projects?.map((project) => {
            // Validate dates before creating Date objects
            let startDate = null
            let endDate = null

            try {
              if (
                project?.startDate &&
                typeof project.startDate === 'string' &&
                project.startDate.trim() !== ''
              ) {
                const dateStr = project.startDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    startDate = parsedDate
                  }
                }
              }

              if (
                project?.endDate &&
                typeof project.endDate === 'string' &&
                project.endDate.trim() !== ''
              ) {
                const dateStr = project.endDate.trim()
                // Ensure the date string is in YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                  const parsedDate = new Date(dateStr)
                  // Extra validation to ensure date is valid
                  if (
                    !isNaN(parsedDate.getTime()) &&
                    parsedDate.toISOString().slice(0, 10) === dateStr
                  ) {
                    endDate = parsedDate
                  }
                }
              }
            } catch (error) {
              console.error('Date parsing error:', error)
              console.log('Invalid date values:', {
                startDate: project?.startDate,
                endDate: project?.endDate,
              })
              // Ensure dates are null on error
              startDate = null
              endDate = null
            }

            return {
              title: project?.title || '',
              description: project?.description || '',
              startDate,
              endDate,
              organisationName: project?.organisationName || '',
              projectUrl: project?.projectUrl || '',
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

// Helper function to sanitize date strings
function sanitizeDateString(dateStr: string | null | undefined): string {
  if (!dateStr) return ''

  // If it's already a valid YYYY-MM-DD format, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    try {
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return dateStr
      }
    } catch {
      // Fall through to empty string
    }
  }

  return ''
}
