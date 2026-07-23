import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addMatriculasContactToBrevo } from '@/lib/brevo'
import { addSubscriberToListmonk } from '@/lib/listmonk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.nome || !body.email || !body.whatsapp) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    const { error } = await supabase.from('matriculas_leads').insert({
      nome: body.nome,
      email: body.email,
      whatsapp: body.whatsapp,
    })

    if (error) throw error

    // Não há automação de e-mail pra matriculas_leads hoje, nem no Brevo nem no
    // Listmonk — os dois só sincronizam o contato.
    try {
      await addMatriculasContactToBrevo({
        nome: body.nome,
        email: body.email,
        whatsapp: body.whatsapp,
      })
    } catch (err) {
      console.error('[Brevo] Failed to add matriculas contact:', err)
    }

    try {
      await addSubscriberToListmonk({
        nome: body.nome,
        email: body.email,
        whatsapp: body.whatsapp,
        listId: Number(process.env.LISTMONK_MATRICULAS_LIST_ID ?? '0'),
      })
    } catch (err) {
      console.error('[Listmonk] Failed to sync matriculas contact:', err)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
