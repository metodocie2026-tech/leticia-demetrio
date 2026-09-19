import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { EventHeader } from "@/components/evento/EventHeader";
import { WhatsAppFloat } from "@/components/sections/WhatsAppFloat";
import { MatriculasCta } from "@/components/evento/MatriculasCta";
import { getSettings } from "@/lib/settings";

const SUPORTE_MSG = "Olá Letícia! Tenho dúvidas sobre o Método CIE.";

function getEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/embed/") || url.includes("player.vimeo"))
    return url;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`;
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`;
  return url;
}

const CIE_PILLARS = [
  {
    letter: "C",
    title: "Conhecer",
    desc: "Aprofunde o olhar para sua personalidade, sua rotina e a imagem que deseja transmitir. Esses critérios orientam o que faz sentido para o seu vestir.",
  },
  {
    letter: "I",
    title: "Identificar",
    desc: "Reconheça o que te atrai nas cores, nas peças e nos detalhes. Aprenda a avaliar quais referências representam você e como elas se relacionam com a sua realidade.",
  },
  {
    letter: "E",
    title: "Expressar",
    desc: "Leve esse conhecimento para os seus looks. Aprenda sobre combinações, proporções, acessórios e acabamentos para adaptar suas escolhas à ocasião e à sua intenção.",
  },
];

const VIDA_REAL_ITEMS = [
  "Uma combinação para trabalhar com presença e personalidade.",
  "Um jeito de usar as peças que você gosta, mas deixa paradas.",
  "Um look confortável que também expresse sua intenção.",
  "Uma cor ou um acessório que traga personalidade sem fazer você se sentir fantasiada.",
  "Uma forma de se vestir que acompanhe seu corpo e sua fase de vida atual.",
];

const ARMARIO_GRID = [
  {
    title: "Cores com intenção",
    desc: "Entenda combinações de cores, o que elas comunicam e como usar esse conhecimento no seu dia a dia.",
  },
  {
    title: "Possibilidades nas suas peças",
    desc: "Aprenda a pensar em diferentes propostas para uma mesma peça, considerando o que acompanha cada combinação.",
  },
  {
    title: "Detalhes que expressam você",
    desc: "Observe como acessórios, estrutura e acabamentos participam da imagem que você deseja construir.",
  },
  {
    title: "Escolhas para cada ocasião",
    desc: "Considere conforto, ambiente e intenção para adaptar sua forma de se vestir sem perder sua identidade.",
  },
];

const BONUSES = [
  {
    num: "01",
    title: "LetícIA",
    desc: "Sua consultora virtual baseada no Método C.I.E., para apoiar dúvidas sobre o seu vestir enquanto você aplica o conteúdo.",
    small: "Ferramenta de apoio. Não equivale a uma consultoria individual com Letícia.",
  },
  {
    num: "02",
    title: "Beleza Ágil",
    desc: "Automaquiagem prática para quem quer complementar o cuidado com a imagem, com orientações de aplicação e dicas de produtos e pincéis.",
    small: "",
  },
];

const BIO_PARAGRAPHS = [
  "Sou consultora de imagem e criadora do Método C.I.E. Ao longo dos meus atendimentos, percebi uma dificuldade que se repetia: mulheres com roupas, referências e preferências que ainda não conseguiam traduzir sua personalidade nos looks.",
  "Foi organizando o caminho de conhecer cada mulher, identificar o que a representa e expressar isso nas escolhas que nasceu o Método C.I.E.",
  "Agora, quero ajudar você a aprofundar esse aprendizado e desenvolver mais segurança para construir uma imagem que faça sentido na sua vida.",
];

const OFFER_INCLUDES = [
  "Método C.I.E. com aulas teóricas e práticas.",
  "1 ano de acesso ao método.",
  "LetícIA e Beleza Ágil.",
  "Coloração Express com conversa individual para as dez primeiras inscrições confirmadas.",
];

