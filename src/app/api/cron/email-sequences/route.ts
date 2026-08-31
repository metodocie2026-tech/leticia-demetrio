import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendListmonkTransactional } from '@/lib/listmonk'
import { EMAIL_SEQUENCES, EVENTO_SEQUENCE_TAG } from '@/lib/email-sequences'

// Chamado de hora em hora pelo Cron Job do EasyPanel — ver
// docs/tutorial-easypanel-cron.md. Dispara o e-mail 2 (+24h após inscrição) e
// qualquer outro passo futuro com delay. Também funciona como rede de
// segurança pro passo imediato (delayHours: 0): se LISTMONK_TEMPLATE_EMAIL_1_ID
// não estava configurado no momento da inscrição, o envio inline foi pulado e
// `email_1_sent_at` ficou NULL — assim que o template for configurado, este
// cron pega essas linhas atrasadas na próxima execução (não precisa esperar
// 24h: o cutoff de um passo com delayHours: 0 é "agora", sempre satisfeito).
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, { sent: number; failed: number }> = {}

  for (const step of EMAIL_SEQUENCES) {
    if (!step.listmonkTemplateId) continue

    const cutoff = new Date(Date.now() - step.delayHours * 60 * 60 * 1000).toISOString()

    const { data: due, error } = await supabase
      .from(step.table)
      .select('id, email')
      .eq('evento', EVENTO_SEQUENCE_TAG)
      .is(step.sentColumn, null)
      .lte('created_at', cutoff)
      .limit(500)

    if (error) {
      console.error(`[cron/email-sequences] Failed to query ${step.table}:`, error)
      continue
    }

    let sent = 0
    let failed = 0
    for (const lead of due ?? []) {
      try {
        await sendListmonkTransactional({ email: lead.email, templateId: step.listmonkTemplateId })
        await supabase.from(step.table).update({ [step.sentColumn]: new Date().toISOString() }).eq('id', lead.id)
        sent++
      } catch (err) {
        console.error(`[cron/email-sequences] Failed to send ${step.sentColumn} to ${lead.email}:`, err)
        failed++
      }
    }
    results[step.sentColumn] = { sent, failed }
  }

  return NextResponse.json({ success: true, results })
}
