import type { ContactFormData } from '@/types'

export async function submitContact(data: ContactFormData): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error('Failed to submit contact form')
  }
}
