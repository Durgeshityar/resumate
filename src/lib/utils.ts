import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ResumeServerData } from './types'
import { ResumeValues } from '@/shemas'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value
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
      startDate: exp.startDate?.toString().split('T')[0],
      endDate: exp.endDate?.toString().split('T')[0],
      description: exp.description || undefined,
    })),
    educations: (data.educations || []).map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toString().split('T')[0],
      endDate: edu.endDate?.toString().split('T')[0],
    })),
    projects: (data.projects || []).map((proj) => ({
      title: proj.title || undefined,
      description: proj.description || undefined,
      startDate: proj.startDate?.toString().split('T')[0],
      endDate: proj.endDate?.toString().split('T')[0],
      organisationName: proj.organisationName || undefined,
      projectUrl: proj.projectUrl || undefined,
    })),
    certificates: (data.Certificate || []).map((cert) => ({
      title: cert.title || undefined,
      source: cert.source || undefined,
      duration: cert.duration?.toString() || undefined,
      description: cert.description || undefined,
    })),
    CourseWork: (data.CourseWork || []).map((course) => ({
      title: course.title || undefined,
      source: course.source || undefined,
      duration: course.duration?.toString() || undefined,
      skills: course.skills || undefined,
      description: course.description || undefined,
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    summary: data.summary || undefined,
    colorHex: data.colorHex,
  }
}
