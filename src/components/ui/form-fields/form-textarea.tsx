import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { TextAreaField } from './text-area-field'

interface FormTextareaProps {
  name: string
  label: string
  placeholder?: string
  description?: string
  required?: boolean
}

export function FormTextarea({
  name,
  label,
  placeholder,
  description,
  required = false
}: FormTextareaProps) {
  const { control } = useFormContext()
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <FormControl>
            <TextAreaField 
              placeholder={placeholder} 
              {...field} 
              value={field.value || ''} 
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
