import { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/middleware'

// api/admin/* routes aren't covered by the middleware matcher (only /admin/:path*
// pages are) — routes that need their own check call this instead of relying
// on the page-level redirect.
export function requireAdminSession(req: NextRequest): boolean {
  const session = req.cookies.get(SESSION_COOKIE)?.value
  return Boolean(session && session === process.env.ADMIN_PASSWORD)
}
