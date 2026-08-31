import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Replays — Mapa do Estilo Próprio | Letícia Demétrio',
  description: 'Acesse os replays do Mapa do Estilo Próprio.',
  robots: { index: false, follow: false },
}

export default function AulasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
