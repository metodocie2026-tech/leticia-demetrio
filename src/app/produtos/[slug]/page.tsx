import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getOfertas } from '@/lib/ofertas'
import { OfertaDetalhe } from '@/components/oferta/OfertaDetalhe'
import { SITE_METADATA } from '@/constants/content'

type Params = Promise<{ slug: string }>

async function findProduto(slug: string) {
  const ofertas = await getOfertas()
  const oferta = ofertas.find((o) => o.slug === slug)
  if (!oferta || oferta.tipo !== 'produto_curso' || !oferta.ativo) return null
  return {
    oferta,
    outras: ofertas.filter((o) => o.tipo === 'produto_curso' && o.ativo && o.slug !== slug).slice(0, 3),
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const found = await findProduto(slug)
  if (!found) return {}

  const { oferta } = found
  const title = oferta.seoTitulo || oferta.titulo
  const description = oferta.seoDescricao || oferta.descricaoCurta
  const url = `${SITE_METADATA.url}/produtos/${oferta.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: oferta.galeria[0] ? [{ url: oferta.galeria[0] }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: oferta.galeria[0] ? [oferta.galeria[0]] : undefined,
    },
  }
}

export default async function ProdutoPage({ params }: { params: Params }) {
  const { slug } = await params
  const found = await findProduto(slug)
  if (!found) notFound()

  return <OfertaDetalhe oferta={found.oferta} outras={found.outras} />
}
