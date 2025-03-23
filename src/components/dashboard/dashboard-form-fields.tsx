'use client'

import { z } from 'zod'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormText } from '@/components/ui/form-fields/form-text'
import { FormTextarea } from '@/components/ui/form-fields/form-textarea'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'

export const dashboardFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
})

export type DashboardFormValues = z.infer<typeof dashboardFormSchema>

interface DashboardFormFieldsProps {
  defaultValues?: DashboardFormValues
  onSubmit: (values: DashboardFormValues) => void
  isSubmitting?: boolean
  children?: React.ReactNode
}

export default function DashboardFormFields({
  defaultValues = {
    name: '',
    description: '',
    isPublic: false,
  },
  onSubmit,
  isSubmitting = false,
  children,
}: DashboardFormFieldsProps) {
  const methods = useForm<DashboardFormValues>({
    resolver: zodResolver(dashboardFormSchema),
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormText
          name="name"
          label="Name"
          placeholder="Enter dashboard name"
          required
        />

        <FormTextarea
          name="description"
          label="Description"
          placeholder="Enter dashboard description"
        />

        <FormField
          control={methods.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Public Dashboard</FormLabel>
                <FormDescription>
                  Make this dashboard accessible to anyone with the link
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </FormProvider>
  )
}
