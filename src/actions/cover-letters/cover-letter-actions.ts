'use server'

import { currentUser } from '@/lib/auth-util'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createCoverLetter(formData: {
  resumeId: string
  jobTitle: string
  companyName: string
  jobDescription: string
  hiringManager?: string
  customNotes?: string
  tone?: string
}) {
  try {
    const user = await currentUser()

    if (!user || !user.id) {
      throw new Error('Unauthorized')
    }

    const {
      resumeId,
      jobTitle,
      companyName,
      jobDescription,
      hiringManager,
      customNotes,
      tone,
    } = formData

    if (!resumeId || !jobTitle || !companyName || !jobDescription) {
      throw new Error('Missing required fields')
    }

    // Verify that the resume belongs to the user
    const resume = await db.resume.findFirst({
      where: {
        id: resumeId,
        userId: user.id,
      },
    })

    if (!resume) {
      throw new Error('Resume not found')
    }

    // Get work experiences and skills from the resume
    const workExperiences = await db.workExperience.findMany({
      where: { resumeId },
      orderBy: { startDate: 'desc' },
    })

    // Sample structure of a cover letter
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const salutation = hiringManager
      ? `Dear ${hiringManager},`
      : 'Dear Hiring Manager,'

    const skillsList = resume.skills?.join(', ') || ''
    const companyExperience = workExperiences[0]?.company || 'my previous role'

    // Extract key skills/requirements from job description
    const extractedSkills = extractSkillsFromJobDescription(
      jobDescription,
      skillsList
    )

    // Extract achievements relevant to the position
    const relevantAchievement = generateRelevantAchievement(
      jobTitle,
      workExperiences,
      jobDescription
    )

    // Identify company values or projects
    const companyValueOrProject = identifyCompanyValue(
      companyName,
      jobDescription
    )

    // Identify relevant skills to highlight
    const relevantSkillsToHighlight = identifyRelevantSkills(
      skillsList,
      jobDescription
    )

    // Check if this is a health coaching position
    const isHealthCoach =
      jobTitle.toLowerCase().includes('health') &&
      (jobTitle.toLowerCase().includes('coach') ||
        jobTitle.toLowerCase().includes('wellness') ||
        jobTitle.toLowerCase().includes('fitness'))

    let coverLetterContent = ''

    if (isHealthCoach) {
      // Specialized content for health coaching positions
      coverLetterContent = `${currentDate}

${salutation}

I am writing to express my interest in the ${jobTitle} position at ${companyName}. With my background in ${skillsList} and passion for promoting holistic wellness and sustainable lifestyle changes, I am well-positioned to help your clients achieve their health and wellness goals.

${
  customNotes ? customNotes + '\n\n' : ''
}After reviewing the job description, I understand you're seeking a dedicated professional who can ${extractedSkills}. During my time at ${companyExperience}, I successfully ${relevantAchievement}, demonstrating my ability to connect with clients and guide them toward their personal health milestones.

What particularly draws me to ${companyName} is your commitment to ${companyValueOrProject}. I am excited about the opportunity to bring my expertise in ${relevantSkillsToHighlight} to your team and contribute to your mission of transforming lives through evidence-based coaching and personalized wellness strategies.

Thank you for considering my application. I look forward to discussing how my approach to health coaching aligns with your vision and how I can contribute to your clients' success.

Sincerely,
${resume.firstName || ''} ${resume.lastName || ''}
${resume.email || ''}
${resume.phone || ''}
`
    } else {
      // General professional cover letter for other positions
      coverLetterContent = `${currentDate}

${salutation}

I am writing to express my interest in the ${jobTitle} position at ${companyName}. With my background in ${skillsList}, I am confident in my ability to contribute effectively to your team.

${
  customNotes ? customNotes + '\n\n' : ''
}After reviewing the job description, I understand you're seeking a professional with experience in ${extractedSkills}. During my time at ${companyExperience}, I successfully ${relevantAchievement}, which directly relates to the requirements of this position.

I am particularly drawn to ${companyName} because of your focus on ${companyValueOrProject}. I am excited about the opportunity to bring my expertise in ${relevantSkillsToHighlight} to your team and contribute to your continued success.

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experiences align with your needs.

Sincerely,
${resume.firstName || ''} ${resume.lastName || ''}
${resume.email || ''}
${resume.phone || ''}
`
    }

    // Create the cover letter in the database
    const coverLetter = await db.coverLetter.create({
      data: {
        title: `${jobTitle} at ${companyName}`,
        content: coverLetterContent,
        jobTitle,
        companyName,
        resumeId,
        userId: user.id,
      },
    })

    revalidatePath('/cover-letters')
    return { success: true, data: coverLetter }
  } catch (error) {
    console.error('Error generating cover letter:', error)
    return { success: false, error: String(error) }
  }
}

