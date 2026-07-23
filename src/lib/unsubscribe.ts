import { createHmac, timingSafeEqual } from 'crypto'

// Listmonk's native {{ UnsubscribeURL }} only works in campaign templates, not
// transactional ones (confirmed against listmonk's source — TemplateFuncs()
// registers it only for CampaignMessage, GenericTemplateFuncs() used for tx
// sends doesn't have it) — and its native page needs a campaign UUID that
// transactional sends don't have. This is a self-hosted replacement that works
// the same way for every template, transactional or campaign: a signed link to
// our own /cancelar-inscricao page.

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET
  if (!secret) throw new Error('UNSUBSCRIBE_SECRET not set')
  return secret
}

function sign(email: string): string {
  return createHmac('sha256', getSecret()).update(normalizeEmail(email)).digest('base64url')
}

export function createUnsubscribeToken(email: string): string {
  return sign(email)
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = Buffer.from(sign(email))
  const given = Buffer.from(token)
  if (expected.length !== given.length) return false
  return timingSafeEqual(expected, given)
}

export function buildUnsubscribeUrl(email: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.leticiademetrio.com.br'
  const params = new URLSearchParams({
    email: normalizeEmail(email),
    token: createUnsubscribeToken(email),
  })
  return `${base.replace(/\/$/, '')}/cancelar-inscricao?${params.toString()}`
}
