import { fetchFosterFamilies } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'
import { deleteFosterFamily } from './actions'
import PageHeader from '@/components/admin/page-header'
import StatCard from '@/components/admin/stat-card'
import ActionButtons from '@/components/admin/action-buttons'
import { AD, TINT } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

const GRID_COLS = '1.6fr 1.4fr 80px 80px 80px 90px 80px 90px 110px'

function BoolPill({ value }: { value: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 4,
        background: value ? TINT.mint : AD.surfaceAlt,
        color: value ? '#1E6B43' : AD.inkSubtle,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: value ? '#3FA66E' : AD.inkSubtle,
        }}
      />
      {value ? 'Oui' : 'Non'}
    </span>
  )
}

export default async function AdminFosterFamiliesPage() {
  await requireAdmin()
  const { fosterFamilies, total } = await fetchFosterFamilies({ limit: 100 })

  const withAssignments = fosterFamilies.filter(f => (f.foster_assignments?.length ?? 0) > 0)
  const totalHosted = fosterFamilies.reduce((s, f) => s + (f.foster_assignments?.length ?? 0), 0)
  const availableCount = fosterFamilies.filter(f => f.is_available).length

  const STAT_CARDS = [
    { label: 'Total familles',   count: total,                  dot: '#7B6CC4' },
    { label: 'Familles actives', count: withAssignments.length, dot: '#3FA66E' },
    { label: 'Disponibles',      count: availableCount,         dot: '#3FA66E' },
    { label: 'Animaux hébergés', count: totalHosted,            dot: '#E0944A' },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      <PageHeader
        breadcrumb="Admin / Familles d'accueil"
        title="Familles d'accueil"
        subtitle={`${total} famille(s) au total`}
        action={{ label: '+ Ajouter une famille', href: '/admin/foster-families/new' }}
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
          {['Famille', 'Adresse', 'Capacité', 'Enfants', 'Chiens', 'Chats', 'Disponible', 'Hébergés', 'Actions'].map(col => (
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

        {fosterFamilies.map((family) => (
          <div
            key={family.documentId}
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
            {/* Famille */}
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: AD.ink }}>{family.user?.username ?? '—'}</p>
              <p style={{ fontSize: 11.5, color: AD.inkSubtle }}>{family.user?.email ?? ''}</p>
            </div>

            {/* Adresse */}
            <p style={{ fontSize: 12.5, color: AD.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {family.address}
            </p>

            {/* Capacité */}
            <p style={{ fontSize: 13, color: AD.ink, fontWeight: 600, textAlign: 'center' }}>
              {family.max_capacity}
            </p>

            {/* Enfants */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <BoolPill value={family.has_children} />
            </div>

            {/* Chiens */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <BoolPill value={family.has_dogs} />
            </div>

            {/* Chats */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <BoolPill value={family.has_cats} />
            </div>

            {/* Disponible */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <BoolPill value={family.is_available} />
            </div>

            {/* Hébergés */}
            <p style={{ fontSize: 13, color: AD.ink, fontWeight: 600, textAlign: 'center' }}>
              {family.foster_assignments?.length ?? 0}
            </p>

            {/* Actions */}
            <ActionButtons
              editHref={`/admin/foster-families/${family.documentId}`}
              deleteAction={deleteFosterFamily.bind(null, family.documentId)}
            />
          </div>
        ))}

        {fosterFamilies.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucune famille d&apos;accueil trouvée.
          </div>
        )}
      </Card>
    </div>
  )
}
