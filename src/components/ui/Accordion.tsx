'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={cn('flex flex-col divide-y divide-neutral', className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const panelId = `accordion-panel-${i}`
        const buttonId = `accordion-button-${i}`

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                <span className="font-heading text-base sm:text-lg font-bold text-dark">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  className={cn(
                    'shrink-0 text-primary transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn('grid transition-all duration-200 ease-out', isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]')}
            >
              <div className="overflow-hidden">
                <p className="text-subtle text-sm leading-relaxed font-body">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
