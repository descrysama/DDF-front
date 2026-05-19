import Link from 'next/link'
import { fetchAnnouncements } from '@/lib/strapi'
import { deleteAnnouncement } from './actions'
import StatusBadge from '@/components/admin/status-badge'
import { ADMIN } from '@/lib/admin-tokens'

const thStyle: React.CSSProperties = {
  background: '#f8f9fa',
  padding: '10px 14px',
  textAlign: 'left',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: ADMIN.inkMuted,
  borderBottom: `1px solid ${ADMIN.border}`,
}

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 14,
  color: ADMIN.ink,
  borderBottom: `1px solid ${ADMIN.border}`,
  verticalAlign: 'middle',
}

export default async function AdminAnnouncementsPage() {
  const { announcements, total } = await fetchAnnouncements({ limit: 100 })

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: ADMIN.ink, marginBottom: 2 }}>Annonces</h1>
          <p style={{ fontSize: 13, color: ADMIN.inkMuted }}>{total} annonce(s) au total</p>
        </div>
        <Link
          href="/admin/announcements/new"
          style={{
            padding: '9px 18px',
            background: ADMIN.coral,
            color: '#fff',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          + Créer une annonce
        </Link>
      </div>

      <div
        style={{
          background: ADMIN.card,
          border: `1px solid ${ADMIN.border}`,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Titre</th>
              <th style={thStyle}>Statut</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement.documentId}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{announcement.title}</td>
                <td style={tdStyle}>
                  <StatusBadge status={announcement.status} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Link
                      href={`/admin/announcements/${announcement.documentId}`}
                      style={{
                        padding: '5px 12px',
                        background: ADMIN.border,
                        color: ADMIN.ink,
                        borderRadius: 5,
                        fontSize: 13,
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      Modifier
                    </Link>
                    <form action={deleteAnnouncement.bind(null, announcement.documentId)}>
                      <button
                        type="submit"
                        style={{
                          padding: '5px 12px',
                          background: '#fee2e2',
                          color: ADMIN.danger,
                          border: 'none',
                          borderRadius: 5,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {announcements.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: ADMIN.inkMuted }}>
            Aucune annonce trouvée.
          </div>
        )}
      </div>
    </div>
  )
}
