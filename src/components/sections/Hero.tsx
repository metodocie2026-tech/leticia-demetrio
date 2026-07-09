import Image from 'next/image'
import { ArrowDown, MapPin, Globe } from 'lucide-react'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import { HERO_CONTENT } from '@/constants/content'


export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden bg-dark"
      aria-label="Apresentação de Letícia Demétrio"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/25" />
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-primary/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-secondary/12 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* ── Text column ─────────────────────────────────────── */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <span className="inline-block mb-6 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-white/55 font-body border border-white/12 rounded-full px-5 py-2 bg-white/5 backdrop-blur-sm">
            {HERO_CONTENT.eyebrow}
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            <span className="block">{HERO_CONTENT.headline[0]}</span>
            <span className="block text-primary-medium">{HERO_CONTENT.headline[1]}</span>
          </h1>

          <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-10 font-body mx-auto lg:mx-0">
            {HERO_CONTENT.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-body font-semibold rounded-full text-base px-8 py-4 bg-primary text-white hover:brightness-110 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {HERO_CONTENT.ctaPrimary}
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center gap-2 text-white/55 hover:text-white text-sm font-medium font-body transition-colors group"
            >
              {HERO_CONTENT.ctaSecondary}
              <ArrowDown
                size={16}
                className="group-hover:translate-y-1 transition-transform"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* ── Image column ────────────────────────────────────── */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative">

            {/* Main image frame */}
            <div className="relative w-[260px] sm:w-[320px] lg:w-[380px] aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/hero.png"
                alt="Letícia Demétrio realizando consultoria de imagem"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width:640px) 260px, (max-width:1024px) 320px, 380px"
              />
            </div>

            {/* Decorative offset border behind the card */}
            <div
              className="absolute -bottom-4 -left-4 w-full h-full rounded-3xl border border-primary/20 -z-10"
              aria-hidden="true"
            />

            {/* Floating card — atendimento */}
            <div
              className="absolute -left-8 top-10 bg-dark/85 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-xl hidden sm:block"
              aria-hidden="true"
            >
              <p className="text-white/60 text-xs font-semibold font-body mb-3 tracking-wide uppercase">
                Atendimento
              </p>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-white text-xs font-body">
                  <MapPin size={11} className="text-primary shrink-0" aria-hidden="true" />
                  Presencial · São José/SC
                </span>
                <span className="flex items-center gap-2 text-white text-xs font-body">
                  <Globe size={11} className="text-primary shrink-0" aria-hidden="true" />
                  Online · Todo o Brasil
                </span>
              </div>
            </div>

            {/* Floating card — social proof */}
            <div
              className="absolute -right-8 bottom-16 bg-dark/85 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 shadow-xl hidden sm:block"
              aria-hidden="true"
            >
              <p className="text-white font-heading text-xl font-bold leading-none">500+</p>
              <p className="text-white/50 text-xs font-body mt-1">clientes transformadas</p>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        aria-hidden="true"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        <ArrowDown size={13} className="animate-bounce" />
      </div>
    </section>
  )
}