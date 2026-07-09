import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/middleware'

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url), 303)
  res.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}
