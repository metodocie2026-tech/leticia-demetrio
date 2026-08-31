import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lista de Espera — Mapa do Estilo Próprio | Letícia Demétrio',
  description: 'Entre na lista de espera do Mapa do Estilo Próprio e seja a primeira a saber quando as vagas abrirem.',
  robots: { index: false, follow: false },
}

export default function ListaEsperaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
