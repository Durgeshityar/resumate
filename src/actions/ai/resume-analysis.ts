'use server'

import openAI from '@/lib/openai'
import { ResumeValues } from '@/shemas'

export interface AtsAnalysisResult {
  score: number
  matched_keywords: string[]
  missing_keywords: string[]
  sections_to_improve: {
    skills?: string[]
    experience?: string[]
    summary?: string[]
    education?: string[]
    projects?: string[]
    personal_info?: string[]
    contact_info?: string[]
  }
  recommendations: string[]
  content_issues: {
    duplicates?: string[]
    missing_info?: string[]
    weak_content?: string[]
    missing_sections?: string[]
  }
  section_scores: {
    personal_info?: number
    contact_info?: number
    experience?: number
    education?: number
    skills?: number
    projects?: number
    summary?: number
  }
}

export async function analyzeResume(
  resumeData: ResumeValues,
  jobDescription: string
): Promise<AtsAnalysisResult> {
  try {
    // Pre-analysis to check for completeness of essential sections
    const hasMissingEssentials = checkForMissingEssentials(resumeData)

    // Explicitly check for missing project titles
    const hasMissingProjectTitles =
      resumeData.projects &&
      resumeData.projects.length > 0 &&
      resumeData.projects.some(
        (project) => !project.title || project.title.trim() === ''
      )

    // Construct relevant resume data for analysis with all available details
    const resume = {
      summary: resumeData.summary,
      skills: resumeData.skills || [],
      firstName: resumeData.firstName,
      lastName: resumeData.lastName,
      jobTitle: resumeData.jobTitle,
      email: resumeData.email,
      phone: resumeData.phone,
      city: resumeData.city,
      country: resumeData.country,
      linkedinUrl: resumeData.linkedinUrl,
      githubUrl: resumeData.githubUrl,
      workExperiences: resumeData.workExperiences?.map((exp) => ({
        position: exp.position,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
      })),
      educations: resumeData.educations?.map((edu) => ({
        degree: edu.degree,
        school: edu.school,
        startDate: edu.startDate,
        endDate: edu.endDate,
      })),
      projects: resumeData.projects?.map((proj) => ({
        title: proj.title,
        description: proj.description,
        startDate: proj.startDate,
        endDate: proj.endDate,
        organisationName: proj.organisationName,
        projectUrl: proj.projectUrl,
      })),
      certificates: resumeData.certificates?.map((cert) => ({
        title: cert.title,
        source: cert.source,
        description: cert.description,
      })),
      courseWork: resumeData.CourseWork?.map((course) => ({
        title: course.title,
        source: course.source,
        skills: course.skills,
        description: course.description,
      })),
    }

    const systemMessage = `
      You are an ATS (Applicant Tracking System) expert and resume analyzer with extensive experience in HR and recruitment.
      
      Analyze the resume against the provided job description and provide a thorough, critical analysis. You must be VERY strict about missing information and incomplete sections. You should:
      
      1. Evaluate the overall ATS compatibility score (0-100), being extremely strict about missing essential information
      2. Assign specific scores to each section (personal info, contact info, experience, education, skills, projects, summary)
      3. Heavily penalize missing or incomplete sections - a resume without complete personal info, contact details, or education should NEVER score above 60
      4. Identify exact keyword matches between the resume and job description
      5. Identify important missing keywords from the job description
      6. Perform a thorough quality analysis of each section to identify:
         - Completely missing sections (e.g., no education, no contact info)
         - Duplicate content (especially in work experience or projects)
         - Missing essential information (e.g., project URLs, dates, quantifiable achievements)
         - Weak or generic content that needs strengthening
         - Sections that need to be expanded with specific details from the job description
      7. Provide specific, actionable recommendations for improving each section
      
      Be extremely thorough and critical. Do NOT overlook missing sections or information.
      
      IMPORTANT: Be especially vigilant about missing fields in projects. Specifically check if any projects are missing titles, descriptions, or URLs, and mention these issues in your analysis. A project without a title is incomplete and should be flagged as a critical issue. Check for empty strings and whitespace-only titles as well.
      
      ONLY return a valid JSON object in this exact format and nothing else:
      {
        "score": 40,
        "section_scores": {
          "personal_info": 20,
          "contact_info": 40,
          "experience": 70,
          "education": 0,
          "skills": 60,
          "projects": 40,
          "summary": 50
        },
        "matched_keywords": ["React", "TypeScript", "Next.js"],
        "missing_keywords": ["Jest", "Unit Testing", "Agile"],
        "sections_to_improve": {
          "skills": ["Add 'Jest' and 'Unit Testing' under technical skills.", "Add 'AWS' which appears 3 times in the job description."],
          "experience": ["Include specific examples of Agile environment work.", "First work experience lacks quantifiable achievements."],
          "summary": ["No mention of key technologies: React, TypeScript that are in the job description.", "Summary is too generic and doesn't highlight relevant experience."],
          "education": ["Education section is completely missing - add your educational background."],
          "personal_info": ["Missing your full name and professional title."],
          "contact_info": ["No phone number or professional email provided."],
          "projects": ["Missing URLs for your React projects.", "Project descriptions don't mention specific technologies used.", "Some projects are missing titles which is essential for ATS parsing."]
        },
        "content_issues": {
          "duplicates": ["Work experience entries for Company X appear to be duplicated with minimal changes.", "Skills 'JavaScript' and 'JS' are duplicates."],
          "missing_info": ["No portfolio or project links provided.", "Missing measurable achievements in work experience.", "Project titles are missing in some entries."],
          "weak_content": ["Project descriptions are too vague. Add specific technologies and your contribution.", "Work experience bullet points use weak verbs like 'worked on' instead of action verbs."],
          "missing_sections": ["Education section is completely missing.", "Contact information is incomplete."]
        },
        "recommendations": [
          "Add your complete education history - this is essential for most employers.",
          "Complete your personal and contact information sections - these are required for ATS systems.",
          "Add metrics to your achievements (e.g., 'Reduced load time by 30% using Next.js').",
          "Use more powerful action verbs at the beginning of experience bullet points.",
          "Add a 'Technologies Used' subsection to each project.",
          "Remove duplicate work experiences and expand on unique contributions in each role.",
          "Ensure all URLs and links are working and relevant.",
          "Match your skills section exactly to the keywords in the job description.",
          "Make sure all projects have titles - ATS systems often categorize untitled projects as incomplete."
        ]
      }
    `

    const userMessage = `
      Job Description:
      ${jobDescription}

      Resume:
      ${JSON.stringify(resume, null, 2)}
    `

    const completion = await openAI.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const aiResponse = completion.choices[0].message.content

    if (!aiResponse) {
      throw new Error('Failed to generate AI response')
    }

    // Parse the AI response
    const analysisResult = JSON.parse(aiResponse) as AtsAnalysisResult

    // If there are missing essentials but the AI gave a high score anyway, override it
    if (hasMissingEssentials && analysisResult.score > 65) {
      analysisResult.score = Math.min(analysisResult.score, 65)

      if (!analysisResult.content_issues.missing_sections) {
        analysisResult.content_issues.missing_sections = []
      }

      analysisResult.recommendations.unshift(
        'Complete all essential resume sections (personal info, contact details, education)',
        'ATS systems require complete personal and contact information to process your application'
      )
    }

    // If there are missing project titles, ensure they're mentioned in the analysis
    if (hasMissingProjectTitles) {
      // Reduce the project section score
      if (
        analysisResult.section_scores.projects &&
        analysisResult.section_scores.projects > 60
      ) {
        analysisResult.section_scores.projects = Math.min(
          analysisResult.section_scores.projects,
          60
        )
      }

      // Add missing project titles to the missing_info section
      if (!analysisResult.content_issues.missing_info) {
        analysisResult.content_issues.missing_info = []
      }

      if (
        !analysisResult.content_issues.missing_info.some((msg) =>
          msg.includes('project title')
        )
      ) {
        analysisResult.content_issues.missing_info.push(
          'Project titles are missing in some entries.'
        )
      }

      // Add to sections_to_improve
      if (!analysisResult.sections_to_improve.projects) {
        analysisResult.sections_to_improve.projects = []
      }

      if (
        !analysisResult.sections_to_improve.projects.some((msg) =>
          msg.includes('title')
        )
      ) {
        analysisResult.sections_to_improve.projects.push(
          'Add titles to all projects - projects without titles are seen as incomplete by ATS systems.'
        )
      }

      // Add to recommendations
      if (
        !analysisResult.recommendations.some(
          (msg) => msg.includes('project') && msg.includes('title')
        )
      ) {
        analysisResult.recommendations.push(
          'Ensure every project has a clear, descriptive title - ATS systems categorize projects by their titles.'
        )
      }
    }

    return analysisResult
  } catch (error) {
    console.error('Error in resume analysis:', error)

    // Explicitly check for missing project titles for the fallback response
    const hasMissingProjectTitles =
      resumeData.projects &&
      resumeData.projects.length > 0 &&
      resumeData.projects.some(
        (project) => !project.title || project.title.trim() === ''
      )

    if (hasMissingProjectTitles) {
      console.log(
        'Fallback - Projects with missing titles:',
        resumeData.projects?.filter((p) => !p.title || p.title.trim() === '')
      )
    }

    // Get missing project fields messages
    const missingProjectFieldsMessages =
      checkProjectsForMissingFields(resumeData)

    // If there's a missing project title but it wasn't detected, force add it
    if (
      hasMissingProjectTitles &&
      !missingProjectFieldsMessages.some((msg) =>
        msg.includes('missing titles')
      )
    ) {
      missingProjectFieldsMessages.push(
        'One or more projects are missing titles.'
      )
    }

    // Return a fallback response if the AI fails
    const fallbackResponse = {
      score: 45,
      section_scores: {
        personal_info:
          isEmpty(resumeData.firstName) || isEmpty(resumeData.lastName)
            ? 20
            : 80,
        contact_info:
          isEmpty(resumeData.email) || isEmpty(resumeData.phone) ? 30 : 80,
        experience:
          !resumeData.workExperiences || resumeData.workExperiences.length === 0
            ? 0
            : 60,
        education:
          !resumeData.educations || resumeData.educations.length === 0 ? 0 : 60,
        skills: !resumeData.skills || resumeData.skills.length === 0 ? 0 : 50,
        projects:
          !resumeData.projects || resumeData.projects.length === 0
            ? 0
            : hasMissingProjectTitles
            ? 30
            : 50, // Lower score if missing titles
        summary: isEmpty(resumeData.summary) ? 0 : 50,
      },
      matched_keywords: [],
      missing_keywords: [],
      sections_to_improve: {
        skills: [
          'Add more specific technical skills from the job description.',
        ],
        experience: [
          'Quantify achievements with specific metrics.',
          'Remove duplicate work experiences.',
        ],
        summary: [
          'Customize your professional summary to highlight relevant experience for this role.',
        ],
        projects: [
          'Add project URLs and detail technologies used.',
          ...(hasMissingProjectTitles
            ? ['Add missing project titles - every project must have a title.']
            : []),
          ...(missingProjectFieldsMessages.length > 0
            ? [
                'Complete all project information including titles, descriptions, and URLs.',
              ]
            : []),
        ],
      },
      content_issues: {
        duplicates: [
          'Check for duplicate content in your work experience section.',
        ],
        missing_info: [
          'Several sections are missing key information such as dates, links, or measurable achievements.',
          ...(hasMissingProjectTitles
            ? ['One or more projects are missing titles.']
            : []),
          ...missingProjectFieldsMessages,
        ],
        weak_content: [
          'Experience descriptions use generic language instead of powerful action verbs and specific accomplishments.',
        ],
        missing_sections: getMissingSectionsList(resumeData),
      },
      recommendations: [
        'Complete all essential resume sections (personal info, contact details, education).',
        'ATS systems require complete personal and contact information to process your application.',
        'Mirror job description keywords exactly in your resume.',
        'Quantify achievements with numbers when possible.',
        'Use standard section headings for better ATS parsing.',
        'Remove duplicate content that may appear to be keyword stuffing.',
        'Add missing essential information like project links and technology details.',
        ...(hasMissingProjectTitles
          ? [
              'Ensure every project has a clear, descriptive title - ATS systems categorize projects by their titles.',
            ]
          : []),
        ...(missingProjectFieldsMessages.length > 0
          ? ['Ensure all projects have complete information including titles.']
          : []),
      ],
    }

    return fallbackResponse
  }
}

