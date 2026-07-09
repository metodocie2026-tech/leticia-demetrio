import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lista de Espera — Semana Elegância na Prática | Letícia Demétrio',
  description: 'Entre na lista de espera da Semana Elegância na Prática e seja a primeira a saber quando as vagas abrirem.',
  robots: { index: false, follow: false },
}

export default function ListaEsperaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
