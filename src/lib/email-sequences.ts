import { EVENTO_TAG } from '@/constants/evento'

// Categoria A — e-mails disparados a partir do momento em que o lead se
// inscreve (não confundir com as campanhas de data fixa da Categoria B, essas
// são só configuração no painel do Listmonk, sem código nenhum). O passo
// delayHours: 0 é chamado direto em src/app/api/evento/inscricao/route.ts; os
// demais são varridos pelo cron em src/app/api/cron/email-sequences/route.ts.
export type SequenceStep = {
  table: 'inscricoes'
  delayHours: number
  listmonkTemplateId: number
  sentColumn: string
}

// Escopo do cron: só processa leads do evento atual. Sem isso, qualquer linha
// antiga de um evento anterior com a coluna *_sent_at ainda NULL seria pega
// pela varredura do cron e receberia um e-mail 1/2 fora de hora — já foi quase
// um incidente real (ver docs/status-migracao-brevo-ses.md, 19/07/2026).
export const EVENTO_SEQUENCE_TAG = EVENTO_TAG

export const EMAIL_SEQUENCES: SequenceStep[] = [
  {
    table: 'inscricoes',
    delayHours: 0,
    listmonkTemplateId: Number(process.env.LISTMONK_TEMPLATE_EMAIL_1_ID ?? '0'),
    sentColumn: 'email_1_sent_at',
  },
  {
    table: 'inscricoes',
    delayHours: 24,
    listmonkTemplateId: Number(process.env.LISTMONK_TEMPLATE_EMAIL_2_ID ?? '0'),
    sentColumn: 'email_2_sent_at',
  },
]
