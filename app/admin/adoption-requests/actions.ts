'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete, fetchResource } from '@/lib/strapi'
import type { AdoptionRequestStatus, StrapiAdoptionRequestRaw } from '@/lib/strapi'
import { requireAdmin, requireBenevoleOrAdmin, isAdmin } from '@/lib/auth'

// A Membre (bénévole) may only act on requests for animals they are
// referent/backup_referent of — everyone else is scoped by requireAdmin.
async function assertBenevoleOwnsRequest(documentId: string, userId: number) {
  const { data } = await fetchResource<StrapiAdoptionRequestRaw>(
    `/api/adoption-requests/${documentId}?populate[animal][populate][referent]=true&populate[animal][populate][backup_referents]=true`
  )
  const animal = data.animal
  const owns =
    animal?.referent?.id === userId ||
    animal?.backup_referents?.some((u) => u.id === userId)
  if (!owns) {
    throw new Error("Vous n'êtes pas référent de cette demande.")
  }
}

function parseAdoptionFormData(formData: FormData) {
  const animalId       = formData.get('animal_id') as string
  const announcementId = formData.get('announcement_id') as string
  const adopterId     = formData.get('adopter_id') as string
  const referentId    = formData.get('referent_id') as string
  const matchScore    = formData.get('match_score') as string
  const requestDate   = formData.get('request_date') as string
  return {
    message:      (formData.get('message') as string) || null,
    status:       formData.get('status') as AdoptionRequestStatus,
    match_score:  matchScore ? Number(matchScore) : null,
    request_date: requestDate || null,
    animal: animalId || null,
    ...(announcementId ? { announcement: announcementId } : {}),
    ...(adopterId     ? { adopter: Number(adopterId) }   : {}),
    referent: referentId ? Number(referentId) : null,
  }
}

export async function createAdoptionRequest(formData: FormData) {
  await requireAdmin()
  await strapiPost('/api/adoption-requests', parseAdoptionFormData(formData))
  revalidatePath('/admin/adoption-requests')
  redirect('/admin/adoption-requests')
}

export async function updateAdoptionRequest(documentId: string, formData: FormData) {
  const user = await requireBenevoleOrAdmin()
  if (isAdmin(user)) {
    await strapiPut(`/api/adoption-requests/${documentId}`, parseAdoptionFormData(formData))
  } else {
    await assertBenevoleOwnsRequest(documentId, user.id)
    // A bénévole only ever edits status + message, never the animal/announcement/adopter/referent links.
    await strapiPut(`/api/adoption-requests/${documentId}`, {
      status: formData.get('status') as AdoptionRequestStatus,
      message: (formData.get('message') as string) || null,
    })
  }
  revalidatePath('/admin/adoption-requests')
  redirect('/admin/adoption-requests')
}

export async function updateRequestStatus(documentId: string, formData: FormData) {
  const user = await requireBenevoleOrAdmin()
  if (!isAdmin(user)) {
    await assertBenevoleOwnsRequest(documentId, user.id)
  }
  const status = formData.get('status') as AdoptionRequestStatus
  await strapiPut(`/api/adoption-requests/${documentId}`, { status })
  revalidatePath('/admin/adoption-requests')
  redirect('/admin/adoption-requests')
}

export async function deleteAdoptionRequest(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/adoption-requests/${documentId}`)
  revalidatePath('/admin/adoption-requests')
  redirect('/admin/adoption-requests')
}
