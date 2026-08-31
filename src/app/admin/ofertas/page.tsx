import type { Metadata } from 'next'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { OfertasPanel } from '@/components/admin/OfertasPanel'
import { getOfertas } from '@/lib/ofertas'

export const metadata: Metadata = {
  title: 'Ofertas — Painel Letícia Demétrio',
  robots: { index: false, follow: false },
}

export default async function AdminOfertasPage() {
  const ofertas = await getOfertas()

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <OfertasPanel ofertas={ofertas} />
      </main>
    </div>
  )
}
