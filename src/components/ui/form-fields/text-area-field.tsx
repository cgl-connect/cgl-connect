import { TextareaHTMLAttributes } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string
}

export function TextAreaField({ placeholder, ...props }: TextAreaFieldProps) {
  return <Textarea placeholder={placeholder} {...props} />
}
