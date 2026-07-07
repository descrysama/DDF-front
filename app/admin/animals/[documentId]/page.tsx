import { notFound } from 'next/navigation'
import { fetchResource } from '@/lib/strapi'
import type { StrapiMedia } from '@/lib/strapi'
import AnimalEditClient from './edit-client'
import { STRAPI_URL } from '@/lib/config'

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
  medias?: StrapiMedia[]
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
      `/api/animals/${documentId}?populate[0]=breed&populate[medias][populate]=image`
    )
    animal = res.data
  } catch {
    notFound()
  }

  return <AnimalEditClient animal={animal} strapiUrl={STRAPI_URL} />
}
