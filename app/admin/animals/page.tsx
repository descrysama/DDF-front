import { fetchAnimals, fetchAdoptionRequests } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'
import { deleteAnimal } from './actions'
import StatusBadge from '@/components/admin/status-badge'
import PageHeader from '@/components/admin/page-header'
import StatCard from '@/components/admin/stat-card'
import ActionButtons from '@/components/admin/action-buttons'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'
import Link from 'next/link'

const AVATAR_TONES: [string, string][] = [
  ['#E8C9B3', '#C99879'],
  ['#D9D3C5', '#9D9485'],
  ['#E0AC9C', '#A87968'],
  ['#F1D7C4', '#D3A88C'],
  ['#D9B898', '#A47A55'],
  ['#C6C8CB', '#7E8189'],
  ['#3C3F4E', '#1F2235'],
  ['#C0B095', '#876D52'],
]

const GRID_COLS = '32px 1.6fr 0.9fr 0.9fr 1.1fr 110px'

export default async function AdminAnimalsPage() {
  await requireAdmin()
  const [{ animals, total }, adoptionData] = await Promise.all([
    fetchAnimals({ limit: 100 }),
    fetchAdoptionRequests({ limit: 1 }),
  ])

  const available = animals.filter(a => a.status === 'available').length
  const in_foster = animals.filter(a => a.status === 'in_foster').length
  const reserved  = animals.filter(a => a.status === 'reserved').length

  const STAT_CARDS = [
    { label: 'Publiés',              count: available,          dot: '#3FA66E' },
    { label: "En famille d'accueil", count: in_foster,          dot: '#E0944A' },
    { label: 'Réservés',             count: reserved,           dot: '#7B6CC4' },
    { label: 'Demandes en attente',  count: adoptionData.total, dot: '#E84A77' },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      <PageHeader
        breadcrumb="Admin / Chats"
        title="Chats"
        subtitle={`${total} chat(s) au total`}
        action={{ label: '+ Ajouter un chat', href: '/admin/animals/new' }}
      />

      {/* Stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginBottom: 22,
        }}
      >
        {STAT_CARDS.map(({ label, count, dot }) => (
          <StatCard key={label} label={label} count={count} dot={dot} />
        ))}
      </div>

      {/* Table container */}
      <Card className="overflow-hidden hover:translate-y-0">
        {/* Header row */}
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
          <div />
          {['Chat', 'Catégorie', 'Âge', 'Statut', 'Actions'].map(col => (
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

        {/* Rows */}
        {animals.map((animal, idx) => {
          const tones = AVATAR_TONES[idx % AVATAR_TONES.length]
          return (
            <div
              key={animal.documentId}
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
              {/* Checkbox placeholder */}
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1.5px solid ${AD.border}`,
                  borderRadius: 4,
                  background: AD.surface,
                }}
              />

              {/* Chat — avatar + name + documentId */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    background: `linear-gradient(135deg, ${tones[0]}, ${tones[1]})`,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: AD.ink }}>{animal.name}</p>
                  <p style={{ fontSize: 11, color: AD.inkSubtle, fontFamily: 'Geist Mono, ui-monospace, monospace' }}>
                    {animal.documentId.slice(0, 10)}…
                  </p>
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: animal.tagStyle === 'coral' ? AD.coral : AD.ink,
                    color: '#fff',
                  }}
                >
                  {animal.tag}
                </span>
              </div>

              {/* Âge */}
              <p style={{ fontSize: 13, color: AD.ink }}>{animal.age}</p>

              {/* Statut */}
              <StatusBadge status={animal.status} />

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Link
                  href={`/admin/animals/${animal.documentId}`}
                  title="Voir"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: `1px solid ${AD.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    background: AD.surface,
                    flexShrink: 0,
                  }}
                >
                  <Search size={13} color={AD.inkMuted} />
                </Link>
                <ActionButtons
                  editHref={`/admin/animals/${animal.documentId}`}
                  deleteAction={deleteAnimal.bind(null, animal.documentId)}
                />
              </div>
            </div>
          )
        })}

        {animals.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucun chat trouvé.
          </div>
        )}

        {/* Pagination footer */}
        {animals.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderTop: `1px solid ${AD.border}`,
            }}
          >
            <p style={{ fontSize: 12.5, color: AD.inkMuted }}>
              Affichage de 1 à {animals.length} sur {total} résultats
            </p>
            <div style={{ display: 'flex', gap: 4 }}>
              {['←', '1', '→'].map(btn => (
                <button
                  key={btn}
                  disabled
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: `1px solid ${AD.border}`,
                    background: btn === '1' ? AD.ink : AD.surface,
                    color: btn === '1' ? '#fff' : AD.inkMuted,
                    fontSize: 12.5,
                    fontWeight: btn === '1' ? 700 : 400,
                    cursor: 'default',
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
