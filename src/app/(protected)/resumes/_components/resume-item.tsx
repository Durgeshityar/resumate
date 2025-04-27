'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { formatDate } from 'date-fns'
import { FileText, MoreVertical, Printer, Trash2 } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

import { ResumeServerData } from '@/lib/types'
import { mapToResumeValues } from '@/lib/utils'
import { toast } from 'sonner'

import ResumePreview from '../../editor/_components/resume-preview'
import { deleteResume } from '@/actions/resume/resume-actions'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import LoadingButton from '@/components/loading-button'
import { Badge } from '@/components/ui/badge'
import { useSubscription } from '@/hooks/use-subscription'

interface ResumeItemProps {
  resume: ResumeServerData
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const { subscriptionActions, isSubscribed } = useSubscription()

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || 'Resume',
  })

  const wasUpdated = resume.updatedAt !== resume.createdAt

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md">
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/editor?resumeId=${resume.id}`}
              className="inline-block"
            >
              <h3 className="text-sm font-semibold line-clamp-1 hover:text-primary transition-colors">
                {resume.title || 'Untitled'}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-[10px]">
                {wasUpdated ? 'Updated' : 'Created'}{' '}
                {formatDate(resume.updatedAt, 'MMM d, yyyy')}
              </Badge>
            </div>
          </div>
          <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
        </div>

        {resume.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {resume.description}
          </p>
        )}

        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="block relative aspect-[1/1.3] overflow-hidden rounded-md border"
        >
          <ResumePreview
            resumeData={mapToResumeValues(resume)}
            contentRef={contentRef}
            className="transform scale-90 transition-transform duration-300 group-hover:scale-95"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/80 to-transparent" />
        </Link>

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 h-7 text-xs"
            onClick={() => reactToPrintFn()}
          >
            <Printer className="size-3" />
            Print
          </Button>
          {isSubscribed ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1 h-7 text-xs"
              asChild
            >
              <Link href={`/cover-letters/new?resumeId=${resume.id}`}>
                <FileText className="size-3" />
                Cover Letter
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1 h-7 text-xs"
              onClick={subscriptionActions.openPremiumModal}
            >
              <FileText className="size-3" />
              Cover Letter
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface MoreMenuProps {
  resumeId: string
  onPrintClick: () => void
}
function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'ghost'}
            size={'icon'}
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100 h-6 w-6"
          >
            <MoreVertical className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2 text-xs"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 className="size-3" /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 text-xs"
            onClick={onPrintClick}
          >
            <Printer className="size-3" />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletConfrimationModal
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </>
  )
}

interface DeletConfrimationModalProps {
  resumeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DeletConfrimationModal({
  onOpenChange,
  open,
  resumeId,
}: DeletConfrimationModalProps) {
  //on client side revalidation of path is done using useTransition
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId)
        onOpenChange(false)
      } catch (error) {
        console.error(error)
        toast.error('Something went wrong. Please try again')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete resume ?</DialogTitle>
          <DialogDescription>
            This will permanently delete this resum. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={'destructive'}
            onClick={handleDelete}
            loading={isPending}
          >
            Delete
          </LoadingButton>
          <Button variant={'secondary'} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
