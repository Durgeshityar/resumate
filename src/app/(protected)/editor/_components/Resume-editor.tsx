'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { ResumeValues } from '@/shemas'
import { cn, mapToResumeValues } from '@/lib/utils'
import useUnloadWarning from '@/hooks/use-unloadWarning'
import { ResumeServerData } from '@/lib/types'

import { steps } from './steps'
import Footer from './footer'
import Breadcrumbs from './breadcrumbs'
import ResumePreviewSection from './resume-previewer-section'
import useAutosaveDocument from './use-Autosave-resume'

interface ResumeEditorProps {
  resumeToEdit: ResumeServerData | null
}

const ResumeEditor = ({ resumeToEdit }: ResumeEditorProps) => {
  const searchParams = useSearchParams()

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? mapToResumeValues(resumeToEdit) : {}
  )

  const [showSmResumePreview, setShowSmResumePreview] = useState(false)

  const { isSaving, hasUnsavedChanges } = useAutosaveDocument(resumeData)

  useUnloadWarning(hasUnsavedChanges)

  const currentStep = searchParams.get('step') || steps[0].key

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('step', key)
    window.history.pushState(null, '', `?${newSearchParams.toString()}`) // alternate of router.push() but faster
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep
  )?.component

  return (
    <div className="flex grow min-h-screen flex-col bg-[#FAFBFD]">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              ' w-full md:w-1/2 p-3 space-y-6 overflow-y-auto md:block',
              showSmResumePreview && 'hidden'
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && 'flex')}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={setShowSmResumePreview}
        isSaving={isSaving}
      />
    </div>
  )
}

export default ResumeEditor
