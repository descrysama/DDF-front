import Link from 'next/link'
import { fetchAnnouncements } from '@/lib/strapi'
import { deleteAnnouncement } from './actions'
import StatusBadge from '@/components/admin/status-badge'
import { AD, TINT } from '@/lib/admin-tokens'
import { Pencil, Trash2 } from 'lucide-react'

const MONO: React.CSSProperties = {
  fontFamily: 'Geist Mono, ui-monospace, monospace',
  fontSize: 11.5,
  color: AD.inkMuted,
}

const GRID_COLS = '1.8fr 0.8fr 1fr 110px'

export default async function AdminAnnouncementsPage() {
  const { announcements, total } = await fetchAnnouncements({ limit: 100 })

  const open   = announcements.filter(a => a.status === 'open').length
  const draft  = announcements.filter(a => a.status === 'draft').length
  const closed = announcements.filter(a => a.status === 'closed').length

  const STAT_CARDS = [
    { label: 'Publiées',   count: open,   tint: TINT.mint,  dot: '#3FA66E' },
    { label: 'Brouillons', count: draft,  tint: TINT.peach, dot: '#E0944A' },
    { label: 'Fermées',    count: closed, tint: '#EFEAE2',  dot: '#9C9588' },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <p style={{ ...MONO, marginBottom: 8 }}>Admin / Annonces</p>

      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: AD.ink, letterSpacing: '-0.025em', marginBottom: 4 }}>
            Annonces
          </h1>
          <p style={{ fontSize: 13, color: AD.inkMuted }}>{total} annonce(s) au total</p>
        </div>
        <Link
          href="/admin/announcements/new"
          style={{
            padding: '9px 18px',
            background: AD.coral,
            color: '#fff',
            borderRadius: 7,
            fontWeight: 600,
            fontSize: 13.5,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          + Créer une annonce
        </Link>
      </div>

      {/* Stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 22,
        }}
      >
        {STAT_CARDS.map(({ label, count, tint, dot }) => (
          <div
            key={label}
            style={{
              background: AD.surface,
              border: `1px solid ${AD.border}`,
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: dot, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 11.5, color: AD.inkMuted }}>{label}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: AD.ink, lineHeight: 1.2 }}>{count}</p>
            </div>
          </div>
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
            <div style={{ display: 'flex', gap: 6 }}>
              <Link
                href={`/admin/announcements/${announcement.documentId}`}
                title="Modifier"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: TINT.peach,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  flexShrink: 0,
                }}
              >
                <Pencil size={13} color="#E0944A" />
              </Link>
              <form action={deleteAnnouncement.bind(null, announcement.documentId)}>
                <button
                  type="submit"
                  title="Supprimer"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: TINT.pink,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={13} color={AD.coralInk} />
                </button>
              </form>
            </div>
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
