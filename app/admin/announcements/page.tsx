import { fetchAnnouncementsAdmin } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'
import { deleteAnnouncement, publishAnnouncementAction, unpublishAnnouncementAction } from './actions'
import PageHeader from '@/components/admin/page-header'
import StatCard from '@/components/admin/stat-card'
import ActionButtons from '@/components/admin/action-buttons'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

const GRID_COLS = '1.6fr 1fr 0.7fr 220px'

export default async function AdminAnnouncementsPage() {
  await requireAdmin()
  const { announcements, total } = await fetchAnnouncementsAdmin({ limit: 100 })

  const published = announcements.filter(a => a.publishedAt).length
  const drafts    = announcements.filter(a => !a.publishedAt).length
  const closed    = announcements.filter(a => a.status === 'closed').length

  const STAT_CARDS = [
    { label: 'Publiées',   count: published, dot: '#3FA66E' },
    { label: 'Brouillons', count: drafts,    dot: '#E0944A' },
    { label: 'Fermées',    count: closed,    dot: '#9C9588' },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      <PageHeader
        breadcrumb="Admin / Annonces"
        title="Annonces"
        subtitle={`${total} annonce(s) au total`}
        action={{ label: '+ Créer une annonce', href: '/admin/announcements/new' }}
      />

      {/* Stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 22,
        }}
      >
        {STAT_CARDS.map(({ label, count, dot }) => (
          <StatCard key={label} label={label} count={count} dot={dot} />
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden hover:translate-y-0">
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: GRID_COLS,
            alignItems: 'center',
            background: AD.surfaceAlt,
            padding: '10px 18px',
            gap: 12,
            borderBottom: `1px solid ${AD.border}`,
          }}
        >
          {['Titre', 'Chats', 'Publication', 'Actions'].map(col => (
            <div
              key={col}
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: AD.inkMuted,
              }}
            >
              {col}
            </div>
          ))}
        </div>

        {announcements.map((announcement) => (
          <div
            key={announcement.documentId}
            style={{
              display: 'grid',
              gridTemplateColumns: GRID_COLS,
              alignItems: 'center',
              padding: '12px 18px',
              gap: 12,
              borderBottom: `1px solid ${AD.border}`,
              background: AD.surface,
            }}
          >
            {/* Titre */}
            <p style={{ fontSize: 13.5, fontWeight: 600, color: AD.ink }}>{announcement.title}</p>

            {/* Chats liés */}
            <p style={{ fontSize: 12.5, color: AD.inkMuted }}>
              {(announcement.animals ?? []).map((a) => a.name).join(', ') || '—'}
            </p>

            {/* Publication */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 9px',
                borderRadius: 999,
                width: 'fit-content',
                background: announcement.publishedAt ? '#E0F0E8' : '#FCE9D9',
                color: announcement.publishedAt ? '#3FA66E' : '#B5722A',
              }}
            >
              {announcement.publishedAt ? 'Publiée' : 'Brouillon'}
            </span>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <form
                action={
                  announcement.publishedAt
                    ? unpublishAnnouncementAction.bind(null, announcement.documentId)
                    : publishAnnouncementAction.bind(null, announcement.documentId)
                }
              >
                <button
                  type="submit"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: `1px solid ${AD.border}`,
                    background: AD.surface,
                    color: AD.ink,
                    cursor: 'pointer',
                  }}
                >
                  {announcement.publishedAt ? 'Dépublier' : 'Publier'}
                </button>
              </form>
              <ActionButtons
                editHref={`/admin/announcements/${announcement.documentId}`}
                deleteAction={deleteAnnouncement.bind(null, announcement.documentId)}
              />
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucune annonce trouvée.
          </div>
        )}
      </Card>
    </div>
  )
}
