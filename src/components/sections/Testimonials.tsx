'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { EmblaCarouselType } from 'embla-carousel'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { TESTIMONIALS } from '@/constants/content'

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect(emblaApi)
    emblaApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section
      id="depoimentos"
      className="py-20 lg:py-28 bg-surface"
      aria-labelledby="depoimentos-titulo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row: title on top-left, arrows on right (stacks on mobile) */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-12">
          <SectionTitle
            eyebrow="Depoimentos"
            title="O Que Dizem Minhas Clientes"
            subtitle="Histórias reais de transformação, autoconfiança e estilo."
            id="depoimentos-titulo"
          />

          <div className="flex gap-2 shrink-0 sm:pb-1">
            <button
              onClick={scrollPrev}
              aria-label="Depoimento anterior"
              className="w-11 h-11 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Próximo depoimento"
              className="w-11 h-11 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        {/* Carousel viewport */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex -ml-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="pl-6 shrink-0 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <figure className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-primary/10 flex flex-col gap-4 h-full">
                  {/* Stars */}
                  <div className="flex gap-0.5" aria-label="Avaliação: 5 estrelas" role="img">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className="text-primary fill-primary"
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <Quote size={18} className="text-primary-medium" aria-hidden="true" />

                  <blockquote className="text-subtle text-sm leading-relaxed font-body flex-1">
                    <p>{item.quote}</p>
                  </blockquote>

                  <figcaption className="flex flex-col gap-0.5 pt-4 border-t border-surface">
                    <cite className="font-heading font-bold text-dark not-italic text-sm">
                      {item.author}
                    </cite>
                    {item.role && (
                      <span className="text-xs text-muted font-body">{item.role}</span>
                    )}
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Depoimentos">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Ir para depoimento ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === selectedIndex
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-primary/25 hover:bg-primary/50',
              )}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
