import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Star } from 'lucide-react'
import { EventHeader } from '@/components/evento/EventHeader'
import { WhatsAppFloat } from '@/components/sections/WhatsAppFloat'
import { MatriculasCta } from '@/components/evento/MatriculasCta'
import { getSettings } from '@/lib/settings'

const SUPORTE_MSG = 'Olá Letícia! Tenho dúvidas sobre o Método CIE.'

function getEmbedUrl(url: string): string {
  if (!url) return ''
  if (url.includes('youtube.com/embed/') || url.includes('player.vimeo')) return url
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`
  const shortMatch = url.match(/youtu\.be\/([^?]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0`
  return url
}


const CIE_PILLARS = [
  {
    letter: 'C',
    title: 'Conhecer',
    desc: 'Você distingue imagem percebida de imagem pretendida e entende o que realmente quer comunicar.',
  },
  {
    letter: 'I',
    title: 'Identificar',
    desc: 'Você identifica preferências reais de modelagem, tecido, cor e estampa, além do estilo base e cereja do bolo.',
  },
  {
    letter: 'E',
    title: 'Expressar',
    desc: 'Você aprende a usar cores, elementos de design e o método IHT: Intenção, Humor e Tempo.',
  },
]

const BONUSES = [
  {
    num: '01',
    title: 'Beleza Ágil',
    desc: 'Curso completo de automaquiagem para compor sua imagem de forma prática e rápida.',
    highlight: false,
  },
  {
    num: '02',
    title: 'Desafio 30D',
    desc: '30 dias de aplicação guiada, checklist diário, suporte na comunidade e incentivo para documentar sua transformação.',
    highlight: false,
  },
  {
    num: '03',
    title: 'Grupo exclusivo no Telegram!',
    desc: 'Para receber os avisos, links das aulas e não correr o risco de perder nenhuma novidade, se sentir acompanhada durante toda a jornada, sem se sentir sozinha nesse processo.',
    highlight: false,
  },
  {
    num: '04',
    title: 'Mentoria Individual 1h comigo',
    desc: 'Para as 10 primeiras inscritas, uma sessão ao vivo para revisar sua jornada, tirar dúvidas específicas do seu guarda-roupa e acelerar seus resultados.',
    highlight: true,
  },
]

const BIO_PARAGRAPHS = [
  'Sou consultora de imagem e criadora do Método C.I.E. E durante muito tempo, eu também achei que não tinha estilo. Eu me vestia, mas não me reconhecia. Copiava referências, seguia tendências e ainda assim sentia que algo não encaixava.',
  'Tudo começou a mudar quando eu entendi que estilo não é sobre moda. É sobre clareza, identidade e intenção.',
  'Na semana Elegância na Prática, eu vou te mostrar como aplicar isso na vida real, de forma leve, prática e possível.',
  'Se hoje você sente que sua imagem não representa quem você é, essa aula é para você.',
]

const FAQS = [
  {
    q: 'Preciso comprar roupas novas para aplicar o método?',
    a: 'Não. O método começa com o que você já tem. Compras, se vierem, serão intencionais e cirúrgicas, não impulsivas.',
  },
  {
    q: 'Quanto tempo por dia preciso dedicar?',
    a: 'Você consegue avançar com 20 a 30 minutos por dia. O Desafio 30D foi desenhado para caber na vida real.',
  },
  {
    q: 'Funciona para qualquer tipo de corpo e estilo de vida?',
    a: 'Sim. O método parte do autoconhecimento e se adapta a você, não o contrário.',
  },
  {
    q: 'Tenho acesso por quanto tempo?',
    a: 'O acesso é por 1 ano, incluindo todas as atualizações futuras do método.',
  },
  {
    q: 'A mentoria individual é realmente ao vivo comigo?',
    a: 'Sim. É uma sessão de 1 hora, ao vivo, para revisar sua jornada e tirar dúvidas específicas.',
  },
  {
    q: 'Posso fazer o Método CIE mesmo sem entender de moda?',
    a: 'Sim. O Método CIE foi criado justamente para mulheres que se sentem perdidas na hora de se vestir.',
  },
]

