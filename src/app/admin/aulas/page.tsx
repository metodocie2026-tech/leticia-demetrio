import type { Metadata } from 'next'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AulasPanel } from '@/components/admin/AulasPanel'
import { getAulas } from '@/lib/aulas'

export const metadata: Metadata = {
  title: 'Aulas — Painel Letícia Demétrio',
  robots: { index: false, follow: false },
}

export default async function AdminAulasPage() {
  const aulas = await getAulas()

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AulasPanel videos={aulas} />
      </main>
    </div>
  )
}
