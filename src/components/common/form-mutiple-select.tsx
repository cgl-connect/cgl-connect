'use client'

import * as React from 'react'
import { X, Check, ChevronsUpDown } from 'lucide-react'
import { useFormContext, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export interface Option {
  value: string
  label: string
}

interface FormMultiSelectProps {
  name: string
  label?: string
  placeholder?: string
  description?: string
  options: Option[]
  required?: boolean
  disabled?: boolean
  className?: string
  emptyMessage?: string
  onValuesChange?: (values: string[]) => void
}

export function FormMultiSelect({
  name,
  label,
  placeholder = 'Select options...',
  description,
  options,
  required = false,
  disabled = false,
  className,
  emptyMessage = 'No options found.',
  onValuesChange,
}: FormMultiSelectProps) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Controller
              control={form.control}
              name={name}
              render={({ field }) => {
                const selectedValues = field.value || []

                const isStringArray =
                  selectedValues.length === 0 ||
                  typeof selectedValues[0] === 'string'

                const selectedItems = isStringArray
                  ? options.filter(option =>
                      selectedValues.includes(option.value),
                    )
                  : options.filter(option =>
                      selectedValues.some(
                        (item: any) =>
                          item.value === option.value || item === option.value,
                      ),
                    )

                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={disabled}
                        className={cn(
                          'w-full justify-between',
                          !field.value?.length && 'text-muted-foreground',
                        )}
                      >
                        {selectedItems.length > 0
                          ? `${selectedItems.length} selected`
                          : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search options..." />
                        <CommandList>
                          <CommandEmpty>{emptyMessage}</CommandEmpty>
                          <CommandGroup>
                            {options.map(option => {
                              const isSelected = isStringArray
                                ? selectedValues.includes(option.value)
                                : selectedValues.some(
                                    (item: any) =>
                                      item.value === option.value ||
                                      item === option.value,
                                  )

                              return (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={() => {
                                    const newValues = isSelected
                                      ? selectedValues.filter((value: any) =>
                                          typeof value === 'string'
                                            ? value !== option.value
                                            : value.value !== option.value,
                                        )
                                      : [...selectedValues, option.value]

                                    field.onChange(newValues)
                                    if (onValuesChange) {
                                      onValuesChange(newValues)
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      isSelected ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                  {option.label}
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )
              }}
            />
          </FormControl>

          {/* Display selected items as badges */}
          {field.value?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {options
                .filter(
                  option =>
                    Array.isArray(field.value) &&
                    field.value.includes(option.value),
                )
                .map(option => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="px-2 py-1"
                  >
                    {option.label}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer "
                      style={{ pointerEvents: 'all' }}
                      onClick={() => {
                        const newValues = field.value.filter(
                          (value: string) => value !== option.value,
                        )
                        field.onChange(newValues)
                        if (onValuesChange) {
                          onValuesChange(newValues)
                        }
                      }}
                    />
                  </Badge>
                ))}
            </div>
          )}

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
