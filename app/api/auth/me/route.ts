import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUser, AUTH_COOKIE } from '@/lib/auth'

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'

export async function GET() {
  const user = await getCurrentUser()
  return NextResponse.json({ user })
}

export async function PUT(req: Request) {
  const jar = await cookies()
  const jwt = jar.get(AUTH_COOKIE)?.value
  if (!jwt) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await req.json()
  const allowed: Record<string, string | boolean | null> = {}
  if (body.username) allowed.username = body.username
  if (body.email) allowed.email = body.email
  if (typeof body.is_absent === 'boolean') allowed.is_absent = body.is_absent
  if ('absent_until' in body) allowed.absent_until = body.absent_until || null

  const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(allowed),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(
      { error: data?.error?.message ?? 'Erreur lors de la mise à jour' },
      { status: res.status },
    )
  }

  const updated = await getCurrentUser()
  return NextResponse.json({ user: updated })
}
