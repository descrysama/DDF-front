import { cookies } from 'next/headers'

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'

export const AUTH_COOKIE = 'ddf_jwt'

export interface AuthUser {
  id: number
  documentId?: string
  username: string
  email: string
  role: {
    id: number
    name: string
    type: string
  } | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const jar = await cookies()
  const jwt = jar.get(AUTH_COOKIE)?.value
  if (!jwt) return null

  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role?.type === 'admin'
}

export async function registerWithStrapi(
  username: string,
  email: string,
  password: string
): Promise<{ jwt: string; user: AuthUser } | { error: string }> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) {
    return { error: data?.error?.message ?? "Impossible de créer le compte" }
  }
  return { jwt: data.jwt, user: data.user }
}

export async function loginWithStrapi(
  identifier: string,
  password: string
): Promise<{ jwt: string; user: AuthUser } | { error: string }> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) {
    return { error: data?.error?.message ?? 'Identifiants invalides' }
  }
  return { jwt: data.jwt, user: data.user }
}
