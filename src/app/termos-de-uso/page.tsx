import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BackButton } from '@/components/ui/BackButton'

export const metadata: Metadata = {
  title: 'Termos de Uso — Letícia Demétrio',
  description: 'Termos de uso e condições de serviço do site Letícia Demétrio.',
  robots: { index: true, follow: true },
}

const sections = [
  {
    number: '1.',
    title: 'Termos',
    content: `Ao acessar ao site Leticia Demétrio, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.`,
  },
  {
    number: '2.',
    title: 'Uso de Licença',
    content: `É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Leticia Demétrio, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode: modificar ou copiar os materiais; usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial); tentar descomplicar ou fazer engenharia reversa de qualquer software contido no site Leticia Demétrio; remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou transferir os materiais para outra pessoa ou "espelhe" os materiais em qualquer outro servidor. Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Leticia Demétrio a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrônico ou impresso.`,
  },
  {
    number: '3.',
    title: 'Isenção de responsabilidade',
    bullets: [
      `Os materiais no site da Leticia Demétrio são fornecidos "como estão". Leticia Demétrio não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.`,
      `Além disso, o Leticia Demétrio não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.`,
    ],
  },
  {
    number: '4.',
    title: 'Limitações',
    content: `Em nenhum caso o Leticia Demétrio ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Leticia Demétrio, mesmo que Leticia Demétrio ou um representante autorizado da Leticia Demétrio tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais, essas limitações podem não se aplicar a você.`,
  },
  {
    number: '5.',
    title: 'Precisão dos materiais',
    content: `Os materiais exibidos no site da Leticia Demétrio podem incluir erros técnicos, tipográficos ou fotográficos. Leticia Demétrio não garante que qualquer material em seu site seja preciso, completo ou atual. Leticia Demétrio pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Leticia Demétrio não se compromete a atualizar os materiais.`,
  },
  {
    number: '6.',
    title: 'Links',
    content: `O Leticia Demétrio não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Leticia Demétrio do site. O uso de qualquer site vinculado é por conta e risco do usuário.`,
  },
  {
    number: '',
    title: 'Modificações',
    content: `O Leticia Demétrio pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.`,
  },
  {
    number: '',
    title: 'Lei aplicável',
    content: `Estes termos e condições são regidos e interpretados de acordo com as leis do Leticia Demétrio e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.`,
  },
]

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b border-neutral sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/images/logo/black_logo.png"
              alt="Letícia Demétrio"
              width={140}
              height={35}
              priority
            />
          </Link>
          <BackButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

        {/* Page title */}
        <div className="mb-12 pb-10 border-b border-neutral">
          <span className="inline-block text-xs font-body font-semibold tracking-[0.2em] uppercase text-primary bg-primary-light px-4 py-1.5 rounded-full mb-4">
            Legal
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark leading-tight">
            Termos de Uso
          </h1>
          <p className="mt-3 text-subtle font-body text-sm">
            CNPJ: 58.679.269/0001-26
          </p>
        </div>

        {/* Sections */}
        <div className="prose-legal">
          {sections.map((section) => (
            <section key={section.title}>
              <h2>
                {section.number && (
                  <span className="text-primary mr-2">{section.number}</span>
                )}
                {section.title}
              </h2>
              {section.content && <p>{section.content}</p>}
              {section.bullets && (
                <ul>
                  {section.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-14 pt-8 border-t border-neutral flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted font-body">
            CNPJ: 58.679.269/0001-26
          </p>
          <Link
            href="/politica-de-privacidade"
            className="text-xs font-body text-primary hover:text-accent transition-colors"
          >
            Ver Política de Privacidade →
          </Link>
        </div>

      </main>
    </div>
  )
}
