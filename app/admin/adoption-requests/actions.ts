'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'
import type { AdoptionRequestStatus } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'

function parseAdoptionFormData(formData: FormData) {
  const announcementId = formData.get('announcement_id') as string
  const adopterId     = formData.get('adopter_id') as string
  const matchScore    = formData.get('match_score') as string
  const requestDate   = formData.get('request_date') as string
  return {
    message:      (formData.get('message') as string) || null,
    status:       formData.get('status') as AdoptionRequestStatus,
    match_score:  matchScore ? Number(matchScore) : null,
    request_date: requestDate || null,
    ...(announcementId ? { announcement: announcementId } : {}),
    ...(adopterId     ? { adopter: Number(adopterId) }   : {}),
  }
}

export async function createAdoptionRequest(formData: FormData) {
  await requireAdmin()
  await strapiPost('/api/adoption-requests', parseAdoptionFormData(formData))
  revalidatePath('/admin/adoption-requests')
  redirect('/admin/adoption-requests')
}

export async function updateAdoptionRequest(documentId: string, formData: FormData) {
  await requireAdmin()
  await strapiPut(`/api/adoption-requests/${documentId}`, parseAdoptionFormData(formData))
  revalidatePath('/admin/adoption-requests')
  redirect('/admin/adoption-requests')
}

export async function updateRequestStatus(documentId: string, formData: FormData) {
  await requireAdmin()
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
