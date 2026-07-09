import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from '@/constants/navigation'

export function buildWhatsAppUrl(customMessage?: string, phone?: string): string {
  const number = phone || WHATSAPP_NUMBER
  const message = encodeURIComponent(customMessage ?? WHATSAPP_DEFAULT_MESSAGE)
  return `https://wa.me/${number}?text=${message}`
}
