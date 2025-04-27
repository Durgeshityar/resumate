'use server'

import openAI from '@/lib/openai'
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  workExperience,
  GenerateProjectInput,
  generateProjectSchema,
  project,
} from '@/shemas'

export async function generateSummary(input: GenerateSummaryInput) {
  // Todo: Block for non premium users

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input)

  const systemMessages = `
  You are an expert resume writer with years of experience crafting compelling professional summaries that get candidates noticed by recruiters and hiring managers.
  
  Your task is to write a concise, impactful professional summary (3-5 sentences) for the user based on their information.
  
  Guidelines:
  - Focus on their most impressive achievements, skills, and experiences
  - Highlight their unique value proposition that sets them apart from other candidates
  - Use active voice and strong action verbs
  - Tailor the summary to match their target job title
  - Include relevant years of experience, key skills, and notable accomplishments
  - Avoid clichés and generic statements
  - Do not use first-person pronouns (I, me, my)
  
  Only return the summary text without any additional commentary, formatting, or explanations.
  `
  const userMessage = `
  Please generate a professional resume summary from this data.

  Target Job Title: ${jobTitle || 'N/A'}

  Work Experiences: ${workExperiences
    ?.map(
      (exp) => `
    Position: ${exp.position || 'N/A'}  at ${exp.company || 'N/A'} from ${
        exp.startDate || 'N/A'
      } to ${exp.endDate || 'Present'}

    Description:
        ${exp.description || 'N/A'}
     
        `
    )
    .join('\n\n')}

    Educations: ${educations
      ?.map(
        (edu) => `
    Degree: ${edu.degree || 'N/A'}  at ${edu.school || 'N/A'} from ${
          edu.startDate || 'N/A'
        } to ${edu.endDate || 'Present'}
        `
      )
      .join('\n\n')}


    Skills: ${skills}
  `

  const completion = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemMessages,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
  })

  const aiResponse = completion.choices[0].message.content

  if (!aiResponse) {
    throw new Error('Failed to generate response')
  }

  return aiResponse
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput
) {
  // Validate subscription or credits
  const { description } = generateWorkExperienceSchema.parse(input)

  const systemMessage = `
  You are an expert resume writer specializing in crafting compelling work experience entries that impress recruiters and hiring managers.
  
  Your task is to generate a single work experience entry based on the user's input description.
  
  Guidelines:
  - Extract the key information (job title, company, dates) precisely from the user input
  - Create 3-5 bullet points that highlight concrete achievements, not just responsibilities
  - Use the STAR format (Situation, Task, Action, Result) or PAR format (Problem, Action, Result) for each point
  - Include specific, quantifiable metrics where possible (e.g., percentages, dollar amounts, time saved)
  - Begin each bullet with a strong action verb (implemented, developed, managed, etc.)
  - Focus on impact and value added to the organization
  - Ensure all dates follow the YYYY-MM-DD format
  
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Job title: <specific job title, be precise>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <3-5 achievement-focused bullet points starting with action verbs>
  `

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `

  const completion = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
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

  console.log('aiResponse', aiResponse)

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || '',
    company: aiResponse.match(/Company: (.*)/)?.[1] || '',
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || '').trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies workExperience
}

export async function generateProject(input: GenerateProjectInput) {
  // Todo: Block for non premium users

  const { description } = generateProjectSchema.parse(input)

  const systemMessage = `
  You are an expert resume writer specializing in showcasing impressive projects that demonstrate a candidate's skills and accomplishments.
  
  Your task is to generate a single project entry based on the user's input description.
  
  Guidelines:
  - Extract the key information (project title, organization, dates, URLs) precisely from the user input
  - Create 3-4 bullet points that highlight technical skills, methodologies, and measurable outcomes
  - Each bullet should start with a strong action verb (developed, designed, implemented, etc.)
  - Include specific technologies, tools, and frameworks used
  - Emphasize problem-solving approaches and innovative solutions
  - Quantify results and impact where possible (e.g., performance improvements, user adoption)
  - Ensure all dates follow the YYYY-MM-DD format
  
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Title: <concise, specific project title>
  Organisation: <organisation name if applicable>
  Project URL: <project url if provided>
  Start date: <format: YYYY-MM-DD> (only if provided, must be a valid date)
  End date: <format: YYYY-MM-DD> (only if provided, must be a valid date)
  Description: <3-4 achievement-oriented bullet points highlighting technical skills and impact>
  `

  const userMessage = `
  Please provide a project entry from this description:
  ${description}
  `

  const completion = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
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

  console.log('aiResponse', aiResponse)

  // Extract and validate dates
  let startDate = ''
  let endDate = ''

  const startDateMatch = aiResponse.match(
    /Start date: (\d{4}-\d{2}-\d{2})/
  )?.[1]
  if (startDateMatch && /^\d{4}-\d{2}-\d{2}$/.test(startDateMatch)) {
    const date = new Date(startDateMatch)
    if (!isNaN(date.getTime())) {
      startDate = startDateMatch
    }
  }

  const endDateMatch = aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1]
  if (endDateMatch && /^\d{4}-\d{2}-\d{2}$/.test(endDateMatch)) {
    const date = new Date(endDateMatch)
    if (!isNaN(date.getTime())) {
      endDate = endDateMatch
    }
  }

  return {
    title: aiResponse.match(/Title: (.*)/)?.[1] || '',
    organisationName: aiResponse.match(/Organisation: (.*)/)?.[1] || '',
    projectUrl: aiResponse.match(/Project URL: (.*)/)?.[1] || '',
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || '').trim(),
    startDate,
    endDate,
  } satisfies project
}
