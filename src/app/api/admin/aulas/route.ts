import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  try {
    const body: {
      id: number
      dia: string
      titulo: string
      youtube_id: string
      duracao: string
      descricao: string
      release_at: string | null
    } = await req.json()

    const { error } = await supabase
      .from('aulas')
      .update({
        dia: body.dia,
        titulo: body.titulo,
        youtube_id: body.youtube_id,
        duracao: body.duracao,
        descricao: body.descricao,
        release_at: body.release_at || null,
      })
      .eq('id', body.id)

    if (error) throw error

    revalidateTag('aulas', 'max')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar aula.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: {
      dia: string
      titulo: string
      youtube_id: string
      duracao: string
      descricao: string
      release_at: string | null
    } = await req.json()

    const { data, error } = await supabase
      .from('aulas')
      .insert({
        dia: body.dia,
        titulo: body.titulo,
        youtube_id: body.youtube_id,
        duracao: body.duracao,
        descricao: body.descricao,
        release_at: body.release_at || null,
      })
      .select('id')
      .single()

    if (error) throw error

    revalidateTag('aulas', 'max')
    return NextResponse.json({ id: (data as { id: number }).id })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar aula.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 })

    const { error } = await supabase.from('aulas').delete().eq('id', Number(id))

    if (error) throw error

    revalidateTag('aulas', 'max')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao excluir aula.' }, { status: 500 })
  }
}
