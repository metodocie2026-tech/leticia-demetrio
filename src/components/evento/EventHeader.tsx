import Image from 'next/image'
import { EVENTO } from '@/constants/evento'

export function EventHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-primary/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/black_logo.png"
            alt="Letícia Demétrio"
            width={120}
            height={30}
            priority
          />
          <span className="hidden sm:inline text-xs font-body text-muted">
            {EVENTO.nome}
          </span>
        </div>
        <span className="text-xs font-body font-semibold tracking-widest uppercase text-primary bg-primary-light px-3 py-1.5 rounded-full">
          100% gratuito
        </span>
      </div>
    </header>
  )
}
