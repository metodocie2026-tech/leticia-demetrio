const BASE = 'https://api.brevo.com/v3'

function getKey(): string {
  const key = process.env.BREVO_API_KEY
  if (!key) throw new Error('BREVO_API_KEY not set')
  return key
}

async function brevoPost(path: string, body: unknown, apiKey: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Brevo ${res.status}: ${text}`)
  }
}

// ── Event sign-up list ─────────────────────────────────────────────────────

export async function addContactToBrevo({
  nome,
  email,
  whatsapp,
  whatsappGroupUrl,
  surveyUrl,
}: {
  nome: string
  email: string
  whatsapp: string
  whatsappGroupUrl: string
  surveyUrl: string
}) {
  const apiKey = getKey()
  const listId = parseInt(process.env.BREVO_LIST_ID ?? '0')
  if (!listId) return

  await brevoPost('/contacts', {
    email,
    attributes: {
      NAME: nome,
      WHATSAPP_NUMBER: whatsapp,
      SURVEY_URL: surveyUrl,
      WHATSAPP_GROUP_URL: whatsappGroupUrl,
    },
    listIds: [listId],
    updateEnabled: true,
  }, apiKey)
}

// ── Matrículas list ────────────────────────────────────────────────────────

export async function addMatriculasContactToBrevo({
  nome,
  email,
  whatsapp,
}: {
  nome: string
  email: string
  whatsapp: string
}) {
  const apiKey = getKey()
  const listId = parseInt(process.env.BREVO_MATRICULAS_LIST_ID ?? '0')
  if (!listId) return

  await brevoPost('/contacts', {
    email,
    attributes: {
      NAME: nome,
      WHATSAPP_NUMBER: whatsapp,
    },
    listIds: [listId],
    updateEnabled: true,
  }, apiKey)
}

