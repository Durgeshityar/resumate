import { useState } from 'react'
import { WandSparklesIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import { generateProject } from '@/actions/ai/ai-features'
import { useSubscription } from '@/hooks/use-subscription'

import { GenerateProjectInput, generateProjectSchema, project } from '@/shemas'

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

interface GenerateProjectButtonProps {
  onProjectGenerated: (project: project) => void
}

export default function GenerateProjectButton({
  onProjectGenerated,
}: GenerateProjectButtonProps) {
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
        onProjectGenerated={async (project) => {
          // Attempt to use the feature (handle credit deduction)
          const canProceed = await subscriptionActions.useFeature()
          if (!canProceed) {
            return
          }

          onProjectGenerated(project)
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
  onProjectGenerated: (project: project) => void
  isSubscribed: boolean
}

function InputDialog({
  onOpenChange,
  onProjectGenerated,
  open,
  isSubscribed,
}: InputDialogProps) {
  const form = useForm<GenerateProjectInput>({
    resolver: zodResolver(generateProjectSchema),
    defaultValues: {
      description: '',
    },
  })

  async function onSubmit(input: GenerateProjectInput) {
    try {
      const response = await generateProject(input)
      onProjectGenerated(response)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Project</DialogTitle>
          <DialogDescription>
            Describe your project and the AI will generate an optimized entry
            for you
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
                      placeholder={`E.g. "A full-stack web application built with React and Node.js that allows users to..."`}
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
