import type { Metadata } from 'next'
import { EVENTO } from '@/constants/evento'

export const metadata: Metadata = {
  title: { absolute: EVENTO.seo.titulo },
  description: EVENTO.seo.descricao,
  alternates: { canonical: '/semana-elegancia-na-pratica' },
  robots: { index: true, follow: true },
}

export default function SemanaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
