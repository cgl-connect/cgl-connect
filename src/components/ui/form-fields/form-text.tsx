import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { TextField } from './text-field'

interface FormTextProps {
  name: string
  label: string
  placeholder?: string
  description?: string
  required?: boolean
  type?: 'text' | 'password'
}

export function FormText({
  name,
  label,
  placeholder,
  description,
  required = false
}: FormTextProps) {
  const { control } = useFormContext()

  // TODO: implement type password field

  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <FormControl>
            <TextField placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
