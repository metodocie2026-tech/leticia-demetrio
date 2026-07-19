import { NextRequest, NextResponse } from 'next/server'
import type { InscricaoData } from '@/constants/evento'
import type { UtmParams } from '@/utils/utm'
import { supabase } from '@/lib/supabase'
import { getSettings } from '@/lib/settings'
import { addContactToBrevo } from '@/lib/brevo'

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

    // Brevo: add contact to list so the automation triggers.
    // Awaited so it runs before the response, but errors are silently swallowed
    // — a Brevo outage must never break the form submission.
    try {
      const settings = await getSettings()
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

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
