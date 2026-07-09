import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ABOUT_CONTENT } from '@/constants/content'

export function About() {
  return (
    <section
      id="sobre"
      className="py-20 lg:py-28 bg-surface"
      aria-labelledby="sobre-titulo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Two-column: photo + text ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Photo placeholder */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <div
                className="absolute inset-4 rounded-3xl gradient-bg opacity-20 blur-sm"
                aria-hidden="true"
              />
              <Image
                src="/images/leticia.png"
                alt="Letícia Demétrio – Consultora de Imagem"
                fill
                className="object-cover rounded-3xl"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <SectionTitle
              eyebrow={ABOUT_CONTENT.eyebrow}
              title={ABOUT_CONTENT.headline}
              id="sobre-titulo"
            />

            <div className="flex flex-col gap-4">
              {ABOUT_CONTENT.paragraphs.map((p, i) => (
                <p key={i} className="text-subtle leading-relaxed font-body">
                  {p}
                </p>
              ))}
            </div>

            <ul className="flex flex-col gap-2.5 mt-1" aria-label="Certificações">
              {ABOUT_CONTENT.certifications.map((cert) => (
                <li
                  key={cert}
                  className="flex items-center gap-3 text-subtle font-body text-sm"
                >
                  <CheckCircle size={17} className="text-primary shrink-0" aria-hidden="true" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Stats banner ─────────────────────────────────────── */}
        <div className="mt-16 bg-dark rounded-2xl px-6 py-10">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 lg:gap-x-0 lg:divide-x lg:divide-white/12">
            {ABOUT_CONTENT.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center lg:px-8"
              >
                <dt className="font-heading text-5xl sm:text-6xl font-bold text-primary leading-none">
                  {stat.value}
                </dt>
                <dd className="font-body text-sm text-white/55 mt-3 leading-tight">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-center text-white/30 text-xs font-body mt-10">
            Baseado em atendimentos reais com clientes em todo o Brasil.
          </p>
        </div>

      </div>
    </section>
  )
}
