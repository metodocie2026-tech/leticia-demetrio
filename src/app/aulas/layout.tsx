import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Replays — Semana Elegância na Prática | Letícia Demétrio',
  description: 'Acesse os replays da Semana Elegância na Prática.',
  robots: { index: false, follow: false },
}

export default function AulasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