// Helper functions to check for missing essential information
function checkForMissingEssentials(resumeData: ResumeValues): boolean {
  // Check for missing personal information
  const missingPersonalInfo =
    isEmpty(resumeData.firstName) ||
    isEmpty(resumeData.lastName) ||
    isEmpty(resumeData.jobTitle)

  // Check for missing contact information
  const missingContactInfo =
    isEmpty(resumeData.email) || isEmpty(resumeData.phone)

  // Check for missing education
  const missingEducation =
    !resumeData.educations || resumeData.educations.length === 0

  return missingPersonalInfo || missingContactInfo || missingEducation
}

function getMissingSectionsList(resumeData: ResumeValues): string[] {
  const missingSections = []

  // Check for personal info
  if (isEmpty(resumeData.firstName) || isEmpty(resumeData.lastName)) {
    missingSections.push(
      'Personal information (name) is incomplete or missing.'
    )
  }

  // Check for contact info
  if (isEmpty(resumeData.email) || isEmpty(resumeData.phone)) {
    missingSections.push('Contact information is incomplete or missing.')
  }

  // Check for education
  if (!resumeData.educations || resumeData.educations.length === 0) {
    missingSections.push('Education section is completely missing.')
  }

  // Check for experience
  if (!resumeData.workExperiences || resumeData.workExperiences.length === 0) {
    missingSections.push('Work experience section is completely missing.')
  }

  // Check for skills
  if (!resumeData.skills || resumeData.skills.length === 0) {
    missingSections.push('Skills section is completely missing.')
  }

  // Check for summary
  if (isEmpty(resumeData.summary)) {
    missingSections.push('Professional summary is missing.')
  }

  // Check for missing project titles
  if (resumeData.projects && resumeData.projects.length > 0) {
    console.log(
      'Checking projects for missing titles:',
      JSON.stringify(resumeData.projects)
    )
    const missingTitles = resumeData.projects.some((project) => {
      const isTitleEmpty = isEmpty(project.title)
      console.log(`Project title: "${project.title}", isEmpty: ${isTitleEmpty}`)
      return isTitleEmpty
    })

    if (missingTitles) {
      missingSections.push('One or more projects are missing titles.')
    }
  }

  return missingSections
}

