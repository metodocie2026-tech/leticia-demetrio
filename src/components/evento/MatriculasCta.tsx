'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { PhoneInput, getCountryCode } from '@/components/ui/PhoneInput'
import { cn } from '@/utils/cn'

interface Props {
  variant: 'light' | 'dark' | 'hero'
  ctaUrl: string
}

type FormData = { nome: string; email: string; whatsapp: string }
type Status = 'idle' | 'submitting' | 'error'

const INITIAL: FormData = { nome: '', email: '', whatsapp: '' }

function validate(data: FormData) {
  const err: Partial<Record<keyof FormData, string>> = {}
  if (!data.nome.trim()) err.nome = 'Nome é obrigatório'
  if (!data.email.trim()) err.email = 'E-mail é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) err.email = 'E-mail inválido'
  if (!data.whatsapp.trim()) err.whatsapp = 'WhatsApp é obrigatório'
  return err
}

export function MatriculasCta({ variant, ctaUrl }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [countryId, setCountryId] = useState('55')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function openModal() {
    setForm(INITIAL)
    setCountryId('55')
    setErrors({})
    setStatus('idle')
    setOpen(true)
  }

  function update(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('submitting')
    try {
      const res = await fetch('/api/evento/matriculas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          whatsapp: `+${getCountryCode(countryId)}${form.whatsapp.replace(/\D/g, '')}`,
        }),
      })
      if (!res.ok) throw new Error()
      window.location.href = ctaUrl
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* ── CTA trigger button ───────────────────────────────────── */}
      <div className={cn('relative inline-block', variant === 'hero' && 'py-1.5')}>
        {variant === 'hero' && (
          <span
            className="absolute -inset-2 rounded-full bg-[#f0c987] opacity-60 blur-xl animate-pulse pointer-events-none"
            aria-hidden="true"
          />
        )}
        <button
          onClick={openModal}
          className={cn(
            'relative inline-flex items-center justify-center text-center font-body font-bold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            variant === 'dark' &&
              'text-sm sm:text-base px-8 sm:px-10 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 gradient-bg text-white hover:brightness-110 focus-visible:ring-primary',
            variant === 'light' &&
              'text-sm sm:text-base px-8 sm:px-10 py-4 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 bg-white text-primary hover:bg-primary-light focus-visible:ring-white',
            variant === 'hero' &&
              'text-base sm:text-lg px-10 sm:px-14 py-4 sm:py-5 shadow-2xl hover:shadow-[0_0_40px_rgba(240,201,135,0.6)] hover:-translate-y-1 hover:scale-105 bg-white text-primary ring-4 ring-[#f0c987] focus-visible:ring-white',
          )}
        >
          QUERO GARANTIR MINHA VAGA AGORA!
        </button>
      </div>

      {/* ── Modal overlay ────────────────────────────────────────── */}
      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Formulário de matrícula"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
          onClick={e => { if (e.target === overlayRef.current) setOpen(false) }}
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92dvh] flex flex-col">

            {/* Header */}
            <div className="gradient-bg px-6 pt-6 pb-5 relative shrink-0">
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={16} className="text-white" />
              </button>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-white/60 mb-2">
                Método CIE — Letícia Demétrio
              </p>
              <h2 className="font-heading text-xl font-bold text-white leading-snug">
                Sua inscrição está quase concluída!
              </h2>
              <p className="font-body text-white/75 text-sm mt-1.5">
                Insira seu melhor email e WhatsApp!
              </p>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left" noValidate>
                  <Input
                    label="Nome"
                    placeholder="Seu nome"
                    value={form.nome}
                    onChange={e => update('nome', e.target.value)}
                    error={errors.nome}
                    autoComplete="given-name"
                    required
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="seumelhoremail@email.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    error={errors.email}
                    autoComplete="email"
                    required
                  />

                  <PhoneInput
                    value={form.whatsapp}
                    countryId={countryId}
                    onNumberChange={(v) => update('whatsapp', v)}
                    onCountryChange={setCountryId}
                    error={errors.whatsapp}
                  />

                  {status === 'error' && (
                    <p role="alert" className="text-sm text-accent font-body text-center">
                      Ocorreu um erro. Tente novamente.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full mt-1 inline-flex items-center justify-center text-center gradient-bg text-white font-body font-bold text-sm rounded-full py-3.5 shadow-lg hover:brightness-110 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {status === 'submitting' ? 'Enviando...' : 'CONFIRMAR MINHA INSCRIÇÃO'}
                  </button>

                  <p className="text-xs text-muted font-body text-center leading-relaxed pb-1">
                    Ao submeter, autorizo Leticia Oliveira Demétrio a enviar notificações e concordo com a{' '}
                    <Link href="/politica-de-privacidade" target="_blank" className="underline underline-offset-2 hover:text-primary transition-colors">
                      Política de Privacidade
                    </Link>
                    .
                  </p>
                </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
