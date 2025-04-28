import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ResumeServerData } from './types'
import { ResumeValues } from '@/shemas'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    linkedinUrl: data.linkedinUrl || undefined,
    xUrl: data.xUrl || undefined,
    githubUrl: data.githubUrl || undefined,
    workExperiences: (data.workExperiences || []).map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: formatDateForInput(exp.startDate),
      endDate: formatDateForInput(exp.endDate),
      description: exp.description || undefined,
    })),
    educations: (data.educations || []).map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: formatDateForInput(edu.startDate),
      endDate: formatDateForInput(edu.endDate),
    })),
    projects: (data.projects || []).map((proj) => ({
      title: proj.title || undefined,
      description: proj.description || undefined,
      startDate: formatDateForInput(proj.startDate),
      endDate: formatDateForInput(proj.endDate),
      organisationName: proj.organisationName || undefined,
      projectUrl: proj.projectUrl || undefined,
    })),
    certificates: (data.Certificate || []).map((cert) => ({
      title: cert.title || undefined,
      source: cert.source || undefined,
      duration: formatDateForInput(cert.duration),
      description: cert.description || undefined,
    })),
    CourseWork: (data.CourseWork || []).map((course) => ({
      title: course.title || undefined,
      source: course.source || undefined,
      duration: formatDateForInput(course.duration),
      skills: course.skills || undefined,
      description: course.description || undefined,
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    summary: data.summary || undefined,
    colorHex: data.colorHex,
  }
}

// Helper function to format dates as YYYY-MM-DD for input fields
export function formatDateForInput(
  date: Date | string | null | undefined
): string {
  if (!date) return ''

  try {
    // If it's already a string, try to parse it
    const dateObj = typeof date === 'string' ? new Date(date) : date

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return ''

    // Format as YYYY-MM-DD
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}
