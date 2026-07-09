'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SlidersHorizontal, FileText, Video } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Config', icon: SlidersHorizontal },
  { href: '/admin/resultados', label: 'Resultados', icon: FileText },
  { href: '/admin/aulas', label: 'Aulas', icon: Video },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="bg-dark border-b border-white/8" aria-label="Navegação do painel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-body font-medium border-b-2 transition-colors ${
                isActive
                  ? 'text-primary border-primary'
                  : 'text-white/40 border-transparent hover:text-white/70'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
