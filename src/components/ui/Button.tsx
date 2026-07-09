import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center text-center gap-2 font-body font-semibold rounded-full',
        'transition-all duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',

        variant === 'primary' &&
          'bg-primary text-white hover:brightness-110 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-primary',
        variant === 'secondary' &&
          'bg-secondary text-white hover:brightness-110 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-secondary',
        variant === 'outline' &&
          'border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary',
        variant === 'ghost' &&
          'text-primary hover:bg-primary-light focus-visible:ring-primary',

        size === 'sm' && 'text-sm px-5 py-2.5',
        size === 'md' && 'text-base px-7 py-3.5',
        size === 'lg' && 'text-base px-8 py-4',

        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
