'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'

function parseAnnouncementFormData(formData: FormData) {
  return {
    title:       formData.get('title') as string,
    description: formData.get('description') as string | null,
    status:      formData.get('status') as string,
  }
}

export async function createAnnouncement(formData: FormData) {
  await requireAdmin()
  await strapiPost('/api/announcements', parseAnnouncementFormData(formData))
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function updateAnnouncement(documentId: string, formData: FormData) {
  await requireAdmin()
  await strapiPut(`/api/announcements/${documentId}`, parseAnnouncementFormData(formData))
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function deleteAnnouncement(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/announcements/${documentId}`)
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}
