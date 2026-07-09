import {
  Palette,
  Sparkles,
  ShoppingBag,
  Scissors,
  BookOpen,
  Heart,
  type LucideProps,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { SERVICES } from '@/constants/services'

type IconComponent = React.ComponentType<LucideProps>

const ICON_MAP: Record<string, IconComponent> = {
  Palette,
  Sparkles,
  ShoppingBag,
  Scissors,
  BookOpen,
  Heart,
}

export function Services() {
  return (
    <section
      id="servicos"
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="servicos-titulo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="O que ofereço"
          title="Serviços Personalizados"
          subtitle="Cada serviço é pensado para ajudá-la a descobrir e expressar a melhor versão de si mesma."
          center
          id="servicos-titulo"
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = ICON_MAP[service.icon]
            return (
              <article
                key={service.id}
                className={cn(
                  'group relative p-6 sm:p-8 rounded-2xl border transition-all duration-300',
                  'hover:shadow-xl hover:-translate-y-1',
                  service.featured
                    ? 'border-primary/30 bg-gradient-to-br from-primary-light to-secondary-light'
                    : 'border-muted/20 bg-white hover:border-primary/30',
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300',
                    service.featured
                      ? 'gradient-bg'
                      : 'bg-surface group-hover:gradient-bg',
                  )}
                  aria-hidden="true"
                >
                  {Icon && <Icon size={22} className="text-white" />}
                </div>

                <h3 className="font-heading text-lg font-bold text-dark mb-3">
                  {service.title}
                </h3>
                <p className="text-subtle text-sm leading-relaxed font-body">
                  {service.description}
                </p>

                {service.featured && (
                  <span className="absolute top-4 right-4 text-xs font-semibold bg-primary text-white px-3 py-1 rounded-full font-body">
                    Popular
                  </span>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
