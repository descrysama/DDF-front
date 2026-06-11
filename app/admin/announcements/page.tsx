import { fetchAnnouncements } from '@/lib/strapi'
import { deleteAnnouncement } from './actions'
import StatusBadge from '@/components/admin/status-badge'
import PageHeader from '@/components/admin/page-header'
import StatCard from '@/components/admin/stat-card'
import ActionButtons from '@/components/admin/action-buttons'
import { AD } from '@/lib/admin-tokens'

const GRID_COLS = '1.8fr 0.8fr 1fr 110px'

export default async function AdminAnnouncementsPage() {
  const { announcements, total } = await fetchAnnouncements({ limit: 100 })

  const open   = announcements.filter(a => a.status === 'open').length
  const draft  = announcements.filter(a => a.status === 'draft').length
  const closed = announcements.filter(a => a.status === 'closed').length

  const STAT_CARDS = [
    { label: 'Publiées',   count: open,   dot: '#3FA66E' },
    { label: 'Brouillons', count: draft,  dot: '#E0944A' },
    { label: 'Fermées',    count: closed, dot: '#9C9588' },
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
      <div
        style={{
          background: AD.surface,
          border: `1px solid ${AD.border}`,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
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
          {['Titre', 'Statut', 'Date', 'Actions'].map(col => (
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

            {/* Statut */}
            <StatusBadge status={announcement.status} />

            {/* Date — not in type, show dash */}
            <p style={{ fontSize: 12.5, color: AD.inkMuted }}>—</p>

            {/* Actions */}
            <ActionButtons
              editHref={`/admin/announcements/${announcement.documentId}`}
              deleteAction={deleteAnnouncement.bind(null, announcement.documentId)}
            />
          </div>
        ))}

        {announcements.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucune annonce trouvée.
          </div>
        )}
      </div>
    </div>
  )
}
