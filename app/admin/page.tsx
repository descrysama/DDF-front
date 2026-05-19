import { fetchAnimals, fetchAnnouncements, fetchFosterFamilies, fetchAdoptionRequests } from '@/lib/strapi'
import { ADMIN } from '@/lib/admin-tokens'

const CARDS = [
  { label: 'Animaux',              color: '#fde2ec', icon: '🐱' },
  { label: 'Annonces',             color: '#e0f0e8', icon: '📢' },
  { label: "Familles d'accueil",   color: '#e8e5f4', icon: '🏡' },
  { label: "Demandes d'adoption",  color: '#fef3c7', icon: '📋' },
]

export default async function AdminDashboardPage() {
  const [animals, announcements, fosterFamilies, adoptionRequests] = await Promise.all([
    fetchAnimals({ limit: 1 }),
    fetchAnnouncements({ limit: 1 }),
    fetchFosterFamilies({ limit: 1 }),
    fetchAdoptionRequests({ limit: 1 }),
  ])

  const totals = [
    animals.total,
    announcements.total,
    fosterFamilies.total,
    adoptionRequests.total,
  ]

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: ADMIN.ink, marginBottom: 8 }}>
        Tableau de bord
      </h1>
      <p style={{ color: ADMIN.inkMuted, marginBottom: 32, fontSize: 14 }}>
        Vue d&apos;ensemble des ressources
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 20,
        }}
      >
        {CARDS.map(({ label, color, icon }, i) => (
          <div
            key={label}
            style={{
              background: ADMIN.card,
              border: `1px solid ${ADMIN.border}`,
              borderRadius: 10,
              padding: '24px 20px',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: 14,
              }}
            >
              {icon}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: ADMIN.ink, lineHeight: 1 }}>
              {totals[i]}
            </div>
            <div style={{ fontSize: 13, color: ADMIN.inkMuted, marginTop: 4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
