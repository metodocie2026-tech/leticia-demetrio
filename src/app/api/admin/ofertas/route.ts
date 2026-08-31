import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { requireAdminSession } from '@/lib/adminAuth'

type OfertaPayload = {
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
  sobre: string[]
  como_funciona: { titulo: string; descricao: string }[]
  galeria: string[]
  faq: { pergunta: string; resposta: string }[]
  seo_titulo: string
  seo_descricao: string
  investimento_nota: string
  ativo: boolean
}

export async function PATCH(req: NextRequest) {
  if (!requireAdminSession(req)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const body: OfertaPayload & { id: number } = await req.json()

    const { error } = await supabase
      .from('ofertas')
      .update({
        tipo: body.tipo,
        modalidade: body.modalidade,
        slug: body.slug,
        titulo: body.titulo,
        descricao_curta: body.descricao_curta,
        icone: body.icone,
        destaque: body.destaque,
        ordem: body.ordem,
        cta_tipo: body.cta_tipo,
        cta_url: body.cta_url,
        cta_mensagem: body.cta_mensagem,
        cta_label: body.cta_label,
        sobre: body.sobre,
        como_funciona: body.como_funciona,
        galeria: body.galeria,
        faq: body.faq,
        seo_titulo: body.seo_titulo,
        seo_descricao: body.seo_descricao,
        investimento_nota: body.investimento_nota,
        ativo: body.ativo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.id)

    if (error) throw error

    revalidateTag('ofertas', 'max')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar oferta.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdminSession(req)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const body: OfertaPayload = await req.json()

    const { data, error } = await supabase
      .from('ofertas')
      .insert({
        tipo: body.tipo,
        modalidade: body.modalidade,
        slug: body.slug,
        titulo: body.titulo,
        descricao_curta: body.descricao_curta,
        icone: body.icone,
        destaque: body.destaque,
        ordem: body.ordem,
        cta_tipo: body.cta_tipo,
        cta_url: body.cta_url,
        cta_mensagem: body.cta_mensagem,
        cta_label: body.cta_label,
        sobre: body.sobre,
        como_funciona: body.como_funciona,
        galeria: body.galeria,
        faq: body.faq,
        seo_titulo: body.seo_titulo,
        seo_descricao: body.seo_descricao,
        investimento_nota: body.investimento_nota,
        ativo: body.ativo,
      })
      .select('id')
      .single()

    if (error) throw error

    revalidateTag('ofertas', 'max')
    return NextResponse.json({ id: (data as { id: number }).id })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar oferta.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!requireAdminSession(req)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 })

    const { error } = await supabase.from('ofertas').delete().eq('id', Number(id))

    if (error) throw error

    revalidateTag('ofertas', 'max')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao excluir oferta.' }, { status: 500 })
  }
}
