import type { ReactNode } from 'react'

const URL_REGEX = /(https?:\/\/[^\s]+)/g

export function linkify(text: string): ReactNode[] {
  return text.split(URL_REGEX).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-accent transition-colors"
      >
        {part}
      </a>
    ) : (
      part
    )
  )
}
