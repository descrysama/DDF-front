import { NextResponse, type NextRequest } from 'next/server'

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'
const AUTH_COOKIE = 'ddf_jwt'

export async function middleware(req: NextRequest) {
  const jwt = req.cookies.get(AUTH_COOKIE)?.value
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('from', req.nextUrl.pathname)

  if (!jwt) {
    return NextResponse.redirect(loginUrl)
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.redirect(loginUrl)
    const user = await res.json()
    if (user?.role?.type !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  } catch {
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
