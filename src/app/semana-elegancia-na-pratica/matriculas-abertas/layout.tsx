import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Matrículas Abertas — Método CIE | Letícia Demétrio',
  description: 'Aprenda a se vestir de forma elegante e prática para qualquer ocasião em até 30 dias com o Método CIE de Letícia Demétrio.',
  robots: { index: false, follow: false },
}

export default function MatriculasAbertasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
