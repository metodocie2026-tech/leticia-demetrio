import Link from 'next/link'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { ICON_MAP } from '@/constants/icons'
import { MODALIDADE_CONFIG } from '@/constants/modalidade'
import type { Oferta } from '@/types'

interface OfertaCardProps {
  readonly oferta: Oferta
  readonly variant: 'light' | 'dark'
}

function badgeClasses(isLight: boolean, destaque: boolean): string {
  if (destaque) return 'text-primary'
  return isLight ? 'text-muted' : 'text-white/40'
}

function iconBgClasses(isLight: boolean, destaque: boolean): string {
  if (!isLight) return 'gradient-bg'
  return destaque ? 'gradient-bg' : 'bg-surface group-hover:gradient-bg'
}

export function OfertaCard({ oferta, variant }: OfertaCardProps) {
  const isLight = variant === 'light'
  const detailHref = `/${oferta.tipo === 'servico' ? 'servicos' : 'produtos'}/${oferta.slug}`
  const Icon = ICON_MAP[oferta.icone]
  const { label: modalidadeLabel, Icon: ModalidadeIcon } = MODALIDADE_CONFIG[oferta.modalidade]

  const modalidadeColor = badgeClasses(isLight, oferta.destaque)
  const iconBg = iconBgClasses(isLight, oferta.destaque)

  return (
    <article
      className={cn(
        'group relative flex flex-col p-6 sm:p-8 rounded-2xl border transition-all duration-300 h-full',
        isLight && 'hover:shadow-xl hover:-translate-y-1',
        isLight && oferta.destaque && 'border-primary/30 bg-gradient-to-br from-primary-light to-secondary-light',
        isLight && !oferta.destaque && 'border-muted/20 bg-white hover:border-primary/30',
        !isLight && 'hover:scale-[1.02]',
        !isLight && oferta.destaque && 'border-primary/50 bg-primary/10',
        !isLight && !oferta.destaque && 'border-white/10 bg-white/5 hover:border-white/20',
      )}
    >
      {oferta.destaque && (
        <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full font-body bg-primary text-white">
          Popular
        </span>
      )}

      <div className="flex items-center gap-2 mb-4">
        <ModalidadeIcon size={13} className={modalidadeColor} aria-hidden="true" />
        <span className={cn('text-xs font-medium font-body tracking-wide', modalidadeColor)}>
          {modalidadeLabel}
        </span>
      </div>

      {Icon && (
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300',
            iconBg,
          )}
          aria-hidden="true"
        >
          <Icon size={22} className="text-white" />
        </div>
      )}

      <Link href={detailHref} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
        <h3
          className={cn(
            'font-heading text-lg font-bold mb-3 hover:text-primary transition-colors',
            isLight ? 'text-dark' : 'text-white',
          )}
        >
          {oferta.titulo}
        </h3>
      </Link>

      <p className={cn('text-sm leading-relaxed font-body', isLight ? 'text-subtle' : 'text-white/60')}>
        {oferta.descricaoCurta}
      </p>

      {oferta.investimentoNota && (
        <p className="text-xs font-body font-semibold mt-3 text-primary">{oferta.investimentoNota}</p>
      )}

      <div className={cn('mt-auto pt-6', !isLight && 'border-t border-white/10 mt-6')}>
        <Button
          href={detailHref}
          size="sm"
          variant={isLight ? 'primary' : 'outline'}
          className={cn('w-full', !isLight && 'border-primary text-primary hover:bg-primary hover:text-white')}
        >
          Saiba mais
        </Button>
      </div>
    </article>
  )
}
