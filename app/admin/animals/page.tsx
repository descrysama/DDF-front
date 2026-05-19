import Link from 'next/link'
import { fetchAnimals } from '@/lib/strapi'
import { deleteAnimal } from './actions'
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

export default async function AdminAnimalsPage() {
  const { animals, total } = await fetchAnimals({ limit: 100 })

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: ADMIN.ink, marginBottom: 2 }}>Animaux</h1>
          <p style={{ fontSize: 13, color: ADMIN.inkMuted }}>{total} animal(aux) au total</p>
        </div>
        <Link
          href="/admin/animals/new"
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
          + Ajouter un animal
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
              <th style={thStyle}>Nom</th>
              <th style={thStyle}>Âge</th>
              <th style={thStyle}>Genre</th>
              <th style={thStyle}>Race</th>
              <th style={thStyle}>Statut</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => (
              <tr key={animal.documentId}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{animal.name}</td>
                <td style={tdStyle}>{animal.age}</td>
                <td style={tdStyle}>{animal.sex}</td>
                <td style={{ ...tdStyle, color: ADMIN.inkMuted }}>—</td>
                <td style={tdStyle}>
                  <StatusBadge status={animal.status} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Link
                      href={`/admin/animals/${animal.documentId}`}
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
                    <form action={deleteAnimal.bind(null, animal.documentId)}>
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
        {animals.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: ADMIN.inkMuted }}>
            Aucun animal trouvé.
          </div>
        )}
      </div>
    </div>
  )
}
