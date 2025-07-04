import { useEffect } from 'react'
import { GripHorizontal } from 'lucide-react'
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { DocumentEditorFormProps } from '@/lib/types'
import { educationSchema, EducationValues } from '@/shemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function EducationForm({
  resumeData,
  setResumeData,
}: DocumentEditorFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || [],
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return
      setResumeData({
        ...resumeData,
        educations: values.educations?.filter((edu) => edu !== undefined) || [],
      })
    })
    return unsubscribe
  }, [form, resumeData, setResumeData])

  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: 'educations',
  })

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className=" text-2xl font-semibold">Education</h2>
        <p className="text-sm text-muted-foreground">
          Add as many educations as you like
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {fields.map((field, index) => (
            <EducationItem
              key={field.id}
              index={index}
              form={form}
              remove={remove}
            />
          ))}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  degree: '',
                  school: '',
                  startDate: '',
                  endDate: '',
                })
              }
            >
              Add education
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

interface EducationItemProps {
  form: UseFormReturn<EducationValues>
  index: number
  remove: (index: number) => void
}
function EducationItem({ form, index, remove }: EducationItemProps) {
  return (
    <div className="space-y-3 border rounded-md bg-background p-3">
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Education {index + 1} </span>
        <GripHorizontal className="size-5 cursor-grab text-muted-foreground" />
      </div>

      <FormField
        control={form.control}
        name={`educations.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`educations.${index}.school`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>School</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`educations.${index}.startDate`}
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
                      // Validate the date format (YYYY-MM-DD)
                      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        const date = new Date(value)
                        // Check if it's a valid date
                        if (!isNaN(date.getTime())) {
                          field.onChange(value)
                        } else {
                          field.onChange('')
                        }
                      } else {
                        field.onChange('')
                      }
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
          name={`educations.${index}.endDate`}
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
                      // Validate the date format (YYYY-MM-DD)
                      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        const date = new Date(value)
                        // Check if it's a valid date
                        if (!isNaN(date.getTime())) {
                          field.onChange(value)
                        } else {
                          field.onChange('')
                        }
                      } else {
                        field.onChange('')
                      }
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

      <Button variant={'destructive'} onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  )
}
