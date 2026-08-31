import { NextRequest, NextResponse } from 'next/server'
import { EVENTO_TAG, type InscricaoData } from '@/constants/evento'
import type { UtmParams } from '@/utils/utm'
import { supabase } from '@/lib/supabase'
import { getSettings } from '@/lib/settings'
import { addSubscriberToListmonk, sendListmonkTransactional } from '@/lib/listmonk'
import { EMAIL_SEQUENCES } from '@/lib/email-sequences'

export async function POST(req: NextRequest) {
  try {
    const body: InscricaoData & Partial<UtmParams> = await req.json()

    if (!body.nome || !body.email || !body.whatsapp) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    const { data: inserted, error } = await supabase
      .from('inscricoes')
      .insert({
        nome: body.nome,
        email: body.email,
        whatsapp: body.whatsapp,
        evento: EVENTO_TAG,
        utm_source: body.utm_source ?? '',
        utm_medium: body.utm_medium ?? '',
        utm_campaign: body.utm_campaign ?? '',
        utm_content: body.utm_content ?? '',
        utm_term: body.utm_term ?? '',
      })
      .select('id')
      .single()

    if (error) throw error

    const settings = await getSettings()

    // Listmonk sincroniza o contato primeiro — o envio transacional abaixo
    // exige que o subscriber já exista (senão o /tx falha com "not found").
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

    // Categoria A, passo imediato (e-mail 1) — os passos com delay (e-mail 2,
    // +24h) são disparados pelo cron em /api/cron/email-sequences.
    const immediate = EMAIL_SEQUENCES.find((step) => step.delayHours === 0)
    if (immediate?.listmonkTemplateId) {
      try {
        await sendListmonkTransactional({ email: body.email, templateId: immediate.listmonkTemplateId })
        await supabase.from('inscricoes').update({ [immediate.sentColumn]: new Date().toISOString() }).eq('id', inserted.id)
      } catch (err) {
        console.error('[Listmonk] Failed to send immediate email:', err)
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
