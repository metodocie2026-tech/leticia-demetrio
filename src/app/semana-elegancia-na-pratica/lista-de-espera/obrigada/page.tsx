import type { Metadata } from 'next'
import { EventHeader } from '@/components/evento/EventHeader'
import { WhatsAppFloat } from '@/components/sections/WhatsAppFloat'

export const metadata: Metadata = {
  title: 'Você está na lista! — Semana Elegância na Prática | Letícia Demétrio',
  robots: { index: false, follow: false },
}

const SUPORTE_MSG = 'Olá Letícia! Tenho dúvidas sobre a lista de espera da Semana Elegância na Prática.'

export default function ListaEsperaObrigadaPage() {
  return (
    <>
      <EventHeader />

      <main className="min-h-[calc(100vh-65px)] bg-surface flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">

          {/* Icon */}
          <div className="gradient-bg w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-3xl" aria-hidden="true">🎉</span>
          </div>

          {/* Heading */}
          <div>
            <span className="inline-block mb-3 text-xs font-semibold tracking-[0.2em] uppercase font-body border border-primary/40 rounded-full px-4 py-1.5 bg-primary/8 text-primary">
              Semana Elegância na Prática
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark leading-tight mt-3">
              Você está na lista!
            </h1>
            <p className="font-body text-subtle text-base mt-3 leading-relaxed">
              Assim que as vagas da próxima turma abrirem, você será uma das primeiras a saber.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-sm px-6 py-6 w-full text-left">
            <p className="font-body text-dark text-sm font-semibold mb-2">O que acontece agora?</p>
            <ul className="flex flex-col gap-2">
              {[
                'Você receberá um e-mail de confirmação em breve.',
                'Quando a próxima turma abrir, você será avisada antes de todo mundo.',
                'Fique de olho na sua caixa de entrada — e no spam também!',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm font-body text-subtle">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </main>

      <WhatsAppFloat message={SUPORTE_MSG} />
    </>
  )
}
