import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata: Metadata = {
  title: 'Área Restrita — Letícia Demétrio',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-heading font-bold text-dark text-2xl">
            Letícia <span className="text-primary">Demétrio</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-primary/10 p-8">
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck size={22} className="text-primary" aria-hidden="true" />
            </div>
            <h1 className="font-heading font-bold text-dark text-xl">
              Área Restrita
            </h1>
            <p className="text-muted text-sm font-body mt-1">
              Acesso exclusivo para administradores
            </p>
          </div>

          <LoginForm />
        </div>

      </div>
    </div>
  )
}
