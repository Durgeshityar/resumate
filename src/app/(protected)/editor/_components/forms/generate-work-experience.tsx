import { useState } from 'react'
import { WandSparklesIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import { generateWorkExperience } from '@/actions/ai/ai-features'
import { useSubscription } from '@/hooks/use-subscription'

import {
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  workExperience,
} from '@/shemas'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/loading-button'

interface GenerateWorkExperienceButtonProps {
  onWorkExperienceGenerated: (workExperience: workExperience) => void
}

export default function GenerateWorkExperienceButton({
  onWorkExperienceGenerated,
}: GenerateWorkExperienceButtonProps) {
  const [showInputDialog, setShowInputDialog] = useState(false)

  const { isSubscribed, credits, isFeatureAvailable, subscriptionActions } =
    useSubscription()

  return (
    <>
      <Button
        variant={'outline'}
        type="button"
        disabled={!isFeatureAvailable}
        onClick={async () => {
          const canProceed = await subscriptionActions.useFeature()
          if (canProceed) {
            setShowInputDialog(true)
          }
        }}
        className="relative"
      >
        <WandSparklesIcon className="size-4 mr-2" />
        Smart fill (AI)
        {!isSubscribed && credits >= 0 && (
          <div className="ml-2 text-xs bg-primary/20 px-1.5 py-0.5 rounded-md">
            {credits} credit{credits !== 1 ? 's' : ''}
          </div>
        )}
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorkExperienceGenerated={async (workExperience) => {
          // Attempt to use the feature (handle credit deduction)
          const canProceed = await subscriptionActions.useFeature()
          if (!canProceed) {
            return
          }

          onWorkExperienceGenerated(workExperience)
          setShowInputDialog(false)
        }}
        isSubscribed={isSubscribed}
      />
    </>
  )
}

interface InputDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkExperienceGenerated: (workExperience: workExperience) => void
  isSubscribed: boolean
}
function InputDialog({
  onOpenChange,
  onWorkExperienceGenerated,
  open,
  isSubscribed,
}: InputDialogProps) {
  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: '',
    },
  })

  async function onSubmit(input: GenerateWorkExperienceInput) {
    try {
      const response = await generateWorkExperience(input)
      onWorkExperienceGenerated(response)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate work experinece</DialogTitle>
          <DialogDescription>
            Describe this work experience and the AI will generate an optimized
            entry for you
            {!isSubscribed && (
              <p className="mt-1 text-xs opacity-80">
                This will use 1 credit from your account
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`E.g. "From nov 2019 to dec 2020 I worked at Google as a software engineer, tasks were: ...`}
                      autoFocus
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
