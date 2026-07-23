import { buildUnsubscribeUrl } from '@/lib/unsubscribe'

function getBase(): string {
  const base = process.env.LISTMONK_API_URL
  if (!base) throw new Error('LISTMONK_API_URL not set')
  return base.replace(/\/$/, '')
}

function getAuthHeader(): string {
  const user = process.env.LISTMONK_API_USERNAME
  const key = process.env.LISTMONK_API_KEY
  if (!user || !key) throw new Error('LISTMONK_API_USERNAME/LISTMONK_API_KEY not set')
  return `token ${user}:${key}`
}

async function listmonkFetch(path: string, init: RequestInit) {
  return fetch(`${getBase()}${path}`, {
    ...init,
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init.headers,
    },
  })
}

// Listmonk's subscriber search only takes a raw SQL fragment (no parameterized
// query support) — escape single quotes so a crafted email can't break out of it.
function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''")
}

type ListmonkSubscriber = {
  id: number
  lists?: { id: number }[]
  attribs?: Record<string, unknown>
}

async function findSubscriberByEmail(email: string): Promise<ListmonkSubscriber | null> {
  const query = `subscribers.email = '${escapeSqlString(email)}'`
  const res = await listmonkFetch(`/subscribers?query=${encodeURIComponent(query)}&per_page=1`, {
    method: 'GET',
  })
  if (!res.ok) return null
  const json = await res.json()
  return json?.data?.results?.[0] ?? null
}

// ── Subscribers / listas ────────────────────────────────────────────────────

export async function addSubscriberToListmonk({
  nome,
  email,
  whatsapp,
  listId,
  attribs = {},
}: {
  nome: string
  email: string
  whatsapp: string
  listId: number
  attribs?: Record<string, unknown>
}) {
  if (!listId) return

  // unsubscribe_url fica salvo no subscriber pra `{{ .Subscriber.Attribs.unsubscribe_url }}`
  // funcionar em qualquer template — transacional ou campanha (Listmonk não
  // suporta {{ UnsubscribeURL }} nativo em templates transacionais).
  const body = {
    email,
    name: nome,
    status: 'enabled',
    lists: [listId],
    attribs: { whatsapp, unsubscribe_url: buildUnsubscribeUrl(email), ...attribs },
    preconfirm_subscriptions: true,
  }

  const createRes = await listmonkFetch('/subscribers', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (createRes.ok) return
  if (createRes.status !== 409) {
    const text = await createRes.text().catch(() => '')
    throw new Error(`Listmonk POST /subscribers ${createRes.status}: ${text}`)
  }

  // Já existe (ex: mesmo e-mail em outra lista) — funde as listas em vez de sobrescrever.
  const existing = await findSubscriberByEmail(email)
  if (!existing) throw new Error(`Listmonk: subscriber ${email} retornou 409 mas não foi encontrado na busca`)

  const mergedListIds = Array.from(new Set([...(existing.lists ?? []).map((l) => l.id), listId]))

  const updateRes = await listmonkFetch(`/subscribers/${existing.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      email,
      name: nome,
      status: 'enabled',
      lists: mergedListIds,
      attribs: { ...existing.attribs, whatsapp, unsubscribe_url: buildUnsubscribeUrl(email), ...attribs },
      preconfirm_subscriptions: true,
    }),
  })
  if (!updateRes.ok) {
    const text = await updateRes.text().catch(() => '')
    throw new Error(`Listmonk PUT /subscribers/${existing.id} ${updateRes.status}: ${text}`)
  }
}

// ── Cancelamento de inscrição ───────────────────────────────────────────────

// Usado por src/app/cancelar-inscricao/page.tsx. Idempotente de propósito —
// clicar duas vezes no link, ou clicar num link de um e-mail que já foi
// removido antes, não deve gerar erro.
export async function blocklistListmonkSubscriberByEmail(email: string): Promise<void> {
  const existing = await findSubscriberByEmail(email)
  if (!existing) return

  const res = await listmonkFetch(`/subscribers/${existing.id}/blocklist`, { method: 'PUT' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Listmonk PUT /subscribers/${existing.id}/blocklist ${res.status}: ${text}`)
  }
}
