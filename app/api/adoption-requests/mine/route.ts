import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { fetchMyAdoptionRequests } from '@/lib/strapi'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const requests = await fetchMyAdoptionRequests(user.id)
  return NextResponse.json({ requests })
}
