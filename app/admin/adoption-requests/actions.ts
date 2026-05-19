'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPut, strapiDelete } from '@/lib/strapi'
import type { AdoptionRequestStatus } from '@/lib/strapi'

export async function updateRequestStatus(documentId: string, formData: FormData) {
  const status = formData.get('status') as AdoptionRequestStatus
  await strapiPut(`/api/adoption-requests/${documentId}`, { status })
  revalidatePath('/admin/adoption-requests')
  redirect('/admin/adoption-requests')
}

export async function deleteAdoptionRequest(documentId: string) {
  await strapiDelete(`/api/adoption-requests/${documentId}`)
  revalidatePath('/admin/adoption-requests')
  redirect('/admin/adoption-requests')
}
