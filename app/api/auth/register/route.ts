import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE, registerWithStrapi, getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  const { username, email, password } = await req.json()
  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Champs requis' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Mot de passe: 8 caractères minimum' },
      { status: 400 }
    )
  }

  const result = await registerWithStrapi(username, email, password)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
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
