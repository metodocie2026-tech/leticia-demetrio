import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, PlayCircle } from "lucide-react";
import { EventHeader } from "@/components/evento/EventHeader";
import { InscricaoForm } from "@/components/evento/InscricaoForm";
import { WhatsAppFloat } from "@/components/sections/WhatsAppFloat";
import { EVENTO } from "@/constants/evento";
import { getSettings } from "@/lib/settings";

const SUPORTE_MSG = "Preciso de ajuda sobre a Semana da Elegância na Prática!";

const { apresentacao: A } = EVENTO;

function CtaButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <a
      href="#inscricao"
      className={`inline-flex items-center justify-center text-center font-body font-semibold rounded-full text-base px-8 py-4 bg-primary text-white hover:brightness-110 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      {label}
    </a>
  );
}

function CtaButtonLight({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <a
      href="#inscricao"
      className={`inline-flex items-center justify-center text-center font-body font-semibold rounded-full text-base px-8 py-4 bg-white text-primary hover:bg-primary-light transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      {label}
    </a>
  );
}

export default async function SemanaPage() {
  const settings = await getSettings();
  if (!settings.evento_semana_ativo) redirect("/");
  return (
    <>
      <EventHeader />

      <main className="bg-white">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          id="inscricao"
          className="relative bg-dark overflow-hidden py-4 lg:py-20"
          aria-label="Apresentação do evento"
        >
          {/* Glows */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30" />
            <div className="absolute -top-20 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[160px]" />
            <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[130px]" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-3 lg:gap-14 items-center">
            {/* ── Left: copy ───────────────────────────────── */}
            <div className="text-center lg:text-left">
              <span className="inline-block mb-2 text-[11px] sm:text-sm font-semibold tracking-wide sm:tracking-[0.2em] uppercase font-body border border-primary/50 rounded-full px-4 sm:px-5 py-2 bg-primary/15 text-primary-medium lg:whitespace-nowrap">
                {A.hero.badge}
              </span>

              <h1 className="font-heading text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-2">
                Aprenda a se vestir de forma{" "}
                <span className="text-primary">elegante e prática</span> para
                qualquer ocasião em até 30 dias.
              </h1>

              {/* Subtitle — hidden on mobile to keep form close to the fold */}
              <p className="hidden lg:block text-white/65 text-base leading-relaxed mb-6 font-body">
                {A.hero.subtitulo}
              </p>

              <p className="hidden sm:block text-white/30 text-xs font-body tracking-wide sm:mb-6 lg:mb-0">
                {EVENTO.data} · {EVENTO.horario}
              </p>
            </div>

            {/* ── Right: form card ──────────────────────── */}
            <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 w-full">
              <div className="mb-3 sm:mb-6 text-center">
                <h2 className="font-heading text-lg sm:text-2xl font-bold text-dark">
                  Garanta sua vaga gratuita
                </h2>
                <p className="hidden sm:block text-subtle text-sm font-body mt-1 leading-relaxed">
                  {EVENTO.inscricao.subtitulo}
                </p>
              </div>

              <InscricaoForm />
            </div>
          </div>
        </section>

        {/* ── Para quem é ──────────────────────────────────────────────── */}
        <section
          className="py-16 lg:py-24 bg-dark"
          aria-labelledby="para-quem-titulo"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2
              id="para-quem-titulo"
              className="font-heading text-2xl sm:text-3xl font-bold text-white mb-10 text-center"
            >
              {A.paraQuem.titulo}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {A.paraQuem.itens.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 bg-white/5 rounded-xl px-5 py-4 border border-white/10 border-l-4 border-l-primary"
                >
                  <CheckCircle
                    size={17}
                    className="text-primary shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-white/75 font-body text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Problem bridge ────────────────────────────────────────────── */}
        <section
          className="py-16 lg:py-24 bg-primary relative overflow-hidden"
          aria-label="O problema real"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/30 rounded-full blur-[80px]" />
          </div>

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="font-body text-white/85 text-lg leading-relaxed mb-6">
              {A.problema.texto}
            </p>
            <p className="font-heading text-2xl sm:text-3xl font-bold text-white mb-5">
              {A.problema.conclusao}
            </p>
            <span className="inline-block font-body font-semibold text-white bg-white/15 border border-white/30 rounded-full px-6 py-2.5 text-base">
              {A.problema.destaque}
            </span>
            <div className="mt-10">
              <CtaButtonLight label="Sim, eu quero participar!" />
            </div>
          </div>
        </section>

        {/* ── Agenda ───────────────────────────────────────────────────── */}
        <section
          className="py-16 lg:py-24 bg-white"
          aria-labelledby="agenda-titulo"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary font-body">
                Programação
              </span>
              <h2
                id="agenda-titulo"
                className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2"
              >
                {A.agenda.titulo}
              </h2>
              <p className="text-subtle font-body text-sm mt-3 max-w-xl mx-auto leading-relaxed">
                {A.agenda.subtitulo}
              </p>
            </div>

            <ol className="flex flex-col gap-4">
              {A.agenda.aulas.map((aula) => (
                <li
                  key={aula.numero}
                  className="flex gap-5 rounded-2xl p-6 bg-surface border border-neutral border-l-4 border-l-primary shadow-sm"
                >
                  <div className="shrink-0">
                    <div className="gradient-bg rounded-xl px-3 py-2 text-center min-w-[64px]">
                      <p className="font-heading font-bold text-sm leading-none text-white whitespace-nowrap">
                        {aula.numero}
                      </p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-dark text-base leading-tight">
                      {aula.titulo}
                    </h3>
                    <p className="text-subtle text-sm font-body leading-relaxed mt-1.5">
                      {aula.descricao}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted font-body mt-3">
                      <PlayCircle
                        size={12}
                        className="text-primary shrink-0"
                        aria-hidden="true"
                      />
                      {aula.plataforma}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── O que você vai ter acesso ────────────────────────────────── */}
        <section
          className="py-16 lg:py-24 bg-dark"
          aria-labelledby="acesso-titulo"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary font-body">
                O que você vai levar
              </span>
              <h2
                id="acesso-titulo"
                className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2"
              >
                {A.acesso.titulo}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {A.acesso.itens.map((item) => (
                <div
                  key={item.titulo}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 flex gap-4 items-start hover:bg-white/8 transition-colors"
                >
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">
                      {item.titulo}
                    </h3>
                    <p className="text-white/55 text-sm font-body mt-1 leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center border-t border-white/10 pt-14">
              <p className="font-heading text-3xl sm:text-4xl font-bold text-white/80 leading-tight">
                {A.acesso.fechamento.linha1}
              </p>
              <p className="font-heading text-3xl sm:text-4xl font-bold text-primary mt-2">
                {A.acesso.fechamento.linha2}
              </p>
              <div className="mt-10">
                <CtaButton label="Quero aprender agora, é gratuito!" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Sobre Letícia ────────────────────────────────────────────── */}
        <section
          className="py-16 lg:py-24 bg-white"
          aria-labelledby="sobre-titulo"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
              <div className="shrink-0">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-xl">
                  <Image
                    src="/images/leticia.png"
                    alt="Letícia Demétrio"
                    width={176}
                    height={176}
                    className="object-cover object-top w-full h-full"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary font-body">
                  Quem vai te guiar
                </span>
                <h2
                  id="sobre-titulo"
                  className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2 mb-5"
                >
                  {A.sobre.titulo}
                </h2>
                <div className="flex flex-col gap-4">
                  {A.sobre.paragrafos.map((p, i) => (
                    <p
                      key={i}
                      className="text-subtle font-body leading-relaxed text-sm sm:text-base"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA final ────────────────────────────────────────────────── */}
        <section
          className="relative gradient-bg py-20 lg:py-28 overflow-hidden"
          aria-label="Inscrição no evento"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">
              {A.ctaFinal.titulo}
            </h2>
            <p className="text-white/75 font-body mb-10">
              {A.ctaFinal.subtitulo}
            </p>
            <CtaButtonLight label={A.ctaFinal.cta} />
            <p className="text-white/40 text-xs font-body mt-6">
              {EVENTO.data} · {EVENTO.horario}
            </p>
          </div>
        </section>
      </main>

      <WhatsAppFloat message={SUPORTE_MSG} />

      <footer className="bg-dark border-t border-white/8 py-6 px-4">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 font-body text-center sm:text-left">
            © {new Date().getFullYear()} Letícia Demétrio · CNPJ:
            58.679.269/0001-26
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
  );
}
