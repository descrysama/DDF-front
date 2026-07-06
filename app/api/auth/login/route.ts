import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE, loginWithStrapi, getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const { identifier, password } = await req.json()
  if (!identifier || !password) {
    return NextResponse.json({ error: 'Champs requis' }, { status: 400 })
  }

  const result = await loginWithStrapi(identifier, password)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 401 })
  }

  const jar = await cookies()
  jar.set(AUTH_COOKIE, result.jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const full = await getCurrentUser()
  return NextResponse.json({ user: full ?? result.user })
}
