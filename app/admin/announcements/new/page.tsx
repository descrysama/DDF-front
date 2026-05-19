import Link from 'next/link'
import AnnouncementForm from '@/components/admin/announcement-form'
import { createAnnouncement } from '../actions'
import { ADMIN } from '@/lib/admin-tokens'

export default function NewAnnouncementPage() {
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
        Créer une annonce
      </h1>
      <div
        style={{
          background: ADMIN.card,
          border: `1px solid ${ADMIN.border}`,
          borderRadius: 10,
          padding: 28,
        }}
      >
        <AnnouncementForm action={createAnnouncement} />
      </div>
    </div>
  )
}
