import Image from 'next/image'
import { LogOut } from 'lucide-react'
import { AdminNav } from './AdminNav'

export function AdminHeader() {
  return (
    <div className="bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/white_logo.png"
            alt="Letícia Demétrio"
            width={160}
            height={40}
            priority
          />
          <span className="text-xs font-body font-semibold tracking-widest uppercase text-primary bg-primary/15 border border-primary/25 px-3 py-1 rounded-full">
            Painel
          </span>
        </div>

        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg px-2 py-1"
          >
            <LogOut size={15} aria-hidden="true" />
            Sair
          </button>
        </form>
      </div>
      <AdminNav />
    </div>
  )
}
