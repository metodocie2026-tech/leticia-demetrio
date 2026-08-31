import { buildWhatsAppUrl } from '@/utils/whatsapp'
import type { Oferta } from '@/types'

export function resolveOfertaCta(oferta: Oferta): { href: string; label: string } {
  const href =
    oferta.ctaTipo === 'link' && oferta.ctaUrl
      ? oferta.ctaUrl
      : buildWhatsAppUrl(oferta.ctaMensagem || undefined)
  const label = oferta.ctaLabel || (oferta.ctaTipo === 'link' ? 'Saiba mais' : 'Falar no WhatsApp')
  return { href, label }
}
