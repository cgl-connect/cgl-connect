import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { SelectField } from './select-field'
import { SelectItem } from '@/components/ui/select'

interface Option {
  value: string
  label: string
}

interface FormSelectProps {
  name: string
  label: string
  placeholder?: string
  options: Option[]
  description?: string
  required?: boolean
  onValueChange?: (value: string) => void
  includeEmpty?: boolean
  emptyLabel?: string
}

export function FormSelect({
  name,
  label,
  placeholder,
  options,
  description,
  required = false,
  onValueChange,
  includeEmpty = false,
  emptyLabel = "None"
}: FormSelectProps) {
  const { control } = useFormContext()
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>
          <FormControl>
            <SelectField
              placeholder={placeholder}
              value={field.value}
              defaultValue={field.value}
              onValueChange={(value) => {
                field.onChange(value)
                if (onValueChange) onValueChange(value)
              }}
            >
              {includeEmpty && <SelectItem value={null as unknown as string}>{emptyLabel}</SelectItem>}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectField>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
