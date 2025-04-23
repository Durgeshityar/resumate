import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'

import { DocumentEditorFormProps } from '@/lib/types'
import { projectSchema, ProjectValues } from '@/shemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
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
import GenerateProjectButton from './generate-project-button'

export default function ProjectForm({
  resumeData,
  setResumeData,
}: DocumentEditorFormProps) {
  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projects: resumeData.projects || [],
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return
      setResumeData({
        ...resumeData,
        projects: values.projects?.filter((pro) => pro !== undefined) || [],
      })
    })
    return unsubscribe
  }, [form, resumeData, setResumeData])

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'projects',
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
        <h2 className=" text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-muted-foreground">
          Add as many projects as you like
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
                <ProjectItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              onClick={() =>
                append({
                  title: '',
                  organisationName: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  projectUrl: '',
                })
              }
            >
              Add project
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

interface ProjectItemProps {
  id: string
  form: UseFormReturn<ProjectValues>
  index: number
  remove: (index: number) => void
}

function ProjectItem({ form, index, remove, id }: ProjectItemProps) {
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
        <span className="font-semibold"> Project {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <div className="flex justify-between ">
        <GenerateProjectButton
          onProjectGenerated={(pro) => {
            // Sanitize dates before setting
            const sanitizedProject = {
              ...pro,
              startDate: pro.startDate || '',
              endDate: pro.endDate || '',
            }
            form.setValue(`projects.${index}`, sanitizedProject)
          }}
        />
      </div>
      <FormField
        control={form.control}
        name={`projects.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project name</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`projects.${index}.organisationName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              In which organization did you do your project ?
            </FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`projects.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice?.(0, 10) || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    // Ensure we're storing a properly formatted date string
                    if (value) {
                      field.onChange(value)
                    } else {
                      field.onChange('')
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`projects.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice?.(0, 10) || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    // Ensure we're storing a properly formatted date string
                    if (value) {
                      field.onChange(value)
                    } else {
                      field.onChange('')
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormDescription>
        Leave <span className="font-semibold"> end date </span>
        empty if you are currently in it.
      </FormDescription>

      <FormField
        control={form.control}
        name={`projects.${index}.projectUrl`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project link</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`projects.${index}.description`}
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