// Helper function to check for missing fields in projects
function checkProjectsForMissingFields(resumeData: ResumeValues): string[] {
  const missingFieldsMessages = []

  if (resumeData.projects && resumeData.projects.length > 0) {
    console.log(
      'Projects for missing fields check:',
      JSON.stringify(resumeData.projects)
    )

    // Check for missing titles
    const projectsWithoutTitles = resumeData.projects.filter((project) => {
      const isTitleEmpty = isEmpty(project.title)
      console.log(
        `Checking project title: "${project.title}", isEmpty: ${isTitleEmpty}`
      )
      return isTitleEmpty
    })

    if (projectsWithoutTitles.length > 0) {
      missingFieldsMessages.push(
        `${projectsWithoutTitles.length} project(s) are missing titles.`
      )
    }

    // Check for missing descriptions
    const projectsWithoutDescriptions = resumeData.projects.filter((project) =>
      isEmpty(project.description)
    )
    if (projectsWithoutDescriptions.length > 0) {
      missingFieldsMessages.push(
        `${projectsWithoutDescriptions.length} project(s) are missing descriptions.`
      )
    }

    // Check for missing URLs
    const projectsWithoutUrls = resumeData.projects.filter((project) =>
      isEmpty(project.projectUrl)
    )
    if (projectsWithoutUrls.length > 0) {
      missingFieldsMessages.push(
        `${projectsWithoutUrls.length} project(s) are missing URLs.`
      )
    }
  }

  return missingFieldsMessages
}

