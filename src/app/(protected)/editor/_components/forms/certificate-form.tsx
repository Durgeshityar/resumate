import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'

import { DocumentEditorFormProps } from '@/lib/types'
import { certificateSchema, CertificateValues } from '@/shemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { GripHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CSS } from '@dnd-kit/utilities'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { cn } from '@/lib/utils'

export default function CertificateForm({
  resumeData,
  setResumeData,
}: DocumentEditorFormProps) {
  const form = useForm<CertificateValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      certificates: resumeData.certificates || [],
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return
      setResumeData({
        ...resumeData,
        certificates:
          values.certificates?.filter((cer) => cer !== undefined) || [],
      })
    })
    return unsubscribe
  }, [form, resumeData, setResumeData])

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'certificates',
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)
      move(oldIndex, newIndex)
      return arrayMove(fields, oldIndex, newIndex)
    }
  }

  return (
    <div className=" max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className=" text-2xl font-semibold">Certificates</h2>
        <p className="text-sm text-muted-foreground">
          Add as many certificates as you like
        </p>
      </div>
      <Form {...form}>
        <form className=" space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <CertificateItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className=" flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  title: '',
                  source: '',
                  duration: '',
                  description: '',
                })
              }
            >
              Add certificate
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

interface CertificateItemProps {
  id: string
  form: UseFormReturn<CertificateValues>
  index: number
  remove: (index: number) => void
}

function CertificateItem({ form, index, remove, id }: CertificateItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <div
      className="space-y-3 border rounded-md bg-background p-3"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        className={cn(
          'flex justify-between gap-2',
          isDragging && 'shadow-xl z-50 cursor-grab relative'
        )}
      >
        <span className="font-semibold"> Certificate {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <FormField
        control={form.control}
        name={`certificates.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certificate name</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`certificates.${index}.source`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Where did you get the certificate?</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`certificates.${index}.duration`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>When did you get the certificate ?</FormLabel>
            <FormControl>
              <Input {...field} type="date" value={field.value?.slice(0, 10)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`certificates.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button variant={'destructive'} onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  )
}
