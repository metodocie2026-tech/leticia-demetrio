import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { EventHeader } from '@/components/evento/EventHeader'
import { ListaEsperaForm } from '@/components/evento/ListaEsperaForm'
import { WhatsAppFloat } from '@/components/sections/WhatsAppFloat'
import { getSettings } from '@/lib/settings'

const SUPORTE_MSG = 'Olá Letícia! Tenho dúvidas sobre a lista de espera da Semana Elegância na Prática.'

const BIO_PARAGRAPHS = [
  'Sou consultora de imagem e criadora do Método C.I.E. E durante muito tempo, eu também achei que não tinha estilo. Eu me vestia, mas não me reconhecia. Copiava referências, seguia tendências e ainda assim sentia que algo não encaixava.',
  'Tudo começou a mudar quando eu entendi que estilo não é sobre moda. É sobre clareza, identidade e intenção.',
  'Na semana Elegância na Prática, eu vou te mostrar como aplicar isso na vida real, de forma leve, prática e possível.',
  'Se hoje você sente que sua imagem não representa quem você é, essa aula é para você.',
]

export default async function ListaEsperaPage() {
  const settings = await getSettings()
  if (!settings.lista_espera_ativo) redirect('/')

  return (
    <>
      <EventHeader />

      <main>

        {/* ── Hero + Form ──────────────────────────────────────────── */}
        <section
          id="form"
          className="bg-white min-h-[100dvh] lg:min-h-0 flex flex-col justify-center lg:block py-6 lg:py-20"
          aria-label="Lista de espera"
        >
          {/* Gradient stripe accent at top */}
          <div className="h-1 gradient-bg mb-6 lg:mb-16 lg:-mt-20" aria-hidden="true" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* ── Left: copy (hidden on mobile) ────────────────── */}
            <div className="hidden lg:block">
              <span className="inline-block mb-4 text-xs font-semibold tracking-[0.22em] uppercase font-body border border-secondary/40 rounded-full px-5 py-2 bg-secondary/8 text-secondary">
                Lista de Espera
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-[1.1] mb-5">
                Semana{' '}
                <span className="text-primary">Elegância</span>{' '}
                na Prática!
              </h1>
              <p className="font-body text-subtle text-base lg:text-lg leading-relaxed">
                Aprenda a se vestir de forma elegante e prática para qualquer ocasião em até 30 dias.
              </p>
            </div>

            {/* ── Right: form ──────────────────────────────────── */}
            <div>
              {/* Mobile-only heading above form */}
              <div className="lg:hidden mb-4">
                <span className="inline-block mb-3 text-xs font-semibold tracking-[0.22em] uppercase font-body border border-secondary/40 rounded-full px-4 py-1.5 bg-secondary/8 text-secondary">
                  Lista de Espera
                </span>
                <h1 className="font-heading text-2xl font-bold text-dark leading-tight">
                  Semana <span className="text-primary">Elegância</span> na Prática!
                </h1>
              </div>
              <ListaEsperaForm />
            </div>

          </div>
        </section>

        {/* ── Problem bridge ──────────────────────────────────────── */}
        <section className="gradient-bg py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px]" />
          </div>
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="font-heading text-2xl sm:text-3xl font-bold text-white leading-snug mb-6">
              O problema não é o seu guarda-roupa.{' '}
              <span className="text-white/70">É a falta de clareza na hora de se vestir.</span>
            </p>
            <p className="font-body text-white/75 text-base leading-relaxed mb-10">
              Mesmo que você tenha um guarda-roupa cheio, mas ainda se sinta perdida na hora de se vestir ou nunca saiba se está bem vestida de verdade.
            </p>
            <a
              href="#form"
              className="inline-flex items-center justify-center text-center font-body font-bold rounded-full text-sm sm:text-base px-8 sm:px-10 py-4 bg-white text-primary hover:bg-primary-light transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              QUERO ME INSCREVER AGORA!
            </a>
          </div>
        </section>

        {/* ── Bio ─────────────────────────────────────────────────── */}
        <section className="bg-dark py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
              <div className="shrink-0">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-4 ring-secondary/40 shadow-xl">
                  <Image
                    src="/images/leticia.png"
                    alt="Letícia Demétrio"
                    width={176}
                    height={176}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary font-body">
                  Quem vai te guiar
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2 mb-5">
                  Prazer, eu sou Letícia Demétrio
                </h2>
                <div className="flex flex-col gap-4">
                  {BIO_PARAGRAPHS.map((p, i) => (
                    <p key={i} className="text-white/65 font-body leading-relaxed text-sm sm:text-base">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24 border-t border-neutral text-center">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <p className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-3 leading-snug">
              Não perca a próxima turma.
            </p>
            <p className="font-body text-subtle text-base mb-8 leading-relaxed">
              Entre na lista de espera e seja avisada assim que as vagas abrirem.
            </p>
            <a
              href="#form"
              className="inline-flex items-center justify-center text-center font-body font-bold rounded-full text-sm sm:text-base px-8 sm:px-10 py-4 gradient-bg text-white hover:brightness-110 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              QUERO ME INSCREVER AGORA!
            </a>
          </div>
        </section>

      </main>

      <WhatsAppFloat message={SUPORTE_MSG} />

      <footer className="bg-dark border-t border-white/8 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 font-body text-center sm:text-left">
            © {new Date().getFullYear()} Letícia Demétrio · CNPJ: 58.679.269/0001-26
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/politica-de-privacidade"
              target="_blank"
              className="text-xs text-white/30 hover:text-primary font-body transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-de-uso"
              target="_blank"
              className="text-xs text-white/30 hover:text-primary font-body transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
