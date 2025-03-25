import { ReactNode } from 'react'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface SelectFieldProps {
  placeholder?: string
  children: ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

export function SelectField({
  placeholder,
  children,
  value,
  onValueChange,
  defaultValue
}: SelectFieldProps) {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      value={value}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  )
}
