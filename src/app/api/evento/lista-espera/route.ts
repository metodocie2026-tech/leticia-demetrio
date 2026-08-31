import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { EVENTO_TAG } from '@/constants/evento'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.nome || !body.email || !body.whatsapp) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    const { error } = await supabase.from('lista_espera').insert({
      nome: body.nome,
      email: body.email,
      whatsapp: body.whatsapp,
      evento: EVENTO_TAG,
    })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
