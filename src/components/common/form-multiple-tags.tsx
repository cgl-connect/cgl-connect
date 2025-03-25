"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

interface FormMultipleTagsProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function FormMultipleTags({
  name,
  label,
  placeholder = "Add tags...",
  className,
  disabled = false,
}: FormMultipleTagsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const form = useFormContext();

  const handleAddTag = () => {
    const value = inputValue.trim();
    if (!value) return;

    const currentTags = form.getValues(name) || [];
    
    if (!currentTags.includes(value)) {
      form.setValue(name, [...currentTags, value], { shouldValidate: true });
    }
    
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === ",") && inputValue) {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Backspace" && !inputValue) {
      const currentTags = form.getValues(name) || [];
      if (currentTags.length > 0) {
        form.setValue(
          name,
          currentTags.slice(0, -1),
          { shouldValidate: true }
        );
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    const currentTags = form.getValues(name) || [];
    form.setValue(
      name,
      currentTags.filter((_: any, index: number) => index !== indexToRemove),
      { shouldValidate: true }
    );
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div
              className={cn(
                "flex flex-wrap gap-2 p-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-10",
                className
              )}
              onClick={handleContainerClick}
            >
              {(field.value || []).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {tag}</span>
                  </button>
                </Badge>
              ))}
              <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleAddTag}
                className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-1"
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