export default async function MatriculasAbertasPage() {
  const settings = await getSettings()
  if (!settings.matriculas_ativo) redirect('/')

  const embedUrl = getEmbedUrl(settings.matriculas_video_url)
  const ctaUrl = settings.matriculas_cta_url || '#'

  return (
    <>
      <EventHeader />

      <main>

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="gradient-bg py-6 lg:py-20 text-center overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/15 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase font-body text-white/60 mb-3 lg:mb-5">
              Método C.I.E. — Letícia Demétrio
            </p>
            <h1 className="font-heading text-xl sm:text-3xl lg:text-5xl font-bold text-white leading-[1.15] mb-4 lg:mb-8">
              Aprenda a se vestir de forma{' '}
              <span className="italic text-white/80">elegante e prática</span>{' '}
              para qualquer ocasião em até 30 dias.
            </h1>

            {embedUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15 mb-5 lg:mb-10">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Vídeo de abertura — Método CIE"
                />
              </div>
            )}

            <MatriculasCta variant="light" ctaUrl={ctaUrl} />
          </div>
        </section>

        {/* ── Problem bridge ─────────────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24 border-b border-neutral">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="font-heading text-2xl sm:text-3xl font-bold text-dark leading-snug mb-10">
              Você não precisa comprar mais nada. Precisa de um método para finalmente usar o que já tem,{' '}
              <span className="text-primary">com elegância, intenção</span> e sem perder tempo toda manhã.
            </p>
            <MatriculasCta variant="dark" ctaUrl={ctaUrl} />
          </div>
        </section>

        {/* ── Método CIE ─────────────────────────────────────────────── */}
        <section className="bg-dark py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Conheça o método
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2 mb-6">
                Entenda o Método CIE!
              </h2>
              <p className="text-white/60 font-body text-base leading-relaxed max-w-2xl mx-auto">
                Antes de falar em peças, combinações ou cores, o método parte de uma pergunta que quase ninguém faz: quem é você esteticamente? Não quem você acha que deveria ser. Não o estilo da influenciadora que você acompanha. Você — com sua rotina, seu corpo, suas preferências reais e a vida que você de fato vive.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
              {CIE_PILLARS.map((item) => (
                <div
                  key={item.letter}
                  className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col gap-4 hover:bg-white/8 transition-colors"
                >
                  <div className="gradient-bg w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <span className="font-heading font-bold text-xl text-white">{item.letter}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg mb-2">{item.title}</h3>
                    <p className="text-white/55 font-body text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-white/40 font-body text-sm text-center italic mb-12">
              De forma simples, prática e possível para a sua realidade.
            </p>

            <div className="text-center">
              <MatriculasCta variant="light" ctaUrl={ctaUrl} />
            </div>
          </div>
        </section>

        {/* ── Bônus ──────────────────────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Incluído na sua compra
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2">
                Bônus Exclusivos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BONUSES.map((bonus) => (
                <div
                  key={bonus.num}
                  className={`rounded-2xl p-7 ${
                    bonus.highlight
                      ? 'bg-primary/5 border border-primary/25 border-l-4 border-l-primary'
                      : 'bg-surface border border-neutral'
                  }`}
                >
                  <p className="font-body text-xs font-bold text-primary tracking-[0.18em] uppercase mb-2">
                    Bônus {bonus.num}
                  </p>
                  <h3 className="font-heading font-bold text-dark text-lg mb-2">{bonus.title}</h3>
                  <p className="font-body text-subtle text-sm leading-relaxed">{bonus.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fechamento ─────────────────────────────────────────────── */}
        <section className="gradient-bg py-20 lg:py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/8 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
            <p className="font-heading text-3xl sm:text-4xl font-bold text-white leading-snug mb-2">
              Você não precisa de mais roupas.
            </p>
            <p className="font-heading text-3xl sm:text-4xl font-bold text-white/70 mb-12">
              Você precisa saber o que fazer com elas.
            </p>
            <MatriculasCta variant="light" ctaUrl={ctaUrl} />
          </div>
        </section>

        {/* ── Garantias ──────────────────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Sua segurança em primeiro lugar
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2">
                Risco ZERO pra você!
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-neutral bg-surface p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="gradient-bg rounded-xl p-2.5 shrink-0">
                    <Shield size={20} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-semibold font-body uppercase tracking-wider">
                      Garantia incondicional
                    </p>
                    <p className="font-heading font-bold text-dark text-base">15 dias</p>
                  </div>
                </div>
                <p className="font-body text-subtle text-sm leading-relaxed">
                  Acesse o método, assista às aulas e explore a comunidade. Se decidir que não é para você nos primeiros 15 dias, basta pedir o reembolso.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="gradient-bg rounded-xl p-2.5 shrink-0">
                    <Star size={20} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-semibold font-body uppercase tracking-wider">
                      Garantia condicional
                    </p>
                    <p className="font-heading font-bold text-dark text-base">90 dias</p>
                  </div>
                </div>
                <p className="font-body text-subtle text-sm leading-relaxed">
                  Se você completar os 30 dias, executar o Desafio 30D e ainda sentir que não conseguiu se vestir melhor, recebe mais 30 dias de suporte individual e mais 30 dias para aplicar as mudanças.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Bio ────────────────────────────────────────────────────── */}
        <section className="bg-dark py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
              <div className="shrink-0">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-xl">
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

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <section className="bg-white py-16 lg:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase font-body text-primary">
                Estou com dúvidas!
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dark mt-2">
                Perguntas Frequentes
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

            <div className="text-center mt-14">
              <MatriculasCta variant="dark" ctaUrl={ctaUrl} />
            </div>
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