const FAQS = [
  {
    q: "O que muda em relação às três aulas gratuitas?",
    a: "O Mapa do Estilo Próprio apresentou o caminho e exemplos para você começar. O Método C.I.E. aprofunda esse aprendizado em aulas teóricas e práticas, com conteúdos sobre sua imagem e suas combinações, além dos bônus descritos nesta oferta.",
  },
  {
    q: "Preciso comprar roupas novas?",
    a: "Você pode começar com o que já tem. O aprendizado ajuda a reconhecer possibilidades nas suas peças e a desenvolver critérios para avaliar compras futuras.",
  },
  {
    q: "Gosto de vários estilos. O método é para mim?",
    a: "Sim. A proposta considera os elementos que representam você, sua rotina e sua intenção. Você pode gostar de referências diferentes e aprender a avaliar o que faz sentido trazer para o seu vestir.",
  },
  {
    q: "Consigo considerar conforto e minha rotina de trabalho?",
    a: "Conforto, ambiente e intenção entram nos critérios das suas escolhas. O método parte da sua realidade para ajudar você a pensar nas combinações.",
  },
  {
    q: "Meu corpo ou minha fase de vida mudou. Posso começar?",
    a: "O ponto de partida é quem você é hoje. Você vai olhar para suas preferências e sua rotina atual para reconhecer o que faz sentido nessa fase.",
  },
  {
    q: "Quando recebo acesso e por quanto tempo?",
    a: "O acesso às aulas é liberado após a confirmação do pagamento e permanece disponível por um ano. O atendimento da coloração Express e da conversa individual, para as dez primeiras, depende de agendamento.",
  },
  {
    q: "A LetícIA é uma consultoria individual com Letícia?",
    a: "Não. É uma ferramenta virtual baseada no Método C.I.E. para apoiar dúvidas sobre o vestir. A conversa individual é um benefício separado, vinculado à coloração Express das dez primeiras inscrições confirmadas.",
  },
  {
    q: "Preciso entender de moda para começar?",
    a: "O método começa pelo autoconhecimento e aprofunda as escolhas de imagem. Você não precisa ter seu estilo definido para iniciar esse processo.",
  },
  {
    q: "E se eu decidir que o curso não é para mim?",
    a: "Você pode solicitar reembolso dentro do prazo de 15 dias de garantia.",
  },
];

