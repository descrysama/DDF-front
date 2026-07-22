import Link from 'next/link'
import AnnouncementForm from '@/components/admin/announcement-form'
import { createAnnouncement } from '../actions'
import { requireAdmin } from '@/lib/auth'
import { fetchAnimals, fetchConstraints } from '@/lib/strapi'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

export default async function NewAnnouncementPage({
  searchParams,
}: {
  searchParams: Promise<{ animal?: string }>
}) {
  await requireAdmin()
  const { animal } = await searchParams

  const [{ animals }, constraints] = await Promise.all([
    fetchAnimals({ limit: 200 }),
    fetchConstraints(),
  ])

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
        Créer une annonce
      </h1>
      <Card className="p-7 max-w-2xl hover:translate-y-0">
        <AnnouncementForm
          action={createAnnouncement}
          animalOptions={animals.map((a) => ({ documentId: a.documentId, name: a.name }))}
          constraintOptions={constraints.map((c) => ({ documentId: c.documentId, name: c.name }))}
          defaultValues={animal ? { animalDocumentIds: [animal] } : undefined}
        />
      </Card>
    </div>
  )
}