function isEmpty(value: string | undefined | null): boolean {
  // Handle different cases of empty strings more robustly
  if (value === undefined || value === null) return true

  // Trim and check for empty string
  const trimmed = value.trim()
  console.log(
    `isEmpty check: original="${value}", trimmed="${trimmed}", result=${
      trimmed === ''
    }`
  )

  return trimmed === ''
}

export async function optimizeResume(
  resumeData: ResumeValues,
  jobDescription: string
): Promise<ResumeValues> {
  try {
    // Full resume data for optimization
    const resume = {
      summary: resumeData.summary,
      skills: resumeData.skills || [],
      firstName: resumeData.firstName,
      lastName: resumeData.lastName,
      jobTitle: resumeData.jobTitle,
      email: resumeData.email,
      phone: resumeData.phone,
      city: resumeData.city,
      country: resumeData.country,
      linkedinUrl: resumeData.linkedinUrl,
      githubUrl: resumeData.githubUrl,
      workExperiences: resumeData.workExperiences || [],
      educations: resumeData.educations || [],
      projects: resumeData.projects || [],
      certificates: resumeData.certificates || [],
      CourseWork: resumeData.CourseWork || [],
    }

    const systemMessage = `
      You are an ATS optimization expert with extensive experience in HR and resume writing.
      
      Your task is to optimize the provided resume to better match the job description, focusing strictly on improving ONLY the content of existing fields and sections.
      
      ABSOLUTE RULES:
      - DO NOT create new sections that do not already exist in the provided resume JSON.
      - DO NOT add placeholder data.
      - For array-type sections (e.g., workExperiences, projects), ONLY modify items that already exist. Do NOT add new items.
      - You may reorder bullets, rewrite text for impact, add relevant keywords, quantify achievements, remove duplicates, etc.
      - Preserve the original structure and keys of the JSON.
      
      Focus on improvements like:
      - Stronger action verbs
      - Better keyword matching from the job description
      - Quantifying achievements where reasonable
      - Eliminating duplicate or weak content
      - Making existing descriptions more specific and technical
      - Removing generic language
      
      RETURN: A JSON object with the SAME structure as the input, containing only the optimized content.
    `

    const userMessage = `
      Job Description:
      ${jobDescription}

      Current Resume Data:
      ${JSON.stringify(resume, null, 2)}
      
      IMPORTANT NOTE:
      Do NOT add any new sections or placeholder data. Only optimize existing content.
    `

    const completion = await openAI.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const aiResponse = completion.choices[0].message.content

    if (!aiResponse) {
      throw new Error('Failed to generate AI response')
    }

    // Merge the optimized content with the original resumeData to preserve any fields
    // that might not have been included in the optimization
    const rawOptimized = JSON.parse(aiResponse) as Partial<ResumeValues>

    // Sanitize: allow only existing keys and prevent adding extra items to arrays
    const sanitizedOptimized: Partial<ResumeValues> = {}

    for (const key in rawOptimized) {
      if (Object.prototype.hasOwnProperty.call(resumeData, key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const originalValue = (resumeData as any)[key]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newValue = (rawOptimized as any)[key]

        // If the value is an array, ensure we do NOT add new items
        if (Array.isArray(originalValue) && Array.isArray(newValue)) {
          const limitedArray = newValue.slice(0, originalValue.length)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(sanitizedOptimized as any)[key] = limitedArray
        } else if (
          typeof originalValue === 'object' &&
          originalValue !== null &&
          !Array.isArray(originalValue)
        ) {
          // For nested objects, only keep existing subkeys
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cleanedObj: Record<string, any> = {}
          for (const subKey in newValue) {
            if (Object.prototype.hasOwnProperty.call(originalValue, subKey)) {
              cleanedObj[subKey] = newValue[subKey]
            }
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(sanitizedOptimized as any)[key] = cleanedObj
        } else {
          // Primitive – allow replacement
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(sanitizedOptimized as any)[key] = newValue
        }
      }
    }

    return {
      ...resumeData,
      ...sanitizedOptimized,
    }
  } catch (error) {
    console.error('Error in resume optimization:', error)
    // Return original resume data without adding placeholders
    return resumeData
  }
}
