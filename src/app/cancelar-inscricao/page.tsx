import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe'
import { blocklistListmonkSubscriberByEmail } from '@/lib/listmonk'

export const metadata: Metadata = {
  title: 'Cancelar inscrição — Letícia Demétrio',
  robots: { index: false, follow: false },
}

type Status = 'ok' | 'invalido' | 'erro'

export default async function CancelarInscricaoPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>
}) {
  const { email, token } = await searchParams

  let status: Status = 'invalido'
  if (email && token && verifyUnsubscribeToken(email, token)) {
    try {
      await blocklistListmonkSubscriberByEmail(email)
      status = 'ok'
    } catch (err) {
      console.error('[cancelar-inscricao] Falha ao descadastrar:', err)
      status = 'erro'
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-neutral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/">
            <Image
              src="/images/logo/black_logo.png"
              alt="Letícia Demétrio"
              width={140}
              height={35}
              priority
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-20">
        <div className="max-w-md text-center">
          {status === 'ok' && (
            <>
              <h1 className="font-heading text-3xl font-bold text-dark mb-4">Inscrição cancelada</h1>
              <p className="text-subtle font-body">
                Você não vai mais receber e-mails da Letícia Demétrio. Se mudar de ideia, é só se
                inscrever de novo em qualquer página do site.
              </p>
            </>
          )}
          {status === 'invalido' && (
            <>
              <h1 className="font-heading text-3xl font-bold text-dark mb-4">Link inválido</h1>
              <p className="text-subtle font-body">
                Esse link de cancelamento não é válido. Se você quer parar de receber nossos e-mails,
                entre em contato pelo WhatsApp.
              </p>
            </>
          )}
          {status === 'erro' && (
            <>
              <h1 className="font-heading text-3xl font-bold text-dark mb-4">Algo deu errado</h1>
              <p className="text-subtle font-body">
                Não conseguimos processar seu cancelamento agora. Tente novamente em alguns minutos
                ou entre em contato pelo WhatsApp.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
