import Link from 'next/link'
import { fetchAdoptionRequests } from '@/lib/strapi'
import { deleteAdoptionRequest } from './actions'
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

export default async function AdminAdoptionRequestsPage() {
  const { adoptionRequests, total } = await fetchAdoptionRequests({ limit: 100 })

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: ADMIN.ink, marginBottom: 2 }}>
          Demandes d&apos;adoption
        </h1>
        <p style={{ fontSize: 13, color: ADMIN.inkMuted }}>{total} demande(s) au total</p>
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
              <th style={thStyle}>Annonce</th>
              <th style={thStyle}>Adoptant</th>
              <th style={thStyle}>Statut</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Score</th>
              <th style={thStyle}>Date</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adoptionRequests.map((req) => (
              <tr key={req.documentId}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  {req.announcement?.title ?? '—'}
                </td>
                <td style={tdStyle}>
                  <div>{req.adopter?.username ?? '—'}</div>
                  <div style={{ fontSize: 12, color: ADMIN.inkMuted }}>{req.adopter?.email ?? ''}</div>
                </td>
                <td style={tdStyle}>
                  <StatusBadge status={req.status} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {req.match_score != null ? (
                    <span
                      style={{
                        fontWeight: 700,
                        color: req.match_score >= 70 ? ADMIN.success : req.match_score >= 40 ? ADMIN.warning : ADMIN.danger,
                      }}
                    >
                      {req.match_score}%
                    </span>
                  ) : (
                    <span style={{ color: ADMIN.inkMuted }}>—</span>
                  )}
                </td>
                <td style={{ ...tdStyle, color: ADMIN.inkMuted, fontSize: 13 }}>
                  {req.request_date
                    ? new Date(req.request_date).toLocaleDateString('fr-FR')
                    : '—'}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Link
                      href={`/admin/adoption-requests/${req.documentId}`}
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
                      Détail
                    </Link>
                    <form action={deleteAdoptionRequest.bind(null, req.documentId)}>
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
        {adoptionRequests.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: ADMIN.inkMuted }}>
            Aucune demande d&apos;adoption trouvée.
          </div>
        )}
      </div>
    </div>
  )
}
