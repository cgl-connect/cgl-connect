import { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
}

export function TextField({ placeholder, ...props }: TextFieldProps) {
  return <Input placeholder={placeholder} {...props} />
}
