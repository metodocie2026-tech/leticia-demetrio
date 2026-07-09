'use client'

import { Monitor, MapPin, Layers } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Button } from '@/components/ui/Button'
import { COURSE_METHODS } from '@/constants/services'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import type { CourseMethod } from '@/types'

const TYPE_CONFIG: Record<
  CourseMethod['type'],
  { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  presencial: { label: 'Presencial', Icon: MapPin },
  online: { label: 'Online', Icon: Monitor },
  ambos: { label: 'Presencial & Online', Icon: Layers },
}

export function Methods() {
  return (
    <section
      id="metodos"
      className="py-20 lg:py-28 bg-dark"
      aria-labelledby="metodos-titulo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Cursos & Programas"
          title="Métodos e Formações"
          subtitle="Programas cuidadosamente desenvolvidos para diferentes objetivos e momentos da sua jornada."
          center
          light
          id="metodos-titulo"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSE_METHODS.map((method) => {
            const { label, Icon } = TYPE_CONFIG[method.type]
            return (
              <article
                key={method.id}
                className={cn(
                  'relative p-5 sm:p-7 rounded-2xl border transition-all duration-300 hover:scale-[1.02]',
                  method.featured
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20',
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon
                    size={13}
                    className={method.featured ? 'text-primary' : 'text-white/40'}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      'text-xs font-medium font-body tracking-wide',
                      method.featured ? 'text-primary' : 'text-white/40',
                    )}
                  >
                    {label}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-white mb-3">{method.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed font-body">
                  {method.description}
                </p>

                {method.featured && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() =>
                        window.open(
                          buildWhatsAppUrl(
                            `Olá! Tenho interesse no programa "${method.title}". Poderia me dar mais informações?`,
                          ),
                          '_blank',
                        )
                      }
                    >
                      Quero saber mais
                    </Button>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/45 text-sm font-body mb-4">Não encontrou o que procurava?</p>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white hover:text-dark"
            onClick={() => window.open(buildWhatsAppUrl(), '_blank')}
          >
            Converse comigo pelo WhatsApp
          </Button>
        </div>
      </div>
    </section>
  )
}
