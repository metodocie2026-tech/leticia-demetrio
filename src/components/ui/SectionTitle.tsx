import { cn } from '@/utils/cn'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  subtitle?: string
  center?: boolean
  light?: boolean
  id?: string
  className?: string
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
  id,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('flex flex-col gap-3', center && 'items-center text-center', className)}>
      {eyebrow && (
        <span
          className={cn(
            'text-xs font-semibold tracking-[0.2em] uppercase font-body',
            light ? 'text-primary-light' : 'text-primary',
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        id={id}
        className={cn(
          'font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight',
          light ? 'text-white' : 'text-dark',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-base sm:text-lg leading-relaxed max-w-2xl font-body',
            light ? 'text-white/75' : 'text-subtle',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
