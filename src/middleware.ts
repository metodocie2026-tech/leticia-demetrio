import { NextRequest, NextResponse } from 'next/server'

export const SESSION_COOKIE = 'admin_session'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = req.cookies.get(SESSION_COOKIE)?.value
  const isValid = Boolean(session && session === process.env.ADMIN_PASSWORD)
  const isLoginPage = pathname === '/admin/login'

  // Already logged in → skip the login page
  if (isLoginPage && isValid) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Not logged in → send to login
  if (!isLoginPage && !isValid) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
