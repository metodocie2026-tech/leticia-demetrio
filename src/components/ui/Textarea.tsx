import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-dark font-body">
          {label}
          {props.required && (
            <span className="text-accent ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={5}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white font-body text-dark resize-none',
          'placeholder:text-muted text-sm',
          'transition-all duration-200 outline-none',
          'focus:ring-2 focus:border-transparent',
          error
            ? 'border-accent focus:ring-accent'
            : 'border-muted/40 hover:border-primary-medium focus:ring-primary',
          className,
        )}
        {...props}
      />
      {error && (
        <p role="alert" className="text-xs text-accent font-body">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-muted font-body">{helperText}</p>
      )}
    </div>
  )
}