export default async function MatriculasAbertasPage() {
  const settings = await getSettings();
  if (!settings.matriculas_ativo) redirect("/");

  const embedUrl = getEmbedUrl(settings.matriculas_video_url);
  const ctaUrl = settings.matriculas_cta_url || "#";

  return (
    <>
      <EventHeader />

      <main>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative bg-dark py-5 sm:py-10 lg:py-20 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30" />
            <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[110px]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase font-body text-white/60 mb-2 sm:mb-4 lg:mb-5">
              Seu próximo passo depois do Mapa do Estilo Próprio
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-[1.2] mb-3 sm:mb-4 lg:mb-6">
              Transforme o que você descobriu sobre seu estilo em looks que
              representem você.
            </h1>
            <p className="hidden sm:block font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-5 lg:mb-8">
              Aprenda a fazer escolhas com a sua personalidade, mais segurança
              e presença. No Método C.I.E., você aprofunda o caminho de
              Conhecer, Identificar e Expressar para levar esse aprendizado à
              sua vida real.
            </p>

            {embedUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15 mb-4 sm:mb-6 lg:mb-10">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Vídeo de apresentação do Método C.I.E."
                />
              </div>
            )}

            <MatriculasCta
              variant="hero"
              ctaUrl={ctaUrl}
              label="Quero entrar no Método C.I.E."
            />
          </div>
        </section>

        {/* ── O caminho continua aqui ──────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24 border-b border-neutral">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
              O caminho continua aqui
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2 mb-8">
              Você entendeu o mapa. Agora, aprenda a percorrê-lo.
            </h2>
            <div className="flex flex-col gap-4">
              <p className="font-body text-subtle text-sm sm:text-base leading-relaxed">
                Nas três aulas, você viu que seu estilo começa em quem você é,
                na sua rotina e no que deseja comunicar. Também conheceu os
                três pilares que organizam esse caminho.
              </p>
              <p className="font-body text-subtle text-sm sm:text-base leading-relaxed">
                Mas pode ser que, diante do armário, ainda apareça a pergunta:
                &ldquo;Tá&hellip; e como eu transformo tudo isso em uma
                combinação?&rdquo;
              </p>
              <p className="font-body text-subtle text-sm sm:text-base leading-relaxed">
                O Método C.I.E. aprofunda esse aprendizado com aulas teóricas
                e práticas para você desenvolver critérios, reconhecer
                possibilidades nas suas peças e construir looks que façam
                sentido para você.
              </p>
            </div>
          </div>
        </section>

        {/* ── Para a sua vida real ─────────────────────────────────────── */}
        <section className="bg-surface py-16 lg:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Para a sua vida real
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2">
                O que você gostaria de escolher com mais segurança?
              </h2>
            </div>
            <ul className="flex flex-col gap-4 mb-10">
              {VIDA_REAL_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary-light flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-primary" aria-hidden="true" />
                  </span>
                  <span className="font-body text-dark text-sm sm:text-base leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-body text-subtle text-sm sm:text-base leading-relaxed text-center">
              É a partir dessas situações que o aprendizado ganha sentido.
              Você começa a olhar para as escolhas considerando a mulher que é
              e a vida que leva.
            </p>
          </div>
        </section>

        {/* ── Método CIE ─────────────────────────────────────────────── */}
        <section className="bg-dark py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Dentro do Método C.I.E.
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2">
                Aprenda a entender suas escolhas e a construir suas
                combinações.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {CIE_PILLARS.map((item) => (
                <div
                  key={item.letter}
                  className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col gap-4 hover:bg-white/8 transition-colors"
                >
                  <div className="gradient-bg w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <span className="font-heading font-bold text-xl text-white">
                      {item.letter}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/55 font-body text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Da aula para o seu armário ────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Da aula para o seu armário
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2">
                Mais entendimento sobre o que vestir e por quê.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              {ARMARIO_GRID.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral bg-surface p-7"
                >
                  <h3 className="font-heading font-bold text-dark text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-subtle text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <MatriculasCta
                variant="dark"
                ctaUrl={ctaUrl}
                label="Quero aprender a aplicar no meu vestir"
              />
            </div>
          </div>
        </section>

        {/* ── Band quote ─────────────────────────────────────────────── */}
        <section className="bg-secondary-dark py-10 lg:py-14">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Que a sua imagem acompanhe a mulher que você é.
            </h2>
          </div>
        </section>

        {/* ── Bônus ──────────────────────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Bônus desta turma
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2">
                Recursos para complementar seu aprendizado.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BONUSES.map((bonus) => (
                <div
                  key={bonus.num}
                  className="rounded-2xl border border-neutral bg-surface p-7"
                >
                  <p className="font-body text-xs font-bold text-primary tracking-[0.18em] uppercase mb-2">
                    Bônus {bonus.num}
                  </p>
                  <h3 className="font-heading font-bold text-dark text-lg mb-2">
                    {bonus.title}
                  </h3>
                  <p className="font-body text-subtle text-sm leading-relaxed">
                    {bonus.desc}
                  </p>
                  {bonus.small && (
                    <p className="font-body text-muted text-xs leading-relaxed mt-3">
                      {bonus.small}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-7 mt-5 bg-primary/5 border border-primary/25 border-l-4 border-l-primary">
              <p className="font-body text-xs font-bold text-primary tracking-[0.18em] uppercase mb-2">
                Para as 10 primeiras inscrições confirmadas
              </p>
              <h3 className="font-heading font-bold text-dark text-lg mb-2">
                Coloração pessoal Express com conversa individual
              </h3>
              <p className="font-body text-subtle text-sm leading-relaxed">
                As dez primeiras inscritas recebem esse atendimento adicional
                com Letícia, além dos bônus da turma.
              </p>
              <p className="font-body text-muted text-xs leading-relaxed mt-3">
                Benefício limitado às dez primeiras inscrições confirmadas.
                Atendimento mediante agendamento.
              </p>
            </div>
          </div>
        </section>

        {/* ── Bio ────────────────────────────────────────────────────── */}
        <section className="bg-dark py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
              <div className="shrink-0">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-xl">
                  <Image
                    src="/images/leticia_new_profile.png"
                    alt="Letícia Demétrio"
                    width={224}
                    height={224}
                    className="object-cover object-center w-full h-full"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary font-body">
                  Quem vai te guiar
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2 mb-5">
                  Prazer, eu sou Letícia Demétrio.
                </h2>
                <div className="flex flex-col gap-4">
                  {BIO_PARAGRAPHS.map((p, i) => (
                    <p
                      key={i}
                      className="text-white/65 font-body leading-relaxed text-sm sm:text-base"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <p className="font-heading italic text-xl text-white mt-6">
                  Letícia Demétrio
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Matrícula / Oferta ────────────────────────────────────────── */}
        <section id="matricula" className="bg-surface py-16 lg:py-24">
          <div className="max-w-lg mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Sua matrícula no Método C.I.E.
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2">
                Comece a levar seu estilo para as suas escolhas.
              </h2>
            </div>

            <div className="rounded-2xl border border-neutral bg-white p-8 sm:p-10 shadow-xl">
              <p className="font-body text-dark font-semibold text-sm mb-4">
                Seu acesso inclui:
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {OFFER_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary-light flex items-center justify-center mt-0.5">
                      <Check size={12} className="text-primary" aria-hidden="true" />
                    </span>
                    <span className="font-body text-subtle text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="text-center border-t border-neutral pt-6">
                <p className="font-heading text-3xl sm:text-4xl font-bold text-dark">
                  12× de R$ 72,09
                </p>
                <p className="font-body text-subtle text-base mt-1">
                  Ou à vista: R$ 697,00.
                </p>

                <div className="mt-6">
                  <MatriculasCta
                    variant="hero"
                    ctaUrl={ctaUrl}
                    label="Quero garantir minha matrícula"
                  />
                </div>

                <p className="font-body text-muted text-xs leading-relaxed mt-4">
                  Acesso às aulas após a confirmação do pagamento. 15 dias de
                  garantia para conhecer o método.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Garantia ───────────────────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24 border-t border-neutral">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
              Conheça o conteúdo com tranquilidade
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2 mb-6">
              Você tem 15 dias de garantia.
            </h2>
            <p className="font-body text-subtle text-sm sm:text-base leading-relaxed">
              Acesse as aulas e conheça o Método C.I.E. Se decidir que ele não
              é para você nos primeiros 15 dias, solicite o reembolso.
            </p>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <section className="bg-surface py-16 lg:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Antes de entrar
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2">
                Suas dúvidas, respondidas.
              </h2>
            </div>

            <div className="flex flex-col divide-y divide-neutral">
              {FAQS.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-heading font-semibold text-dark text-base leading-snug">
                    {item.q}
                    <span
                      className="shrink-0 w-7 h-7 rounded-full border border-primary/30 flex items-center justify-center text-primary group-open:bg-primary group-open:text-white group-open:border-primary transition-colors text-xl leading-none select-none"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 font-body text-subtle text-sm leading-relaxed pr-10">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fechamento ─────────────────────────────────────────────── */}
        <section className="gradient-bg py-20 lg:py-28 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/8 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <span className="text-xs font-semibold tracking-[0.22em] uppercase font-body text-white/60 mb-4 block">
              Conhecer · Identificar · Expressar
            </span>
            <p className="font-heading text-2xl sm:text-4xl font-bold text-white leading-snug mb-4">
              Na próxima vez que abrir o armário, comece a enxergar novas
              possibilidades.
            </p>
            <p className="font-body text-white/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-10">
              Aprofunde o que você descobriu sobre seu estilo e aprenda a
              transformar esse conhecimento em looks com a sua personalidade.
            </p>
            <MatriculasCta
              variant="light"
              ctaUrl={ctaUrl}
              label="Quero entrar no Método C.I.E."
            />
            <p className="font-body text-white/50 text-xs mt-6">
              1 ano de acesso · 15 dias de garantia
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
