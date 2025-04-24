import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { ResumeValues } from '@/shemas'
import { formatDate, isValid } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { BorderStyles } from './border-style-button'
import useDimensions from '@/hooks/use-dimensions'

interface ResumePreviewProps {
  resumeData: ResumeValues
  contentRef?: React.Ref<HTMLDivElement>
  className?: string
}

export default function ResumePreview({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const conatinerRef = useRef<HTMLDivElement>(null)
  const { width } = useDimensions(conatinerRef)

  return (
    <div
      ref={conatinerRef}
      className={cn(
        'aspect-[210/297] bg-white text-black h-fit w-full',
        className
      )}
    >
      <div
        className={cn('space-y-4 p-6', !width && 'invisible')}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <ProjectsSection resumeData={resumeData} />
        <CertificatesSection resumeData={resumeData} />
        <CourseworkSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  )
}

interface ResumeSectionProps {
  resumeData: ResumeValues
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    linkedinUrl,
    xUrl,
    githubUrl,
    colorHex,
  } = resumeData

  const socialLinks = [
    { url: linkedinUrl, label: 'LinkedIn' },
    { url: xUrl, label: 'X' },
    { url: githubUrl, label: 'GitHub' },
  ].filter((link) => link.url)

  return (
    <div className="flex items-center gap-6">
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p className="text-3xl font-bold" style={{ color: colorHex }}>
            {firstName} {lastName}
          </p>
          <p className="font font-medium" style={{ color: colorHex }}>
            {jobTitle}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">
            {city}
            {city && country ? ', ' : ''}
            {country}
            {(city || country) && (phone || email) ? ' • ' : ''}
            {[phone, email].filter(Boolean).join(' • ')}
          </p>
          {socialLinks.length > 0 && (
            <p className="text-xs text-gray-500">
              {socialLinks.map((link, index) => (
                <span key={link.label}>
                  {index > 0 && ' • '}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData

  if (!summary) return null

  return (
    <div className="break-inside-avoid-page">
      <hr
        className="border-t border-gray-300"
        style={{ borderColor: colorHex }}
      />
      <div className="space-y-2 break-inside-avoid pt-2">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Professional profile
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </div>
  )
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData

  const workExperiencesNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  )

  if (!workExperiencesNotEmpty?.length) return null

  return (
    <div className="break-inside-avoid-page">
      <hr
        className="border-t border-gray-300"
        style={{ borderColor: colorHex }}
      />
      <div className="space-y-2 pt-2">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Work experience
        </p>
        {workExperiencesNotEmpty.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-1 pb-2">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{exp.position}</span>
              {exp.startDate && typeof exp.startDate === 'string' && (
                <span>
                  {formatDateString(exp.startDate)}
                  {' - '}
                  {exp.endDate && typeof exp.endDate === 'string'
                    ? formatDateString(exp.endDate)
                    : 'Present'}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <div className="whitespace-pre-line text-xs">{exp.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsSection({ resumeData }: ResumeSectionProps) {
  const { projects, colorHex } = resumeData

  const projectsNotEmpty =
    projects?.filter((proj) => proj && Object.values(proj).some(Boolean)) || []

  if (!projectsNotEmpty.length) return null

  return (
    <div className="break-inside-avoid-page">
      <hr
        className="border-t border-gray-300"
        style={{ borderColor: colorHex }}
      />
      <div className="space-y-2 pt-2">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Projects
        </p>
        {projectsNotEmpty.map((proj, index) => (
          <div key={index} className="break-inside-avoid space-y-1 pb-2">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{proj?.title}</span>
              {proj?.startDate && typeof proj.startDate === 'string' && (
                <span>
                  {formatDateString(proj.startDate)}
                  {' - '}
                  {proj.endDate && typeof proj.endDate === 'string'
                    ? formatDateString(proj.endDate)
                    : 'Present'}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{proj?.organisationName}</p>
            {proj?.projectUrl && (
              <p className="text-xs text-blue-600">
                <a
                  href={proj.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {proj.projectUrl}
                </a>
              </p>
            )}
            <div className="whitespace-pre-line text-xs">
              {proj?.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CertificatesSection({ resumeData }: ResumeSectionProps) {
  const { certificates, colorHex } = resumeData

  const certificatesNotEmpty =
    certificates?.filter((cert) => cert && Object.values(cert).some(Boolean)) ||
    []

  if (!certificatesNotEmpty.length) return null

  return (
    <div className="break-inside-avoid-page">
      <hr
        className="border-t border-gray-300"
        style={{ borderColor: colorHex }}
      />
      <div className="space-y-2 pt-2">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Certificates
        </p>
        {certificatesNotEmpty.map((cert, index) => (
          <div key={index} className="break-inside-avoid space-y-1 pb-2">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{cert?.title}</span>
              {cert?.duration && typeof cert.duration === 'string' && (
                <span>{formatDateString(cert.duration)}</span>
              )}
            </div>
            <p className="text-xs font-semibold">{cert?.source}</p>
            <div className="whitespace-pre-line text-xs">
              {cert?.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CourseworkSection({ resumeData }: ResumeSectionProps) {
  const { CourseWork, colorHex } = resumeData

  const courseworkNotEmpty =
    CourseWork?.filter(
      (course) => course && Object.values(course).some(Boolean)
    ) || []

  if (!courseworkNotEmpty.length) return null

  return (
    <div className="break-inside-avoid-page">
      <hr
        className="border-t border-gray-300"
        style={{ borderColor: colorHex }}
      />
      <div className="space-y-2 pt-2">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Coursework
        </p>
        {courseworkNotEmpty.map((course, index) => (
          <div key={index} className="break-inside-avoid space-y-1 pb-2">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{course?.title}</span>
              {course?.duration && typeof course.duration === 'string' && (
                <span>{formatDateString(course.duration)}</span>
              )}
            </div>
            <p className="text-xs font-semibold">{course?.source}</p>
            {course?.skills && (
              <p className="text-xs">
                <span className="font-semibold">Skills: </span>
                {course.skills}
              </p>
            )}
            <div className="whitespace-pre-line text-xs">
              {course?.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  )

  if (!educationsNotEmpty?.length) return null

  return (
    <div className="break-inside-avoid-page">
      <hr
        className="border-t border-gray-300"
        style={{ borderColor: colorHex }}
      />
      <div className="space-y-2 pt-2">
        <p className="text-lg font-semibold" style={{ color: colorHex }}>
          Education
        </p>
        {educationsNotEmpty.map((edu, index) => (
          <div key={index} className="break-inside-avoid space-y-1 pb-2">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{edu.degree}</span>
              {edu.startDate && typeof edu.startDate === 'string' && (
                <span>
                  {formatDateString(edu.startDate)}
                  {' - '}
                  {edu.endDate && typeof edu.endDate === 'string'
                    ? formatDateString(edu.endDate)
                    : 'Present'}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData

  if (!skills?.length) return null

  return (
    <div className="break-inside-avoid-page">
      <hr
        className="border-t border-gray-300"
        style={{ borderColor: colorHex }}
      />
      <div className="break-inside-avoid space-y-2 pt-2">
        <p className="text-lg font-semibold">Skills</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={index}
              className="bg-black text-white hover:bg-black"
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? '0px'
                    : borderStyle === BorderStyles.CIRCLE
                    ? '9999px'
                    : '8px',
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatDateString(dateInput: unknown): string {
  // Handle non-string inputs
  if (dateInput === null || dateInput === undefined) return ''

  // If it's already a string, use it directly
  const dateString =
    typeof dateInput === 'string' ? dateInput : String(dateInput)

  if (dateString === '') return ''

  // Handle only ISO date strings (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    try {
      const parsedDate = new Date(dateString)
      if (isValid(parsedDate)) {
        return formatDate(parsedDate, 'MM/yyyy')
      }
    } catch (error) {
      console.error('Date parsing error:', error)
      return ''
    }
  }

  // For other date string formats, try more carefully
  try {
    let dateToProcess = dateString
    if (dateToProcess.endsWith('GM')) {
      dateToProcess = dateToProcess + 'T'
    }

    const parsedDate = new Date(dateToProcess)
    if (!isValid(parsedDate)) {
      return ''
    }
    return formatDate(parsedDate, 'MM/yyyy')
  } catch (error) {
    console.error('Date parsing error:', error)
    return ''
  }
}
