import { notFound } from 'next/navigation'
import { fetchResource, fetchUsers, fetchBreeds, fetchCharacters, fetchFosterFamilies } from '@/lib/strapi'
import type { StrapiMedia, StrapiMedicalEvent, StrapiUser, StrapiBreed, StrapiCharacter } from '@/lib/strapi'
import AnimalEditClient from './edit-client'
import { requireAdmin } from '@/lib/auth'
import { STRAPI_URL } from '@/lib/config'

// Only Membre/Admin accounts may be assigned as an animal's referent — an
// Adoptant has no business being the person notified about their own requests.
const REFERENT_ROLES = ['membre', 'admin']

interface FosterAssignment {
  id: number
  documentId: string
  status: string
  start_date: string | null
  foster_family?: { id: number; documentId: string; address: string } | null
}

interface AnimalDetail {
  id: number
  documentId: string
  name: string
  age: number
  gender: string
  description: string | null
  status: string
  activity_level: string
  ok_with_children: boolean
  ok_with_dogs: boolean
  ok_with_cats: boolean
  indoor_only: boolean
  vaccinated: boolean
  sterilized: boolean
  identified: boolean
  dewormed: boolean
  breed?: StrapiBreed | null
  characters?: StrapiCharacter[]
  medias?: StrapiMedia[]
  video_url?: string | null
  trap_date?: string | null
  medical_history?: StrapiMedicalEvent[]
  referent?: StrapiUser | null
  backup_referents?: StrapiUser[]
  foster_assignments?: FosterAssignment[]
}

export default async function EditAnimalPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  await requireAdmin()
  const { documentId } = await params

  let animal: AnimalDetail
  try {
    const res = await fetchResource<AnimalDetail>(
      `/api/animals/${documentId}` +
        '?populate[breed]=true' +
        '&populate[characters]=true' +
        '&populate[medias][populate]=image' +
        '&populate[medical_history]=true' +
        '&populate[foster_assignments][populate]=foster_family' +
        '&populate[referent]=true' +
        '&populate[backup_referents]=true'
    )
    animal = res.data
  } catch {
    notFound()
  }

  const [allUsers, breeds, characters, { fosterFamilies }] = await Promise.all([
    fetchUsers(),
    fetchBreeds(),
    fetchCharacters(),
    fetchFosterFamilies({ limit: 200 }),
  ])
  const users = allUsers.filter((u) => REFERENT_ROLES.includes(u.role?.name?.toLowerCase() ?? ''))

  return (
    <AnimalEditClient
      animal={animal}
      strapiUrl={STRAPI_URL}
      users={users}
      breeds={breeds}
      characters={characters}
      fosterFamilies={fosterFamilies}
    />
  )
}
