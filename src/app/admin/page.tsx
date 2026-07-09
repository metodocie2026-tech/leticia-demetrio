import type { Metadata } from 'next'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { SettingsPanel } from '@/components/admin/SettingsPanel'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Config — Letícia Demétrio Admin',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <SettingsPanel settings={settings} />
      </main>
    </div>
  )
}
