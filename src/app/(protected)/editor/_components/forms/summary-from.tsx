import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { DocumentEditorFormProps } from '@/lib/types'
import { summarySchema, SummaryValues } from '@/shemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import GenerateSummaryButton from './generate-summary-button'

export default function SummaryForm({
  resumeData,
  setResumeData,
}: DocumentEditorFormProps) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary || '',
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return
      setResumeData({ ...resumeData, ...values })
    })
    return unsubscribe
  }, [form, resumeData, setResumeData])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className=" font-semibold text-2xl">Professional summary</h2>
        <p className="text-sm text-muted-foreground">
          Write a short introduction of your resume or let the AI generate one
          from your resume
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Professional summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="A brief, engaging text about yourself"
                  />
                </FormControl>
                <FormMessage />
                <GenerateSummaryButton
                  resumeData={resumeData}
                  onSummaryGenerated={(summary) =>
                    form.setValue('summary', summary)
                  }
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
