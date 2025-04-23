import { generateSummary } from '@/actions/ai/ai-features'
import LoadingButton from '@/components/loading-button'
import { ResumeValues } from '@/shemas'
import { WandSparklesIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface GenerateSummaryButtonProps {
  onSummaryGenerated: (summary: string) => void
  resumeData: ResumeValues
}

export default function GenerateSummaryButton({
  resumeData,
  onSummaryGenerated,
}: GenerateSummaryButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    // todo : block for non premium users
    try {
      setLoading(true)
      const aiResponse = await generateSummary(resumeData)
      onSummaryGenerated(aiResponse)
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong. Please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton
      variant={'outline'}
      type="button"
      onClick={handleClick}
      loading={loading}
    >
      <WandSparklesIcon className="size-4" />
      Generate AI
    </LoadingButton>
  )
}