// Helper function to extract key skills/requirements from job description
function extractSkillsFromJobDescription(
  jobDescription: string,
  userSkills: string
): string {
  // Simple extraction based on common skill keywords
  const userSkillsArray = userSkills
    .split(',')
    .map((skill) => skill.trim().toLowerCase())
  const skillKeywords = [
    'communication',
    'leadership',
    'teamwork',
    'problem-solving',
    'creativity',
    'adaptability',
    'time management',
    'organization',
    'react',
    'javascript',
    'typescript',
    'node',
    'html',
    'css',
    'customer service',
    'client management',
    'coaching',
    'mentoring',
    'nutrition',
    'fitness',
    'wellness',
    'health',
    'patient care',
    'meal planning',
    'behavioral change',
    'motivational interviewing',
  ]

  const matchedSkills = skillKeywords.filter(
    (keyword) =>
      jobDescription.toLowerCase().includes(keyword) &&
      userSkillsArray.some((userSkill) =>
        userSkill.includes(keyword.toLowerCase())
      )
  )

  if (matchedSkills.length > 0) {
    return (
      matchedSkills.slice(0, 3).join(', ') +
      (matchedSkills.length > 3 ? ', and related competencies' : '')
    )
  }

  return 'various technical and interpersonal skills relevant to this role'
}

// Helper function to generate achievement relevant to job
function generateRelevantAchievement(
  jobTitle: string,
  workExperiences: any[],
  jobDescription: string
): string {
  if (workExperiences.length === 0) {
    return 'delivered exceptional results and developed skills directly applicable to this position'
  }

  const lastExperience = workExperiences[0]
  const jobTitleLower = jobTitle.toLowerCase()

  if (
    jobTitleLower.includes('health') ||
    jobTitleLower.includes('coach') ||
    jobTitleLower.includes('wellness')
  ) {
    return 'helped clients achieve sustainable health improvements through personalized coaching and evidence-based strategies'
  }

  if (
    jobTitleLower.includes('developer') ||
    jobTitleLower.includes('engineer') ||
    jobTitleLower.includes('programmer')
  ) {
    return 'developed robust, scalable solutions that improved efficiency and user experience'
  }

  if (jobTitleLower.includes('manager') || jobTitleLower.includes('lead')) {
    return 'led teams to exceed targets and implemented processes that improved operational efficiency'
  }

  return 'achieved significant results that demonstrate my capabilities in areas relevant to this position'
}

// Helper function to identify company values or projects
function identifyCompanyValue(
  companyName: string,
  jobDescription: string
): string {
  const description = jobDescription.toLowerCase()

  if (
    description.includes('innovation') ||
    description.includes('cutting-edge')
  ) {
    return 'innovation and cutting-edge approach to the industry'
  }

  if (
    description.includes('client') ||
    description.includes('customer') ||
    description.includes('service')
  ) {
    return 'client-centered approach and commitment to exceptional service'
  }

  if (
    description.includes('health') ||
    description.includes('wellness') ||
    description.includes('wellbeing')
  ) {
    return 'holistic approach to health and commitment to client wellbeing'
  }

  return 'commitment to excellence and industry leadership'
}

// Helper function to identify relevant skills to highlight
function identifyRelevantSkills(
  skillsList: string,
  jobDescription: string
): string {
  const skills = skillsList.split(',').map((skill) => skill.trim())
  const descriptionLower = jobDescription.toLowerCase()

  const matchedSkills = skills.filter((skill) =>
    descriptionLower.includes(skill.toLowerCase())
  )

  if (matchedSkills.length > 0) {
    return matchedSkills.slice(0, 2).join(' and ')
  }

  if (
    descriptionLower.includes('health') ||
    descriptionLower.includes('wellness') ||
    descriptionLower.includes('coaching')
  ) {
    return 'personalized coaching and evidence-based wellness strategies'
  }

  return skills.slice(0, 2).join(' and ')
}

export async function deleteCoverLetter(id: string) {
  try {
    const user = await currentUser()

    if (!user || !user.id) {
      throw new Error('Unauthorized')
    }

    const coverLetter = await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!coverLetter) {
      throw new Error('Cover letter not found')
    }

    await db.coverLetter.delete({
      where: { id },
    })

    revalidatePath('/cover-letters')
    return { success: true }
  } catch (error) {
    console.error('Error deleting cover letter:', error)
    return { success: false, error: String(error) }
  }
}

export async function updateCoverLetter(id: string, content: string) {
  try {
    const user = await currentUser()

    if (!user || !user.id) {
      throw new Error('Unauthorized')
    }

    const coverLetter = await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!coverLetter) {
      throw new Error('Cover letter not found')
    }

    const updatedCoverLetter = await db.coverLetter.update({
      where: { id },
      data: { content },
    })

    revalidatePath(`/cover-letters/${id}`)
    return { success: true, data: updatedCoverLetter }
  } catch (error) {
    console.error('Error updating cover letter:', error)
    return { success: false, error: String(error) }
  }
}
