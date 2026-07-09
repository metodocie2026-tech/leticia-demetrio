import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Heart } from 'lucide-react'
import { InstagramIcon } from '@/components/ui/SocialIcons'
import { buildWhatsAppUrl } from '@/utils/whatsapp'
import { NAV_LINKS, INSTAGRAM_URL } from '@/constants/navigation'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white" aria-label="Rodapé">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Image
              src="/images/logo/white_logo.png"
              alt="Letícia Demétrio"
              width={220}
              height={56}
              priority
            />
            <p className="text-white/55 text-sm font-body leading-relaxed">
              Consultora de imagem e estilo pessoal. Transformando vidas através da
              autenticidade e da beleza.
            </p>
            <div className="flex gap-3 mt-1">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-primary transition-colors"
                aria-label="Instagram de Letícia Demétrio"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-[#25D366] transition-colors"
                aria-label="WhatsApp de Letícia Demétrio"
              >
                <MessageCircle size={17} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navegação do rodapé">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/35 font-body mb-4">
              Navegação
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/65 hover:text-primary transition-colors font-body"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/35 font-body mb-4">
              Contato
            </h3>
            <div className="flex flex-col gap-2 text-sm text-white/65 font-body">
              <p>Atendimentos presenciais e online</p>
              <p>Disponível para todo o Brasil</p>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-medium transition-colors"
              >
                Fale pelo WhatsApp →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35 font-body">
            © {year} Letícia Demétrio. Todos os direitos reservados. · CNPJ: 58.679.269/0001-26
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/politica-de-privacidade"
              className="text-xs text-white/35 hover:text-primary font-body transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-de-uso"
              className="text-xs text-white/35 hover:text-primary font-body transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
