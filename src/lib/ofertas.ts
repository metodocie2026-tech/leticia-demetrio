import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'
import type { Oferta, OfertaStep, OfertaFaqItem } from '@/types'

type OfertaRow = {
  id: number
  tipo: string
  modalidade: string
  slug: string
  titulo: string
  descricao_curta: string
  icone: string
  destaque: boolean
  ordem: number
  cta_tipo: string
  cta_url: string
  cta_mensagem: string
  cta_label: string
  sobre: string[] | null
  como_funciona: OfertaStep[] | null
  galeria: string[] | null
  faq: OfertaFaqItem[] | null
  seo_titulo: string
  seo_descricao: string
  investimento_nota: string
  ativo: boolean
}

function mapRow(row: OfertaRow): Oferta {
  return {
    id: row.id,
    tipo: row.tipo as Oferta['tipo'],
    modalidade: row.modalidade as Oferta['modalidade'],
    slug: row.slug,
    titulo: row.titulo,
    descricaoCurta: row.descricao_curta,
    icone: row.icone,
    destaque: row.destaque,
    ordem: row.ordem,
    ctaTipo: row.cta_tipo as Oferta['ctaTipo'],
    ctaUrl: row.cta_url,
    ctaMensagem: row.cta_mensagem,
    ctaLabel: row.cta_label,
    sobre: row.sobre ?? [],
    comoFunciona: row.como_funciona ?? [],
    galeria: row.galeria ?? [],
    faq: row.faq ?? [],
    seoTitulo: row.seo_titulo,
    seoDescricao: row.seo_descricao,
    investimentoNota: row.investimento_nota,
    ativo: row.ativo,
  }
}

// Retorna todas as ofertas (os dois tipos, ativas e inativas) — quem consome
// filtra em memória (landing page por tipo+ativo, admin sem filtro, páginas de
// detalhe por slug). Dataset pequeno o bastante pra uma função de cache só
// servir todo mundo, em vez de uma versão por caso de uso.
export const getOfertas = unstable_cache(
  async (): Promise<Oferta[]> => {
    const { data } = await supabase
      .from('ofertas')
      .select('*')
      .order('ordem', { ascending: true })

    if (!data) return []

    return (data as OfertaRow[]).map(mapRow)
  },
  ['ofertas'],
  { tags: ['ofertas'], revalidate: 60 },
)
