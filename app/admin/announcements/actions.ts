'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'

function parseAnnouncementFormData(formData: FormData) {
  return {
    title:       formData.get('title') as string,
    description: formData.get('description') as string | null,
    status:      formData.get('status') as string,
  }
}

export async function createAnnouncement(formData: FormData) {
  await strapiPost('/api/announcements', parseAnnouncementFormData(formData))
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function updateAnnouncement(documentId: string, formData: FormData) {
  await strapiPut(`/api/announcements/${documentId}`, parseAnnouncementFormData(formData))
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function deleteAnnouncement(documentId: string) {
  await strapiDelete(`/api/announcements/${documentId}`)
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}
