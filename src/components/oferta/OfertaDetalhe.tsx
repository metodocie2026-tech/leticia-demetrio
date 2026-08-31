import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/sections/WhatsAppFloat'
import { About } from '@/components/sections/About'
import { Testimonials } from '@/components/sections/Testimonials'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { Button } from '@/components/ui/Button'
import { OfertaCard } from '@/components/ui/OfertaCard'
import { Accordion } from '@/components/ui/Accordion'
import { OfertaGaleria } from '@/components/oferta/OfertaGaleria'
import { ICON_MAP } from '@/constants/icons'
import { MODALIDADE_CONFIG } from '@/constants/modalidade'
import { resolveOfertaCta } from '@/utils/oferta'
import { SITE_METADATA } from '@/constants/content'
import type { Oferta } from '@/types'

interface OfertaDetalheProps {
  oferta: Oferta
  outras: Oferta[]
}

export function OfertaDetalhe({ oferta, outras }: OfertaDetalheProps) {
  const Icon = ICON_MAP[oferta.icone]
  const { label: modalidadeLabel, Icon: ModalidadeIcon } = MODALIDADE_CONFIG[oferta.modalidade]
  const { href: ctaHref, label: ctaLabel } = resolveOfertaCta(oferta)
  const variant: 'light' | 'dark' = oferta.tipo === 'servico' ? 'light' : 'dark'
  const url = `${SITE_METADATA.url}/${oferta.tipo === 'servico' ? 'servicos' : 'produtos'}/${oferta.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': oferta.tipo === 'servico' ? 'Service' : 'Course',
    name: oferta.titulo,
    description: oferta.seoDescricao || oferta.descricaoCurta,
    url,
    provider: {
      '@type': 'Person',
      name: 'Letícia Demétrio',
      jobTitle: 'Consultora de Imagem e Estilo Pessoal',
    },
    ...(oferta.modalidade !== 'presencial' && { availableChannel: { '@type': 'ServiceChannel', serviceUrl: url } }),
    ...(oferta.modalidade !== 'online' && { areaServed: { '@type': 'Country', name: 'Brazil' } }),
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-surface">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-5">
              <ModalidadeIcon size={14} className="text-primary" aria-hidden="true" />
              <span className="text-xs font-medium font-body tracking-wide text-primary uppercase">
                {modalidadeLabel}
              </span>
            </div>

            <div className="flex items-start gap-5">
              {Icon && (
                <div className="w-14 h-14 shrink-0 rounded-2xl gradient-bg flex items-center justify-center" aria-hidden="true">
                  <Icon size={26} className="text-white" />
                </div>
              )}
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-4">
                  {oferta.titulo}
                </h1>
                <p className="text-subtle text-base sm:text-lg leading-relaxed font-body max-w-2xl">
                  {oferta.descricaoCurta}
                </p>
                {oferta.investimentoNota && (
                  <p className="text-primary text-sm font-semibold font-body mt-4">{oferta.investimentoNota}</p>
                )}
                <div className="mt-8">
                  <Button href={ctaHref} size="lg">
                    {ctaLabel}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sobre ────────────────────────────────────────────── */}
        {oferta.sobre.length > 0 && (
          <section className="py-16 lg:py-24" aria-labelledby="sobre-oferta-titulo">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <SectionTitle
                  eyebrow={oferta.tipo === 'servico' ? 'Sobre o serviço' : 'Sobre o curso'}
                  title={`Conheça ${oferta.tipo === 'servico' ? 'o serviço' : 'mais sobre'}`}
                  id="sobre-oferta-titulo"
                  className="mb-8"
                />
                <div className="flex flex-col gap-4">
                  {oferta.sobre.map((paragrafo, i) => (
                    <p key={i} className="text-subtle leading-relaxed font-body">
                      {paragrafo}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Como funciona ────────────────────────────────────── */}
        {oferta.comoFunciona.length > 0 && (
          <section className="py-16 lg:py-24" aria-labelledby="como-funciona-titulo">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <SectionTitle title="Como funciona" id="como-funciona-titulo" className="mb-10" />
                <ol className="flex flex-col gap-8">
                  {oferta.comoFunciona.map((passo, i) => (
                    <li key={passo.titulo} className="flex gap-5">
                      <span className="shrink-0 w-9 h-9 rounded-full bg-primary text-white font-heading font-bold text-sm flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-dark mb-1.5">{passo.titulo}</h3>
                        <p className="text-subtle text-sm leading-relaxed font-body">{passo.descricao}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* ── Galeria ──────────────────────────────────────────── */}
        {oferta.galeria.length > 0 && (
          <section className="py-16 lg:py-24 bg-surface" aria-labelledby="galeria-titulo">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionTitle
                eyebrow="Resultados"
                title="Atendimentos já realizados"
                id="galeria-titulo"
                className="mb-10"
              />
              <OfertaGaleria imagens={oferta.galeria} titulo={oferta.titulo} />
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────────────── */}
        {oferta.faq.length > 0 && (
          <section className="py-16 lg:py-24" aria-labelledby="faq-titulo">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <SectionTitle title="Perguntas frequentes" id="faq-titulo" className="mb-6" />
                <Accordion items={oferta.faq.map((f) => ({ question: f.pergunta, answer: f.resposta }))} />
              </div>
            </div>
          </section>
        )}

        <About />

        <Testimonials />

        {/* ── Outras ofertas ───────────────────────────────────── */}
        {outras.length > 0 && (
          <section className="py-16 lg:py-24 bg-surface" aria-labelledby="outras-ofertas-titulo">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionTitle
                eyebrow="Continue explorando"
                title={oferta.tipo === 'servico' ? 'Outros serviços' : 'Outros produtos e cursos'}
                center
                id="outras-ofertas-titulo"
                className="mb-12"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {outras.map((item) => (
                  <OfertaCard key={item.id} oferta={item} variant={variant} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA final ────────────────────────────────────────── */}
        <section className="py-16 lg:py-20 bg-dark text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
                Pronta para dar o próximo passo?
              </h2>
              <p className="text-white/60 font-body mb-8">
                Fale comigo e vamos conversar sobre como {oferta.titulo.toLowerCase()} pode transformar sua imagem.
              </p>
              <Button href={ctaHref} size="lg">
                {ctaLabel}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat message={`Olá! Tenho interesse em "${oferta.titulo}". Poderia me dar mais informações?`} />
    </div>
  )
}
