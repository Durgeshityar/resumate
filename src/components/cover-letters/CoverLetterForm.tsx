'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Resume } from '@prisma/client'
import { createCoverLetter } from '@/actions/cover-letters/cover-letter-actions'

interface CoverLetterFormProps {
  resume: Resume | null
  resumeId?: string
  userResumes: { id: string; title: string }[]
}

export default function CoverLetterForm({
  resumeId,
  userResumes,
}: CoverLetterFormProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedResumeId, setSelectedResumeId] = useState(resumeId || '')
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    hiringManager: '',
    customNotes: '',
    tone: 'professional',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'resumeId') {
      setSelectedResumeId(value)
      if (value !== resumeId) {
        router.push(`/cover-letters/new?resumeId=${value}`)
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedResumeId) {
      toast.error('Please select a resume')
      return
    }

    setIsGenerating(true)

    try {
      const result = await createCoverLetter({
        resumeId: selectedResumeId,
        ...formData,
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate cover letter')
      }

      toast.success('Cover letter generated successfully!')

      const coverId = result.data?.id
      if (coverId) {
        router.push(`/cover-letters/${coverId}`)
      } else {
        throw new Error('Failed to get cover letter ID')
      }
    } catch (error) {
      console.error('Error generating cover letter:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate cover letter'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="resumeId">Select Resume</Label>
        <Select
          value={selectedResumeId}
          onValueChange={(value) => handleSelectChange('resumeId', value)}
        >
          <SelectTrigger id="resumeId" className="w-full">
            <SelectValue placeholder="Select a resume" />
          </SelectTrigger>
          <SelectContent>
            {userResumes.map((resumeItem) => (
              <SelectItem key={resumeItem.id} value={resumeItem.id}>
                {resumeItem.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!selectedResumeId && (
          <p className="text-sm text-muted-foreground">
            Please select a resume to generate a matching cover letter
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleInputChange}
          placeholder="Software Engineer, Project Manager, etc."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Company Name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hiringManager">Hiring Manager (Optional)</Label>
        <Input
          id="hiringManager"
          name="hiringManager"
          value={formData.hiringManager}
          onChange={handleInputChange}
          placeholder="Name of hiring manager if known"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleInputChange}
          placeholder="Paste the job description here"
          className="min-h-32"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customNotes">Additional Notes (Optional)</Label>
        <Textarea
          id="customNotes"
          name="customNotes"
          value={formData.customNotes}
          onChange={handleInputChange}
          placeholder="Any specific points you'd like to highlight or include"
          className="min-h-20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Tone</Label>
        <Select
          value={formData.tone}
          onValueChange={(value) => handleSelectChange('tone', value)}
        >
          <SelectTrigger id="tone" className="w-full">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            <SelectItem value="confident">Confident</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isGenerating || !selectedResumeId}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Cover Letter'
          )}
        </Button>
      </div>
    </form>
  )
}
