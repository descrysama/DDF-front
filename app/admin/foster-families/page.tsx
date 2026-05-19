import Link from 'next/link'
import { fetchFosterFamilies } from '@/lib/strapi'
import { deleteFosterFamily } from './actions'
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

function BoolIcon({ value }: { value: boolean }) {
  return (
    <span style={{ color: value ? ADMIN.success : ADMIN.inkMuted, fontWeight: 600 }}>
      {value ? 'Oui' : 'Non'}
    </span>
  )
}

export default async function AdminFosterFamiliesPage() {
  const { fosterFamilies, total } = await fetchFosterFamilies({ limit: 100 })

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: ADMIN.ink, marginBottom: 2 }}>
          Familles d&apos;accueil
        </h1>
        <p style={{ fontSize: 13, color: ADMIN.inkMuted }}>{total} famille(s) au total</p>
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
              <th style={thStyle}>Famille</th>
              <th style={thStyle}>Adresse</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Capacité</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Enfants</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Chiens</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Chats</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Hébergés</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fosterFamilies.map((family) => (
              <tr key={family.documentId}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600 }}>{family.user?.username ?? '—'}</div>
                  <div style={{ fontSize: 12, color: ADMIN.inkMuted }}>{family.user?.email ?? ''}</div>
                </td>
                <td style={{ ...tdStyle, maxWidth: 200, color: ADMIN.inkMuted, fontSize: 13 }}>
                  {family.address}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{family.max_capacity}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <BoolIcon value={family.has_children} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <BoolIcon value={family.has_dogs} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <BoolIcon value={family.has_cats} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {family.foster_assignments?.length ?? 0}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Link
                      href={`/admin/foster-families/${family.documentId}`}
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
                    <form action={deleteFosterFamily.bind(null, family.documentId)}>
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
        {fosterFamilies.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: ADMIN.inkMuted }}>
            Aucune famille d&apos;accueil trouvée.
          </div>
        )}
      </div>
    </div>
  )
}
