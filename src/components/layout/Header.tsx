'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS } from '@/constants/navigation'

const SECTION_IDS = ['sobre', 'servicos', 'metodos', 'depoimentos', 'contato']

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent',
      )}
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <a href="#inicio" aria-label="Letícia Demétrio – Início" className="relative shrink-0">
          <Image
            src="/images/logo/white_logo.png"
            alt="Letícia Demétrio"
            width={220}
            height={56}
            priority
            className={cn('transition-opacity duration-300', scrolled ? 'opacity-0' : 'opacity-100')}
          />
          <Image
            src="/images/logo/black_logo.png"
            alt=""
            width={220}
            height={56}
            priority
            className={cn('absolute inset-0 transition-opacity duration-300', scrolled ? 'opacity-100' : 'opacity-0')}
          />
        </a>

        {/* Desktop navigation */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace('#', '')
            const isActive = activeId === sectionId
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium font-body transition-all duration-200',
                    isActive
                      ? 'bg-primary text-white'
                      : scrolled
                        ? 'text-subtle hover:text-primary hover:bg-primary-light'
                        : 'text-white/85 hover:text-white hover:bg-white/10',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button size="sm" onClick={() => window.open(buildWhatsAppUrl(), '_blank')}>
            Entre em Contato
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            'md:hidden p-2 rounded-lg transition-colors',
            scrolled ? 'text-dark hover:bg-surface' : 'text-white hover:bg-white/10',
          )}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col p-6 gap-1 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-3.5 rounded-xl text-base font-medium font-body text-dark hover:bg-surface hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6 pt-6 border-t border-surface">
            <Button
              className="w-full"
              onClick={() => {
                window.open(buildWhatsAppUrl(), '_blank')
                setMenuOpen(false)
              }}
            >
              Entre em Contato pelo WhatsApp
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
