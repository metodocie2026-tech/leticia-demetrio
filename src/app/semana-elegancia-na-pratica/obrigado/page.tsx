import type { Metadata } from 'next'
import { MessageCircle, Mail } from 'lucide-react'
import { EventHeader } from '@/components/evento/EventHeader'
import { WhatsAppFloat } from '@/components/sections/WhatsAppFloat'
import { EVENTO } from '@/constants/evento'
import { getSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: EVENTO.obrigada.seo.titulo,
  robots: { index: false, follow: false },
}

const SUPORTE_MSG = 'Preciso de ajuda sobre a Semana da Elegância na Prática!'

export default async function ObrigadaPage() {
  const settings = await getSettings()
  const whatsappGroupUrl = settings.whatsapp_group_url || '#'
  const surveyUrl = settings.survey_url || '#'
  return (
    <>
      <EventHeader />

      <main className="min-h-[calc(100vh-65px)] bg-surface py-4 sm:py-12 px-4">
        <div className="max-w-xl mx-auto flex flex-col gap-3 sm:gap-6">

          {/* ── Hero ───────────────────────────────────────────────── */}
          <div className="text-center py-1 sm:py-4">
            <span className="inline-block mb-2 sm:mb-4 text-xs font-semibold tracking-[0.2em] uppercase font-body border border-primary/40 rounded-full px-4 py-1.5 bg-primary/8 text-primary">
              Semana Elegância na Prática
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-bold text-dark leading-tight">
              Inscrição quase confirmada!
            </h1>
            <p className="text-subtle font-body mt-2 sm:mt-3 leading-relaxed text-sm sm:text-base max-w-sm mx-auto">
              Agora faltam apenas{' '}
              <strong className="text-dark font-semibold">2 passos</strong>{' '}
              para concluir sua inscrição.
            </p>
          </div>

          {/* ── Step 1 — WhatsApp group ─────────────────────────── */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
            {/* Step label */}
            <div className="gradient-bg px-6 py-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="font-body font-bold text-white text-xl leading-none">1</span>
              </span>
              <p className="font-heading font-bold text-white text-base leading-tight">
                Clique no botão abaixo e participe do grupo de WhatsApp.
              </p>
            </div>

            <div className="px-6 py-3 sm:py-5 flex flex-col gap-3 sm:gap-4">
              <a
                href={whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center text-center gap-2.5 font-body font-bold text-sm rounded-full px-7 py-3 sm:py-3.5 bg-[#25D366] text-white hover:brightness-105 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
              >
                <MessageCircle size={17} aria-hidden="true" strokeWidth={2.5} />
                PARTICIPAR DO GRUPO
              </a>

              <p className="text-subtle font-body text-sm leading-relaxed">
                É por lá que você vai receber:{' '}
                <span className="text-dark font-semibold">os links das aulas</span>,{' '}
                <span className="text-dark font-semibold">lembretes antes do evento</span>.
              </p>

              {/* Warning */}
              <div className="bg-primary/6 border border-primary/20 rounded-xl px-4 py-2.5 sm:py-3 flex items-start gap-2.5">
                <span className="text-primary text-base shrink-0 mt-0.5" aria-hidden="true">⚠️</span>
                <p className="text-sm font-body text-dark font-semibold leading-snug">
                  Sem o grupo, você pode perder o acesso.
                </p>
              </div>
            </div>
          </div>

          {/* ── Step 2 — Email survey ───────────────────────────── */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
            {/* Step label */}
            <div className="gradient-bg px-6 py-3 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="font-body font-bold text-white text-xl leading-none">2</span>
              </span>
              <p className="font-heading font-bold text-white text-base leading-tight">
                Acesse seu e-mail e responda a pesquisa rápida (e resgate seu presente)
              </p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-subtle font-body text-sm leading-relaxed">
                Suas respostas ajudam a adaptar o conteúdo do evento, responder exatamente às suas dúvidas e tornar a aula ainda mais prática para você.
              </p>

              <div className="flex items-center gap-2">
                <span className="h-px flex-1 bg-neutral" aria-hidden="true" />
                <span className="text-xs font-body font-semibold text-muted tracking-wide uppercase">
                  Semana Elegância na Prática
                </span>
                <span className="h-px flex-1 bg-neutral" aria-hidden="true" />
              </div>

              <a
                href={surveyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center text-center gap-2 font-body font-bold text-sm rounded-full px-7 py-3.5 bg-primary text-white hover:brightness-110 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                RESGATAR O SEU PRESENTE
              </a>

              {/* Email note */}
              <div className="bg-surface border border-neutral rounded-xl px-4 py-3 flex items-start gap-2.5">
                <Mail size={15} className="text-muted shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs font-body text-muted leading-relaxed">
                  <span className="text-dark font-semibold">Verifique seu e-mail.</span>{' '}
                  Acabamos de te enviar um e-mail com mais informações. Dá uma olhadinha no spam ou na aba promoções também — às vezes ele vai parar lá.
                </p>
              </div>
            </div>
          </div>

          {/* ── Gift teaser ─────────────────────────────────────── */}
          <div className="bg-dark rounded-2xl px-6 py-6">
            <p className="text-primary text-xs font-semibold font-body uppercase tracking-widest mb-3">
              Seu presente
            </p>
            <p className="font-heading font-bold text-white text-lg leading-snug mb-2">
              O Mapa da Silhueta
            </p>
            <p className="text-white/60 text-sm font-body leading-relaxed">
              Um guia prático para te ajudar a usar as roupas a favor do seu corpo, valorizando sua imagem com mais intenção, equilíbrio e segurança.
            </p>
          </div>

          {/* ── Closing / event promise ─────────────────────────── */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-sm px-6 py-6">
            <p className="font-heading font-bold text-dark text-base leading-snug mb-4">
              Na Semana da Elegância na Prática, você vai sair sabendo:
            </p>
            <ul className="flex flex-col gap-2 mb-5">
              {['o que vestir,', 'por que vestir,', 'e como repetir isso na sua rotina.'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-body text-subtle">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-dark font-body font-semibold text-sm leading-relaxed mb-1">
              Aprenda a se vestir de forma elegante e prática para qualquer ocasião em até 30 dias.
            </p>
            <p className="text-muted font-body text-xs">
              O evento começa em breve. Reserve esse tempo para você.
            </p>
          </div>

        </div>
      </main>

      <WhatsAppFloat message={SUPORTE_MSG} />
    </>
  )
}
