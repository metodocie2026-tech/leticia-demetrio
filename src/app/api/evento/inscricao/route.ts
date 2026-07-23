import { NextRequest, NextResponse } from 'next/server'
import type { InscricaoData } from '@/constants/evento'
import type { UtmParams } from '@/utils/utm'
import { supabase } from '@/lib/supabase'
import { getSettings } from '@/lib/settings'
import { addContactToBrevo } from '@/lib/brevo'
import { addSubscriberToListmonk } from '@/lib/listmonk'

export async function POST(req: NextRequest) {
  try {
    const body: InscricaoData & Partial<UtmParams> = await req.json()

    if (!body.nome || !body.email || !body.whatsapp) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    const { error } = await supabase.from('inscricoes').insert({
      nome: body.nome,
      email: body.email,
      whatsapp: body.whatsapp,
      evento: 'semana-elegancia-na-pratica',
      utm_source: body.utm_source ?? '',
      utm_medium: body.utm_medium ?? '',
      utm_campaign: body.utm_campaign ?? '',
      utm_content: body.utm_content ?? '',
      utm_term: body.utm_term ?? '',
    })

    if (error) throw error

    const settings = await getSettings()

    // Brevo segue sendo o dono da automação (e-mail imediato + 24h) — inalterado.
    try {
      await addContactToBrevo({
        nome: body.nome,
        email: body.email,
        whatsapp: body.whatsapp,
        whatsappGroupUrl: settings.whatsapp_group_url,
        surveyUrl: settings.survey_url,
      })
    } catch (err) {
      console.error('[Brevo] Failed to add contact:', err)
    }

    // Listmonk: só sincroniza o contato (sem disparar e-mail daqui), pra manter
    // a lista pronta pras campanhas de data fixa (docs/migracao-brevo-ses.md §3).
    try {
      await addSubscriberToListmonk({
        nome: body.nome,
        email: body.email,
        whatsapp: body.whatsapp,
        listId: Number(process.env.LISTMONK_LIST_ID ?? '0'),
        attribs: {
          whatsapp_group_url: settings.whatsapp_group_url,
          survey_url: settings.survey_url,
        },
      })
    } catch (err) {
      console.error('[Listmonk] Failed to sync contact:', err)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
