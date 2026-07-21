import { notFound } from 'next/navigation'
import { fetchResource, fetchUsers, fetchBreeds, fetchFosterFamilies } from '@/lib/strapi'
import type { StrapiMedia, StrapiMedicalEvent, StrapiUser, StrapiBreed } from '@/lib/strapi'
import AnimalEditClient from './edit-client'
import { STRAPI_URL } from '@/lib/config'

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
  breed?: StrapiBreed | null
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
  const { documentId } = await params

  let animal: AnimalDetail
  try {
    const res = await fetchResource<AnimalDetail>(
      `/api/animals/${documentId}` +
        '?populate[0]=breed' +
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

  const [users, breeds, { fosterFamilies }] = await Promise.all([
    fetchUsers(),
    fetchBreeds(),
    fetchFosterFamilies({ limit: 200 }),
  ])

  return (
    <AnimalEditClient
      animal={animal}
      strapiUrl={STRAPI_URL}
      users={users}
      breeds={breeds}
      fosterFamilies={fosterFamilies}
    />
  )
}
