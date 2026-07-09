import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BackButton } from '@/components/ui/BackButton'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Letícia Demétrio',
  description: 'Política de privacidade e proteção de dados do site Letícia Demétrio.',
  robots: { index: true, follow: true },
}

export default function PoliticaPrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p className="mt-3 text-subtle font-body text-sm">
            Efetiva a partir de 14 de setembro de 2026 · CNPJ: 58.679.269/0001-26
          </p>
        </div>

        {/* Body */}
        <div className="prose-legal">

          <p>
            A sua privacidade é importante para nós. É política do Letícia Demétrio respeitar a sua
            privacidade em relação a qualquer informação sua que possamos coletar no site Letícia
            Demétrio, e outros sites que possuímos e operamos.
          </p>

          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe
            fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e
            consentimento. Também informamos por que estamos coletando e como será usado.
          </p>

          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço
            solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente
            aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou
            modificação não autorizados.
          </p>

          <p>
            Não compartilhamos informações de identificação pessoal publicamente ou com terceiros,
            exceto quando exigido por lei.
          </p>

          <p>
            O nosso site pode ter links para sites externos que não são operados por nós. Esteja
            ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos
            aceitar responsabilidade por suas respectivas políticas de privacidade.
          </p>

          <p>
            Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que
            talvez não possamos fornecer alguns dos serviços desejados. O uso continuado de nosso
            site será considerado como aceitação de nossas práticas em torno de privacidade e
            informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do
            usuário e informações pessoais, entre em contato conosco.
          </p>

          <p>
            O serviço Google AdSense que usamos para veicular publicidade usa um cookie DoubleClick
            para veicular anúncios mais relevantes em toda a Web e limitar o número de vezes que um
            determinado anúncio é exibido para você. Para mais informações sobre o Google AdSense,
            consulte as FAQs oficiais sobre privacidade do Google AdSense.
          </p>

          <p>
            Utilizamos anúncios para compensar os custos de funcionamento deste site e fornecer
            financiamento para futuros desenvolvimentos. Os cookies de publicidade comportamental
            usados por este site foram projetados para garantir que você forneça os anúncios mais
            relevantes sempre que possível, rastreando anonimamente seus interesses e apresentando
            coisas semelhantes que possam ser do seu interesse.
          </p>

          <p>
            Vários parceiros anunciam em nosso nome e os cookies de rastreamento de afiliados
            simplesmente nos permitem ver se nossos clientes acessaram o site através de um dos
            sites de nossos parceiros, para que possamos creditá-los adequadamente e, quando
            aplicável, permitir que nossos parceiros afiliados ofereçam qualquer promoção que pode
            fornecê-lo para fazer uma compra.
          </p>

          <h2>Compromisso do Usuário</h2>

          <p>
            O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o
            Letícia Demétrio oferece no site e com caráter enunciativo, mas não limitativo:
          </p>

          <ul>
            <li>
              Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem
              pública;
            </li>
            <li>
              Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de sorte
              ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os
              direitos humanos;
            </li>
            <li>
              Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Letícia
              Demétrio, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus
              informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de
              causar danos anteriormente mencionados.
            </li>
          </ul>

          <h2>Mais informações</h2>

          <p>
            Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que
            você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies
            ativados, caso interaja com um dos recursos que você usa em nosso site.
          </p>

        </div>

        {/* Footer note */}
        <div className="mt-14 pt-8 border-t border-neutral flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted font-body">
            CNPJ: 58.679.269/0001-26
          </p>
          <Link
            href="/termos-de-uso"
            className="text-xs font-body text-primary hover:text-accent transition-colors"
          >
            Ver Termos de Uso →
          </Link>
        </div>

      </main>
    </div>
  )
}
