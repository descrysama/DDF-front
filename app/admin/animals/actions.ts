'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'
import type { StrapiMedia } from '@/lib/strapi'
import { STRAPI_URL, strapiAuthHeaders } from '@/lib/config'
import { requireAdmin } from '@/lib/auth'

const AUTH = strapiAuthHeaders()
const JSON_HEADERS = { ...AUTH, 'Content-Type': 'application/json' }

function parseAnimalFormData(formData: FormData) {
  return {
    name:             formData.get('name') as string,
    age:              Number(formData.get('age')),
    gender:           formData.get('gender') as string,
    description:      formData.get('description') as string | null,
    status:           formData.get('status') as string,
    activity_level:   formData.get('activity_level') as string,
    ok_with_children: formData.get('ok_with_children') === 'on',
    ok_with_dogs:     formData.get('ok_with_dogs') === 'on',
    ok_with_cats:     formData.get('ok_with_cats') === 'on',
    indoor_only:      formData.get('indoor_only') === 'on',
  }
}

// Upload a file and return its Strapi integer id
async function uploadFile(file: File): Promise<number> {
  const upload = new FormData()
  upload.append('files', file)
  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: AUTH,
    body: upload,
  })
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
  const [uploaded] = await res.json()
  return uploaded.id as number
}

// Fetch current medias for an animal (components, populated with image)
async function fetchAnimalMedias(animalDocumentId: string): Promise<StrapiMedia[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/animals/${animalDocumentId}?populate[medias][populate]=image`,
    { headers: AUTH }
  )
  if (!res.ok) throw new Error(`Fetch medias failed: ${res.status}`)
  const { data } = await res.json()
  return (data.medias ?? []) as StrapiMedia[]
}

// Serialize medias for a Strapi PUT — image must be the upload file's integer id,
// component id must NOT be included (Strapi v5 rejects it)
function serializeMedias(medias: StrapiMedia[]) {
  return medias.map(m => ({
    is_cover: m.is_cover,
    image: m.image?.id ?? null,
  }))
}

// PUT the animal's medias component array
async function putAnimalMedias(animalDocumentId: string, medias: StrapiMedia[]) {
  const res = await fetch(`${STRAPI_URL}/api/animals/${animalDocumentId}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ data: { medias: serializeMedias(medias) } }),
  })
  if (!res.ok) throw new Error(`Update medias failed: ${res.status}`)
}

// ─── Animal CRUD ──────────────────────────────────────────────────────────────

export async function createAnimal(formData: FormData) {
  await requireAdmin()
  const result = await strapiPost<{ data: { documentId: string } }>('/api/animals', parseAnimalFormData(formData))
  const file = formData.get('photo') as File | null
  if (file && file.size > 0) {
    const fileId = await uploadFile(file)
    const res = await fetch(`${STRAPI_URL}/api/animals/${result.data.documentId}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ data: { medias: [{ is_cover: true, image: fileId }] } }),
    })
    if (!res.ok) throw new Error(`Link photo failed: ${res.status}`)
  }
  revalidatePath('/admin/animals')
  redirect('/admin/animals')
}

export async function updateAnimal(documentId: string, formData: FormData) {
  await requireAdmin()
  await strapiPut(`/api/animals/${documentId}`, parseAnimalFormData(formData))
  revalidatePath('/admin/animals')
  revalidatePath('/')
  redirect('/admin/animals')
}

export async function deleteAnimal(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/animals/${documentId}`)
  revalidatePath('/admin/animals')
  redirect('/admin/animals')
}

// ─── Media management ─────────────────────────────────────────────────────────

export async function addMediaToAnimal(animalDocumentId: string, formData: FormData) {
  await requireAdmin()
  const file = formData.get('photo') as File | null
  if (!file || file.size === 0) return

  const fileId = await uploadFile(file)
  const current = await fetchAnimalMedias(animalDocumentId)
  const isFirst = current.length === 0
  const updated = [
    ...serializeMedias(current),
    { is_cover: isFirst, image: fileId },
  ]
  const res = await fetch(`${STRAPI_URL}/api/animals/${animalDocumentId}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify({ data: { medias: updated } }),
  })
  if (!res.ok) throw new Error(`Add media failed: ${res.status}`)

  revalidatePath(`/admin/animals/${animalDocumentId}`)
  revalidatePath('/')
}

export async function deleteMedia(componentId: number, animalDocumentId: string) {
  await requireAdmin()
  const current = await fetchAnimalMedias(animalDocumentId)
  const filtered = current.filter(m => m.id !== componentId)
  // if we deleted the cover, promote first remaining to cover
  const hasCover = filtered.some(m => m.is_cover)
  if (!hasCover && filtered.length > 0) filtered[0].is_cover = true
  await putAnimalMedias(animalDocumentId, filtered)

  revalidatePath(`/admin/animals/${animalDocumentId}`)
  revalidatePath('/')
}

export async function setCoverMedia(componentId: number, animalDocumentId: string) {
  await requireAdmin()
  const current = await fetchAnimalMedias(animalDocumentId)
  const updated = current.map(m => ({ ...m, is_cover: m.id === componentId }))
  await putAnimalMedias(animalDocumentId, updated)

  revalidatePath(`/admin/animals/${animalDocumentId}`)
  revalidatePath('/')
}
