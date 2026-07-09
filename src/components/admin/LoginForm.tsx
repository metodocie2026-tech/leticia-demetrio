'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

export function LoginForm() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      window.location.href = '/admin'
    } else {
      setStatus('error')
      setPassword('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="relative">
        <label htmlFor="password" className="block text-sm font-body font-medium text-subtle mb-1.5">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setStatus('idle') }}
            placeholder="••••••••"
            required
            autoFocus
            className="w-full rounded-xl border border-primary/20 bg-white px-4 py-3 pr-11 font-body text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-subtle transition-colors"
            aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm font-body text-accent text-center">
          Senha incorreta. Tente novamente.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !password}
        className="mt-1 flex items-center justify-center gap-2 w-full rounded-full bg-primary text-white font-body font-semibold text-sm py-3.5 hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Lock size={14} aria-hidden="true" />
        {status === 'loading' ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
