// ─── Strapi connection ──

export const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'

export const STRAPI_TOKEN = process.env.STRAPI_TOKEN ?? ''

export const AUTH_COOKIE = 'ddf_jwt'

export function strapiAuthHeaders(): Record<string, string> {
  return STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}
}
