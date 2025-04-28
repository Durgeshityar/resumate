import { saveResume } from '@/actions/editor/editor'
import useDebounce from '@/hooks/use-debounce'

import { ResumeValues } from '@/shemas'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function useAutosaveResume(resumeData: ResumeValues) {
  const searchParams = useSearchParams()

  const debouncedResumeData = useDebounce(resumeData, 1500)

  const [resumeId, setResumeId] = useState(resumeData.id)

  const [isError, setIsError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaveData, setLastSaveData] = useState(structuredClone(resumeData))

  useEffect(() => {
    setIsError(false)
  }, [debouncedResumeData])

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true)
        setIsError(false)

        const newData = structuredClone(debouncedResumeData)

        const updatedResume = await saveResume({
          ...newData,
          id: resumeId,
        })

        setResumeId(updatedResume?.id)
        setLastSaveData(newData)

        if (searchParams.get('resumeId') !== updatedResume?.id) {
          const newSearchParams = new URLSearchParams(searchParams)
          newSearchParams.set('resumeId', updatedResume?.id as string)
          window.history.replaceState(
            null,
            '',
            `?${newSearchParams.toString()}`
          )
        }
      } catch (error) {
        setIsError(true)
        console.log(error)
        toast("Couldn't save document", {
          action: {
            label: 'Retry',
            onClick: save,
          },
        })
      } finally {
        setIsSaving(false)
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSaveData)

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save()
    }
  }, [
    debouncedResumeData,
    isSaving,
    lastSaveData,
    isError,
    resumeId,
    searchParams,
  ])

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSaveData),
  }
}
