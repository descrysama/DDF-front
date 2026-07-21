'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'
import type { StrapiFosterAssignmentRaw } from '@/lib/strapi'
import { STRAPI_URL, strapiAuthHeaders } from '@/lib/config'
import { requireAdmin } from '@/lib/auth'

const AUTH = strapiAuthHeaders()

function parseFosterFamilyFormData(formData: FormData) {
  const userId = formData.get('user_id') as string
  return {
    address:      formData.get('address') as string,
    max_capacity: Number(formData.get('max_capacity')),
    has_children: formData.get('has_children') === 'on',
    has_dogs:     formData.get('has_dogs') === 'on',
    has_cats:     formData.get('has_cats') === 'on',
    is_available: formData.get('is_available') === 'on',
    user:         userId ? Number(userId) : null,
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// Read-before-write inside a mutating action must not hit the 60s Data Cache
// that strapiGet/fetchResource use — a stale read here can create duplicate
// foster-assignment rows across two quick saves of the same family.
async function fetchActiveAssignmentsForFamily(familyDocumentId: string): Promise<StrapiFosterAssignmentRaw[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/foster-assignments?filters[foster_family][documentId][$eq]=${familyDocumentId}` +
      '&filters[status][$eq]=active&populate[0]=animal&pagination[pageSize]=100',
    { headers: AUTH, cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`Fetch active assignments failed: ${res.status}`)
  const { data } = await res.json()
  return data as StrapiFosterAssignmentRaw[]
}

async function fetchAssignment(assignmentDocumentId: string): Promise<StrapiFosterAssignmentRaw> {
  const res = await fetch(
    `${STRAPI_URL}/api/foster-assignments/${assignmentDocumentId}?populate[0]=animal`,
    { headers: AUTH, cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`Fetch assignment failed: ${res.status}`)
  const { data } = await res.json()
  return data as StrapiFosterAssignmentRaw
}

async function syncFosterAssignments(
  familyId: number,
  familyDocumentId: string,
  selectedAnimalIds: number[]
) {
  const activeAssignments = await fetchActiveAssignmentsForFamily(familyDocumentId)

  const activeByAnimalId = new Map(
    activeAssignments.filter((a) => a.animal).map((a) => [a.animal!.id, a] as const)
  )
  const selectedSet = new Set(selectedAnimalIds)

  const newlyLinkedIds = selectedAnimalIds.filter((id) => !activeByAnimalId.has(id))
  if (newlyLinkedIds.length > 0) {
    const filters = newlyLinkedIds.map((id, i) => `filters[id][$in][${i}]=${id}`).join('&')
    const res = await fetch(`${STRAPI_URL}/api/animals?${filters}&fields[0]=status`, {
      headers: AUTH,
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Fetch newly linked animals failed: ${res.status}`)
    const { data: newlyLinkedAnimals } = (await res.json()) as {
      data: { id: number; documentId: string; status: string }[]
    }

    for (const animal of newlyLinkedAnimals) {
      await strapiPost('/api/foster-assignments', {
        animal: animal.id,
        foster_family: familyId,
        status: 'active',
        start_date: today(),
      })
      if (animal.status !== 'reserved' && animal.status !== 'adopted') {
        await strapiPut(`/api/animals/${animal.documentId}`, { status: 'in_foster' })
      }
    }
  }

  for (const [animalId, assignment] of activeByAnimalId) {
    if (selectedSet.has(animalId)) continue
    // A reserved/adopted cat has no checkbox in the picker (it's excluded from
    // fetchAnimalsForFosterPicker), so it's always "unselected" here even though
    // no admin ever chose to unlink it — leave its active assignment alone.
    if (assignment.animal?.status === 'reserved' || assignment.animal?.status === 'adopted') continue
    await strapiPut(`/api/foster-assignments/${assignment.documentId}`, {
      status: 'completed',
      end_date: today(),
    })
    if (assignment.animal) {
      await strapiPut(`/api/animals/${assignment.animal.documentId}`, { status: 'available' })
    }
  }
}

export async function createFosterFamily(formData: FormData) {
  await requireAdmin()
  const result = await strapiPost<{ data: { id: number; documentId: string } }>(
    '/api/foster-families',
    parseFosterFamilyFormData(formData)
  )
  const animalIds = formData.getAll('animal_ids').map(Number)
  await syncFosterAssignments(result.data.id, result.data.documentId, animalIds)
  revalidatePath('/admin/foster-families')
  revalidatePath(`/admin/foster-families/${result.data.documentId}`)
  redirect('/admin/foster-families')
}

export async function updateFosterFamily(documentId: string, formData: FormData) {
  await requireAdmin()
  const result = await strapiPut<{ data: { id: number; documentId: string } }>(
    `/api/foster-families/${documentId}`,
    parseFosterFamilyFormData(formData)
  )
  const animalIds = formData.getAll('animal_ids').map(Number)
  await syncFosterAssignments(result.data.id, documentId, animalIds)
  revalidatePath('/admin/foster-families')
  revalidatePath(`/admin/foster-families/${documentId}`)
  redirect('/admin/foster-families')
}

export async function deleteFosterFamily(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/foster-families/${documentId}`)
  revalidatePath('/admin/foster-families')
  redirect('/admin/foster-families')
}

export async function removeFosterAssignment(assignmentDocumentId: string, familyDocumentId: string) {
  await requireAdmin()
  const assignment = await fetchAssignment(assignmentDocumentId)
  await strapiPut(`/api/foster-assignments/${assignmentDocumentId}`, {
    status: 'completed',
    end_date: today(),
  })
  if (assignment.animal && assignment.animal.status !== 'reserved' && assignment.animal.status !== 'adopted') {
    await strapiPut(`/api/animals/${assignment.animal.documentId}`, { status: 'available' })
  }
  revalidatePath(`/admin/foster-families/${familyDocumentId}`)
}
