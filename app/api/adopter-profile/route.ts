import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { STRAPI_URL, STRAPI_TOKEN } from '@/lib/config'
import type { AdopterActivityPreference, AdopterExperience, AdopterHousingType, StrapiAdopterProfileRaw } from '@/lib/strapi'

async function getProfile(userId: number): Promise<StrapiAdopterProfileRaw | null> {
  const res = await fetch(`${STRAPI_URL}/api/adopter-profiles?filters[user][id][$eq]=${userId}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const { data } = (await res.json()) as { data: StrapiAdopterProfileRaw[] }
  return data[0] ?? null
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const profile = await getProfile(user.id)
  return NextResponse.json({ profile })
}

export async function PUT(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const data = {
    housing_type: body.housing_type as AdopterHousingType,
    has_garden: Boolean(body.has_garden),
    has_children: Boolean(body.has_children),
    has_dogs: Boolean(body.has_dogs),
    has_cats: Boolean(body.has_cats),
    experience_level: body.experience_level as AdopterExperience,
    age_preference: body.age_preference,
    activity_level_preference: body.activity_level_preference as AdopterActivityPreference,
    motivation: (body.motivation as string) ?? '',
  }

  const existing = await getProfile(user.id)
  const res = await fetch(
    existing ? `${STRAPI_URL}/api/adopter-profiles/${existing.documentId}` : `${STRAPI_URL}/api/adopter-profiles`,
    {
      method: existing ? 'PUT' : 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: existing ? data : { ...data, user: user.id } }),
    }
  )

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return NextResponse.json({ error: `Erreur Strapi ${res.status}: ${text.slice(0, 200)}` }, { status: 500 })
  }

  const profile = await getProfile(user.id)
  return NextResponse.json({ profile })
}
