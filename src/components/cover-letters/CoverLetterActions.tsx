'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Copy, Download, FileText, Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'
import CoverLetterEditor from './CoverLetterEditor'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteCoverLetter } from '@/actions/cover-letters/cover-letter-actions'

interface CoverLetterActionsProps {
  id: string
  content: string
}

export default function CoverLetterActions({
  id,
  content,
}: CoverLetterActionsProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast.success('Cover letter copied to clipboard')
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `cover-letter-${id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handlePrintPdf = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to download PDF.')
      return
    }

    // Add proper styling for the print window with cleaner output
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cover Letter</title>
          <style>
            @page {
              margin: 0.5in;
              size: letter;
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 0;
              padding: 0;
              color: #000;
              background: #fff;
            }
            .container {
              width: 100%;
              max-width: 100%;
              padding: 0;
              margin: 0;
            }
            .content {
              white-space: pre-wrap;
              font-family: Arial, sans-serif;
            }
            /* Hide any browser UI elements */
            @media print {
              html, body {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
              }
              /* Hide browser headers, footers, URLs etc */
              header, footer, nav, aside, .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">${content}</div>
          </div>
          <script>
            // Remove any automatic headers/footers
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 100);
              }, 500);
            });
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()

    toast.success('PDF generated successfully')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteCoverLetter(id)

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete cover letter')
      }

      toast.success('Cover letter deleted successfully')
      router.push('/cover-letters')
    } catch (error) {
      console.error('Error deleting cover letter:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete cover letter'
      )
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="w-full">
        <CoverLetterEditor
          id={id}
          initialContent={content}
          onCancel={handleCancelEdit}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
        Copy
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Text
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={handlePrintPdf}
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={handleEdit}
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              cover letter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
