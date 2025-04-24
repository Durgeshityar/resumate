'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { updateCoverLetter } from '@/actions/cover-letters/cover-letter-actions'

interface CoverLetterEditorProps {
  id: string
  initialContent: string
  onCancel: () => void
}

export default function CoverLetterEditor({
  id,
  initialContent,
  onCancel,
}: CoverLetterEditorProps) {
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Cover letter content cannot be empty')
      return
    }

    setIsSaving(true)

    try {
      const result = await updateCoverLetter(id, content)

      if (!result.success) {
        throw new Error(result.error || 'Failed to update cover letter')
      }

      toast.success('Cover letter updated successfully')
      router.refresh()
      onCancel() // Exit edit mode
    } catch (error) {
      console.error('Error updating cover letter:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update cover letter'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 w-full">
      <Textarea
        value={content}
        onChange={handleContentChange}
        className="min-h-[500px] p-4 font-mono text-sm w-full"
        placeholder="Enter your cover letter content here..."
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
