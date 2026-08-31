import { SectionTitle } from '@/components/ui/SectionTitle'
import { OfertaCard } from '@/components/ui/OfertaCard'
import { getOfertas } from '@/lib/ofertas'

export async function Services() {
  const ofertas = await getOfertas()
  const servicos = ofertas.filter((o) => o.tipo === 'servico' && o.ativo)

  if (servicos.length === 0) return null

  return (
    <section
      id="servicos"
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="servicos-titulo"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="O que ofereço"
          title="Serviços Personalizados"
          subtitle="Cada serviço é pensado para ajudá-la a descobrir e expressar a melhor versão de si mesma."
          center
          id="servicos-titulo"
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((servico) => (
            <OfertaCard key={servico.id} oferta={servico} variant="light" />
          ))}
        </div>
      </div>
    </section>
  )
}
