'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useContactForm } from '@/hooks/useContactForm'
import { CONTACT_CONTENT } from '@/constants/content'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

export function Contact() {
  const { state, updateField, handleSubmit } = useContactForm()
  const { data, status, errors } = state
  const [consented, setConsented] = useState(false)
  const [consentError, setConsentError] = useState(false)

  function handleFormSubmit() {
    if (!consented) { setConsentError(true); return }
    handleSubmit()
  }

  return (
    <section
      id="contato"
      className="py-20 lg:py-28 bg-surface"
      aria-labelledby="contato-titulo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — info */}
          <div className="flex flex-col gap-6 justify-center">
            <SectionTitle
              eyebrow={CONTACT_CONTENT.eyebrow}
              title={CONTACT_CONTENT.headline}
              subtitle={CONTACT_CONTENT.description}
              id="contato-titulo"
            />

            <div className="mt-2">
              <p className="text-subtle text-sm font-body mb-4">
                Prefere uma resposta mais rápida?
              </p>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-body font-semibold rounded-full text-base px-8 py-4 bg-primary text-white hover:brightness-110 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Chamar no WhatsApp
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-primary/10">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center gap-5 py-14 text-center">
                <CheckCircle size={52} className="text-primary" aria-hidden="true" />
                <p className="font-heading text-xl font-bold text-dark">
                  Mensagem Enviada!
                </p>
                <p className="text-subtle font-body text-sm max-w-xs">
                  {CONTACT_CONTENT.form.successMessage}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleFormSubmit()
                }}
                className="flex flex-col gap-5"
                aria-label="Formulário de contato"
                noValidate
              >
                <Input
                  label="Nome"
                  placeholder={CONTACT_CONTENT.form.namePlaceholder}
                  value={data.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  error={errors.name}
                  autoComplete="name"
                  required
                />
                <Input
                  label="E-mail"
                  type="email"
                  placeholder={CONTACT_CONTENT.form.emailPlaceholder}
                  value={data.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={errors.email}
                  autoComplete="email"
                  required
                />
                <Input
                  label="Telefone / WhatsApp"
                  type="tel"
                  placeholder={CONTACT_CONTENT.form.phonePlaceholder}
                  value={data.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  error={errors.phone}
                  autoComplete="tel"
                  required
                />
                <Textarea
                  label="Como posso te ajudar?"
                  placeholder={CONTACT_CONTENT.form.messagePlaceholder}
                  value={data.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  error={errors.message}
                  rows={5}
                  required
                />

                {status === 'error' && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 p-4 rounded-xl bg-accent-light text-accent text-sm font-body"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                    {CONTACT_CONTENT.form.errorMessage}
                  </div>
                )}

                {/* Consent checkbox */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consented}
                      onChange={(e) => { setConsented(e.target.checked); setConsentError(false) }}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary cursor-pointer"
                      aria-required="true"
                    />
                    <span className="text-xs text-subtle font-body leading-relaxed">
                      Li e concordo com a{' '}
                      <Link href="/politica-de-privacidade" target="_blank" className="text-primary underline underline-offset-2 hover:text-accent">
                        Política de Privacidade
                      </Link>{' '}
                      e os{' '}
                      <Link href="/termos-de-uso" target="_blank" className="text-primary underline underline-offset-2 hover:text-accent">
                        Termos de Uso
                      </Link>
                      .
                    </span>
                  </label>
                  {consentError && (
                    <p role="alert" className="text-xs text-accent font-body pl-7">
                      Você precisa aceitar os termos para continuar.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  loading={status === 'submitting'}
                  className="mt-1"
                >
                  <Send size={17} aria-hidden="true" />
                  {status === 'submitting'
                    ? CONTACT_CONTENT.form.submittingLabel
                    : CONTACT_CONTENT.form.submitLabel}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
