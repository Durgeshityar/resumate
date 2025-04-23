import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'

import { DocumentEditorFormProps } from '@/lib/types'
import { courseworkSchema, CourseWorkValues } from '@/shemas'
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

export default function CourseworkForm({
  resumeData,
  setResumeData,
}: DocumentEditorFormProps) {
  const form = useForm<CourseWorkValues>({
    resolver: zodResolver(courseworkSchema),
    defaultValues: {
      CourseWork: resumeData.CourseWork || [],
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return
      setResumeData({
        ...resumeData,
        CourseWork: values.CourseWork?.filter((cw) => cw !== undefined) || [],
      })
    })
    return unsubscribe
  }, [form, resumeData, setResumeData])

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'CourseWork',
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
        <h2 className=" text-2xl font-semibold">Coursework</h2>
        <p className="text-sm text-muted-foreground">
          Add as many coursework as you like
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
                <CourseworkItem
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
                  skills: '',
                  description: '',
                })
              }
            >
              Add coursework
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

interface CourseworkItemProps {
  id: string
  form: UseFormReturn<CourseWorkValues>
  index: number
  remove: (index: number) => void
}

function CourseworkItem({ form, index, remove, id }: CourseworkItemProps) {
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
        <span className="font-semibold"> Coursework {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <FormField
        control={form.control}
        name={`CourseWork.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Coursework name</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`CourseWork.${index}.source`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Where did you take the course?</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`CourseWork.${index}.duration`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>When did you take the course ?</FormLabel>
            <FormControl>
              <Input {...field} type="date" value={field.value?.slice(0, 10)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`CourseWork.${index}.skills`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>What skill did you use ?</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`CourseWork.${index}.description`}
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
