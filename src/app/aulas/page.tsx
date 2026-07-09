import { redirect } from 'next/navigation'
import { AulasHeader } from '@/components/aulas/AulasHeader'
import { AulasView } from '@/components/aulas/AulasView'
import { getSettings } from '@/lib/settings'
import { getAulas } from '@/lib/aulas'

export default async function AulasPage({
  searchParams,
}: {
  searchParams: Promise<{ aula?: string }>
}) {
  const [settings, videos, params] = await Promise.all([
    getSettings(),
    getAulas(),
    searchParams,
  ])

  if (!settings.aulas_ativo) redirect('/semana-elegancia-na-pratica/matriculas-abertas')

  const initialDay = Math.max(1, parseInt(params.aula ?? '1') || 1)

  return (
    <div className="min-h-dvh bg-dark">
      <AulasHeader />
      <main>
        <AulasView videos={videos} initialDay={initialDay} />
      </main>
    </div>
  )
}
