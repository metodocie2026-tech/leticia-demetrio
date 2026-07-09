import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import { getSettings } from '@/lib/settings'

export async function WhatsAppFloat({ message }: { message?: string } = {}) {
  const settings = await getSettings()
  const phone = settings.whatsapp_number || undefined
  return (
    <a
      href={buildWhatsAppUrl(message, phone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com Letícia Demétrio pelo WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      {/* Pulsing ring */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"
        aria-hidden="true"
      />
      <MessageCircle size={26} fill="white" aria-hidden="true" />
    </a>
  )
}
