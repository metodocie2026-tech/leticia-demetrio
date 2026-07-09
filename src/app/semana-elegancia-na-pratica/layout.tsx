import type { Metadata } from 'next'
import { EVENTO } from '@/constants/evento'

export const metadata: Metadata = {
  title: EVENTO.seo.titulo,
  description: EVENTO.seo.descricao,
  robots: { index: true, follow: true },
}

export default function SemanaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
