import { MapPin, Monitor, Clock, MessageCircle } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/SocialIcons'
import { cn } from '@/utils/cn'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import { INSTAGRAM_URL } from '@/constants/navigation'

const cards = [
  {
    Icon: MapPin,
    title: 'Atendimento Presencial',
    description:
      'Consultorias presenciais com hora marcada. Entre em contato para saber a localização e os horários disponíveis.',
  },
  {
    Icon: Monitor,
    title: 'Atendimento Online',
    description:
      'Atendo clientes em todo o Brasil por videochamada, com a mesma qualidade e atenção dos atendimentos presenciais.',
  },
  {
    Icon: Clock,
    title: 'Horários de Atendimento',
    description: 'Segunda a Sexta: 9h às 18h\nSábado: 9h às 13h\nHorários especiais sob consulta.',
  },
]

const ctaLinkClass = cn(
  'inline-flex items-center justify-center gap-2.5 font-body font-semibold rounded-full',
  'text-base px-8 py-4 transition-all duration-200',
  'shadow-lg hover:shadow-xl hover:-translate-y-0.5',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
)

export function Location() {
  return (
    <section
      id="onde-encontrar"
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="location-titulo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Onde me encontrar"
          title="Como Agendar"
          subtitle="Atendo de forma presencial e online para todo o Brasil. Escolha a modalidade que melhor se adapta a você."
          center
          id="location-titulo"
          className="mb-14"
        />

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {cards.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="text-center p-6 sm:p-8 rounded-2xl bg-surface border border-primary/10"
            >
              <div
                className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4"
                aria-hidden="true"
              >
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-heading text-lg font-bold text-dark mb-3">{title}</h3>
              <p className="text-subtle text-sm leading-relaxed font-body whitespace-pre-line">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              ctaLinkClass,
              'bg-primary text-white hover:brightness-110 focus-visible:ring-primary w-full sm:w-auto',
            )}
          >
            <MessageCircle size={20} aria-hidden="true" />
            Agendar pelo WhatsApp
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              ctaLinkClass,
              'border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary w-full sm:w-auto',
            )}
          >
            <InstagramIcon size={20} />
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
