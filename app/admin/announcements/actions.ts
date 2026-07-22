'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete, publishAnnouncement, unpublishAnnouncement } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'

function parseAnnouncementFormData(formData: FormData) {
  return {
    title:       formData.get('title') as string,
    description: formData.get('description') as string | null,
    status:      formData.get('status') as string,
    animals:     formData.getAll('animals') as string[],
    constraints: formData.getAll('constraints') as string[],
  }
}

// Créées/éditées en brouillon (`?status=draft`) : le contenu par défaut de la
// REST API core (sans query `status`) est `published`, donc sans ce paramètre
// explicite une simple sauvegarde publierait immédiatement l'annonce. Un
// bénévole doit cliquer sur "Publier" pour la rendre visible publiquement.
export async function createAnnouncement(formData: FormData) {
  await requireAdmin()
  await strapiPost('/api/announcements?status=draft', parseAnnouncementFormData(formData))
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function updateAnnouncement(documentId: string, formData: FormData) {
  await requireAdmin()
  await strapiPut(`/api/announcements/${documentId}?status=draft`, parseAnnouncementFormData(formData))
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function deleteAnnouncement(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/announcements/${documentId}`)
  revalidatePath('/admin/announcements')
  redirect('/admin/announcements')
}

export async function publishAnnouncementAction(documentId: string) {
  await requireAdmin()
  await publishAnnouncement(documentId)
  revalidatePath('/admin/announcements')
}

export async function unpublishAnnouncementAction(documentId: string) {
  await requireAdmin()
  await unpublishAnnouncement(documentId)
  revalidatePath('/admin/announcements')
}
