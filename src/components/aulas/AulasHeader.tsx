import Image from 'next/image'

export function AulasHeader() {
  return (
    <header className="sticky top-0 z-40 bg-dark/95 backdrop-blur-sm border-b border-white/10">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/images/logo/white_logo.png"
            alt="Letícia Demétrio"
            width={160}
            height={40}
            priority
          />
          <span className="text-xs font-body text-white/30 hidden sm:inline shrink-0">
            · Replays
          </span>
        </div>

        <span
          className="shrink-0 text-xs font-body font-semibold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full"
          aria-label="Semana Elegância na Prática — Replays"
        >
          Semana da Imagem
        </span>
      </div>
    </header>
  )
}
