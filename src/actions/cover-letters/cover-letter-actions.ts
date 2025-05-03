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
      tone: toneSetting,
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

    // Check if this is a software engineering position
    const isSoftwareEngineer =
      jobTitle.toLowerCase().includes('software') ||
      jobTitle.toLowerCase().includes('developer') ||
      jobTitle.toLowerCase().includes('engineer') ||
      jobTitle.toLowerCase().includes('programmer') ||
      jobTitle.toLowerCase().includes('full stack') ||
      jobTitle.toLowerCase().includes('frontend') ||
      jobTitle.toLowerCase().includes('backend')

    // Adjust language based on tone
    const toneAdjustedLanguage = getLanguageForTone(toneSetting)

    let coverLetterContent = ''

    if (isSoftwareEngineer) {
      // Specialized content for software engineering positions
      coverLetterContent = `${currentDate}

${salutation}

I am writing to express my ${
        toneAdjustedLanguage.interest
      } in the ${jobTitle} position at ${companyName}. As a software professional with expertise in ${skillsList}, I am ${
        toneAdjustedLanguage.confidence
      } in my ability to contribute to your technical team and drive innovation.

${
  customNotes ? customNotes + '\n\n' : ''
}The technical requirements in your job description align perfectly with my experience in ${extractedSkills}. In my role at ${companyExperience}, I ${
        toneAdjustedLanguage.successfully
      } ${relevantAchievement}. This demonstrates my ability to deliver robust, scalable solutions while maintaining clean, maintainable code.

What ${
        toneAdjustedLanguage.draw
      } me to ${companyName} is your ${companyValueOrProject}. I am particularly ${
        toneAdjustedLanguage.excited
      } about applying my expertise in ${relevantSkillsToHighlight} to tackle complex technical challenges and contribute to your engineering team's success. My experience with modern development practices, including agile methodologies, test-driven development, and continuous integration/deployment, positions me well to integrate seamlessly with your team.

Thank you for considering my application. I ${
        toneAdjustedLanguage.lookForward
      } to discussing how my technical skills and problem-solving approach align with your engineering needs and how I can contribute to your development initiatives.

${toneAdjustedLanguage.closing},
${resume.firstName || ''} ${resume.lastName || ''}
${resume.email || ''}
${resume.phone || ''}
`
    } else if (isHealthCoach) {
      // Specialized content for health coaching positions
      coverLetterContent = `${currentDate}

${salutation}

I am writing to express my ${
        toneAdjustedLanguage.interest
      } in the ${jobTitle} position at ${companyName}. With my background in ${skillsList} and ${
        toneAdjustedLanguage.passion
      } for promoting holistic wellness and sustainable lifestyle changes, I am ${
        toneAdjustedLanguage.confidence
      } to help your clients achieve their health and wellness goals.

${
  customNotes ? customNotes + '\n\n' : ''
}After reviewing the job description, I understand you're seeking a ${
        toneAdjustedLanguage.professional
      } who can ${extractedSkills}. During my time at ${companyExperience}, I ${
        toneAdjustedLanguage.successfully
      } ${relevantAchievement}, demonstrating my ability to connect with clients and guide them toward their personal health milestones.

What ${
        toneAdjustedLanguage.draw
      } me to ${companyName} is your commitment to ${companyValueOrProject}. I am ${
        toneAdjustedLanguage.excited
      } about the opportunity to bring my expertise in ${relevantSkillsToHighlight} to your team and contribute to your mission of transforming lives through evidence-based coaching and personalized wellness strategies.

Thank you for considering my application. I ${
        toneAdjustedLanguage.lookForward
      } to discussing how my approach to health coaching aligns with your vision and how I can contribute to your clients' success.

${toneAdjustedLanguage.closing},
${resume.firstName || ''} ${resume.lastName || ''}
${resume.email || ''}
${resume.phone || ''}
`
    } else {
      // General professional cover letter for other positions
      coverLetterContent = `${currentDate}

${salutation}

I am writing to express my ${
        toneAdjustedLanguage.interest
      } in the ${jobTitle} position at ${companyName}. With my background in ${skillsList}, I am ${
        toneAdjustedLanguage.confidence
      } in my ability to contribute effectively to your team.

${
  customNotes ? customNotes + '\n\n' : ''
}After reviewing the job description, I understand you're seeking a ${
        toneAdjustedLanguage.professional
      } with experience in ${extractedSkills}. During my time at ${companyExperience}, I ${
        toneAdjustedLanguage.successfully
      } ${relevantAchievement}, which directly relates to the requirements of this position.

I am ${
        toneAdjustedLanguage.draw
      } to ${companyName} because of your focus on ${companyValueOrProject}. I am ${
        toneAdjustedLanguage.excited
      } about the opportunity to bring my expertise in ${relevantSkillsToHighlight} to your team and contribute to your continued success.

Thank you for considering my application. I ${
        toneAdjustedLanguage.lookForward
      } to the opportunity to discuss how my skills and experiences align with your needs.

${toneAdjustedLanguage.closing},
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
  // We need this parameter for the type signature but don't use it directly in the current implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  workExperiences: {
    id: string
    resumeId: string
    createdAt: Date
    updatedAt: Date
    company: string | null
    position: string | null
    startDate: Date | null
    endDate: Date | null
    description: string | null
    tasks?: string[] | null
  }[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  jobDescriptionText: string
): string {
  // We're not using lastExperience but keeping it commented for future use
  // const lastExperience = workExperiences.length > 0 ? workExperiences[0] : null

  if (
    jobTitle.toLowerCase().includes('health') ||
    jobTitle.toLowerCase().includes('coach') ||
    jobTitle.toLowerCase().includes('wellness')
  ) {
    return 'helped clients achieve sustainable health improvements through personalized coaching and evidence-based strategies'
  }

  if (
    jobTitle.toLowerCase().includes('developer') ||
    jobTitle.toLowerCase().includes('engineer') ||
    jobTitle.toLowerCase().includes('programmer')
  ) {
    const technicalAchievements = [
      'led the development of scalable microservices that improved system performance by 40%',
      'implemented automated testing pipelines that reduced deployment time by 60%',
      'architected and delivered robust full-stack solutions that enhanced user experience and increased customer satisfaction',
      'optimized database queries and application performance, resulting in 50% faster load times',
      'developed reusable components and libraries that accelerated team productivity by 30%',
    ]
    return technicalAchievements[
      Math.floor(Math.random() * technicalAchievements.length)
    ]
  }

  if (
    jobTitle.toLowerCase().includes('manager') ||
    jobTitle.toLowerCase().includes('lead')
  ) {
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

  // Check if this is a software engineering position
  const isTechnicalRole =
    descriptionLower.includes('developer') ||
    descriptionLower.includes('engineer') ||
    descriptionLower.includes('programmer') ||
    descriptionLower.includes('software') ||
    descriptionLower.includes('full stack') ||
    descriptionLower.includes('frontend') ||
    descriptionLower.includes('backend')

  if (isTechnicalRole) {
    // Technical skills to prioritize
    const technicalSkills = skills.filter((skill) =>
      [
        'javascript',
        'typescript',
        'react',
        'node',
        'python',
        'java',
        'c++',
        'aws',
        'docker',
        'kubernetes',
        'ci/cd',
        'microservices',
        'rest api',
        'sql',
        'nosql',
        'git',
      ].some((tech) => skill.toLowerCase().includes(tech.toLowerCase()))
    )

    if (technicalSkills.length > 0) {
      return technicalSkills.slice(0, 3).join(', ')
    }
  }

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

// Helper function to adjust language based on tone
function getLanguageForTone(tone?: string): Record<string, string> {
  switch (tone?.toLowerCase()) {
    case 'professional':
      return {
        interest: 'strong interest',
        passion: 'professional commitment',
        confidence: 'well-qualified',
        professional: 'qualified candidate',
        successfully: 'effectively executed',
        draw: 'particularly interests',
        excited: 'enthusiastic',
        lookForward: 'look forward',
        closing: 'Sincerely',
      }
    case 'friendly':
      return {
        interest: 'enthusiasm',
        passion: 'genuine passion',
        confidence: 'excited',
        professional: 'dedicated individual',
        successfully: 'happily accomplished',
        draw: 'really attracts',
        excited: 'thrilled',
        lookForward: 'am eager',
        closing: 'Warm regards',
      }
    case 'confident':
      return {
        interest: 'keen interest',
        passion: 'strong drive',
        confidence: 'highly confident in my ability',
        professional: 'proven performer',
        successfully: 'decisively achieved',
        draw: 'strongly attracted',
        excited: 'confident',
        lookForward: 'am prepared',
        closing: 'Best regards',
      }
    case 'humble':
      return {
        interest: 'sincere interest',
        passion: 'genuine dedication',
        confidence: 'hopeful',
        professional: 'diligent worker',
        successfully: 'worked hard to accomplish',
        draw: 'humbly admire',
        excited: 'grateful',
        lookForward: 'would appreciate',
        closing: 'With appreciation',
      }
    default:
      return {
        interest: 'interest',
        passion: 'passion',
        confidence: 'well-positioned',
        professional: 'dedicated professional',
        successfully: 'successfully',
        draw: 'particularly draws',
        excited: 'excited',
        lookForward: 'look forward',
        closing: 'Sincerely',
      }
  }
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
