import Link from 'next/link'
import { notFound } from 'next/navigation'
import AnnouncementForm from '@/components/admin/announcement-form'
import { fetchResource, fetchAnimals, fetchConstraints } from '@/lib/strapi'
import type { StrapiAnnouncementRaw } from '@/lib/strapi'
import { updateAnnouncement } from '../actions'
import { requireAdmin } from '@/lib/auth'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  await requireAdmin()
  const { documentId } = await params

  let announcement: StrapiAnnouncementRaw
  try {
    const res = await fetchResource<StrapiAnnouncementRaw>(
      `/api/announcements/${documentId}?status=draft&populate[animals]=true&populate[constraints]=true`
    )
    announcement = res.data
  } catch {
    notFound()
  }

  const [{ animals }, constraints] = await Promise.all([
    fetchAnimals({ limit: 200 }),
    fetchConstraints(),
  ])

  const boundUpdate = updateAnnouncement.bind(null, documentId)

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/announcements"
          style={{ fontSize: 13, color: AD.inkMuted, textDecoration: 'none' }}
        >
          ← Retour aux annonces
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 24 }}>
        Modifier : {announcement.title}
      </h1>
      <Card className="p-7 max-w-2xl hover:translate-y-0">
        <AnnouncementForm
          defaultValues={{
            ...announcement,
            animalDocumentIds: (announcement.animals ?? []).map((a) => a.documentId),
            constraintDocumentIds: (announcement.constraints ?? []).map((c) => c.documentId),
          }}
          animalOptions={animals.map((a) => ({ documentId: a.documentId, name: a.name }))}
          constraintOptions={constraints.map((c) => ({ documentId: c.documentId, name: c.name }))}
          action={boundUpdate}
        />
      </Card>
    </div>
  )
}
