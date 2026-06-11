import Link from 'next/link'
import { notFound } from 'next/navigation'
import AnnouncementForm from '@/components/admin/announcement-form'
import { fetchResource } from '@/lib/strapi'
import type { StrapiAnnouncementRaw } from '@/lib/strapi'
import { updateAnnouncement } from '../actions'
import { ADMIN } from '@/lib/admin-tokens'
import { cardStyle } from '@/lib/admin-styles'

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  const { documentId } = await params

  let announcement: StrapiAnnouncementRaw
  try {
    const res = await fetchResource<StrapiAnnouncementRaw>(`/api/announcements/${documentId}`)
    announcement = res.data
  } catch {
    notFound()
  }

  const boundUpdate = updateAnnouncement.bind(null, documentId)

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/announcements"
          style={{ fontSize: 13, color: ADMIN.inkMuted, textDecoration: 'none' }}
        >
          ← Retour aux annonces
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: ADMIN.ink, marginBottom: 24 }}>
        Modifier : {announcement.title}
      </h1>
      <div style={{ ...cardStyle, padding: 28 }}>
        <AnnouncementForm defaultValues={announcement} action={boundUpdate} />
      </div>
    </div>
  )
}
