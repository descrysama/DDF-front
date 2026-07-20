import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { STRAPI_URL, AUTH_COOKIE } from './config'

export { AUTH_COOKIE }

export interface AuthUser {
  id: number
  documentId?: string
  username: string
  email: string
  is_absent?: boolean
  absent_until?: string | null
  role: {
    id: number
    name: string
    type: string
  } | null
}

export async function getAuthToken(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(AUTH_COOKIE)?.value ?? null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const jwt = await getAuthToken()
  if (!jwt) return null

  const res = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role?.name?.toLowerCase() === 'admin'
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user || !isAdmin(user)) {
    redirect('/login')
  }
  return user
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
