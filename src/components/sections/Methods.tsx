import { SectionTitle } from '@/components/ui/SectionTitle'
import { Button } from '@/components/ui/Button'
import { OfertaCard } from '@/components/ui/OfertaCard'
import { getOfertas } from '@/lib/ofertas'
import { buildWhatsAppUrl } from '@/utils/whatsapp'

export async function Methods() {
  const ofertas = await getOfertas()
  const produtos = ofertas.filter((o) => o.tipo === 'produto_curso' && o.ativo)

  if (produtos.length === 0) return null

  return (
    <section
      id="metodos"
      className="py-20 lg:py-28 bg-dark"
      aria-labelledby="metodos-titulo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Cursos & Programas"
          title="Métodos e Formações"
          subtitle="Programas cuidadosamente desenvolvidos para diferentes objetivos e momentos da sua jornada."
          center
          light
          id="metodos-titulo"
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <OfertaCard key={produto.id} oferta={produto} variant="dark" />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/45 text-sm font-body mb-4">Não encontrou o que procurava?</p>
          <Button
            href={buildWhatsAppUrl()}
            variant="outline"
            className="border-white/30 text-white hover:bg-white hover:text-dark"
          >
            Converse comigo pelo WhatsApp
          </Button>
        </div>
      </div>
    </section>
  )
}
