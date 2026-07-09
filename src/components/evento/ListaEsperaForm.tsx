'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PhoneInput, getCountryCode } from '@/components/ui/PhoneInput'

interface FormData {
  email: string
  nome: string
  whatsapp: string
}

const INITIAL: FormData = { email: '', nome: '', whatsapp: '' }

function validate(data: FormData) {
  const err: Partial<Record<keyof FormData, string>> = {}
  if (!data.email.trim()) err.email = 'E-mail é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) err.email = 'E-mail inválido'
  if (!data.nome.trim()) err.nome = 'Nome é obrigatório'
  if (!data.whatsapp.trim()) err.whatsapp = 'WhatsApp é obrigatório'
  return err
}

export function ListaEsperaForm() {
  const router = useRouter()
  const [data, setData] = useState<FormData>(INITIAL)
  const [countryId, setCountryId] = useState('55')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  function update(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(data)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('submitting')
    try {
      const res = await fetch('/api/evento/lista-espera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          whatsapp: `+${getCountryCode(countryId)}${data.whatsapp.replace(/\D/g, '')}`,
        }),
      })
      if (!res.ok) throw new Error()
      router.push('/semana-elegancia-na-pratica/lista-de-espera/obrigada')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:gap-4 w-full"
      aria-label="Formulário de lista de espera"
      noValidate
    >
      <Input
        label="E-mail"
        type="email"
        placeholder="seumelhoremail@email.com"
        value={data.email}
        onChange={(e) => update('email', e.target.value)}
        error={errors.email}
        autoComplete="email"
        required
      />
      <Input
        label="Nome"
        placeholder="Seu nome"
        value={data.nome}
        onChange={(e) => update('nome', e.target.value)}
        error={errors.nome}
        autoComplete="given-name"
        required
      />
      <PhoneInput
        value={data.whatsapp}
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

      <Button
        type="submit"
        size="lg"
        loading={status === 'submitting'}
        className="w-full mt-1 !py-2.5 sm:!py-4"
      >
        {status === 'submitting' ? 'Entrando na lista…' : 'Quero entrar na lista de espera!'}
      </Button>

      <p className="text-xs text-muted font-body text-center leading-relaxed">
        De acordo com as Leis 12.965/2014 e 13.709/2018, ao submeter este formulário autorizo
        Leticia Oliveira Demétrio a enviar notificações e concordo com sua{' '}
        <Link href="/politica-de-privacidade" target="_blank" className="underline underline-offset-2 hover:text-primary transition-colors">
          Política de Privacidade
        </Link>{' '}
        e{' '}
        <Link href="/termos-de-uso" target="_blank" className="underline underline-offset-2 hover:text-primary transition-colors">
          Termos de Uso
        </Link>
        .
      </p>
    </form>
  )
}
