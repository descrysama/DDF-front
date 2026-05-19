import Link from 'next/link'
import { fetchFosterFamilies } from '@/lib/strapi'
import { deleteFosterFamily } from './actions'
import { AD, TINT } from '@/lib/admin-tokens'
import { Pencil, Trash2 } from 'lucide-react'

const MONO: React.CSSProperties = {
  fontFamily: 'Geist Mono, ui-monospace, monospace',
  fontSize: 11.5,
  color: AD.inkMuted,
}

const GRID_COLS = '1.6fr 1.4fr 80px 80px 80px 80px 80px 110px'

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
  const { fosterFamilies, total } = await fetchFosterFamilies({ limit: 100 })

  const withAssignments = fosterFamilies.filter(f => (f.foster_assignments?.length ?? 0) > 0)
  const totalHosted = fosterFamilies.reduce((s, f) => s + (f.foster_assignments?.length ?? 0), 0)

  const STAT_CARDS = [
    { label: 'Total familles',    count: total,                  tint: TINT.lilac, dot: '#7B6CC4' },
    { label: 'Familles actives',  count: withAssignments.length, tint: TINT.mint,  dot: '#3FA66E' },
    { label: 'Animaux hébergés',  count: totalHosted,            tint: TINT.peach, dot: '#E0944A' },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <p style={{ ...MONO, marginBottom: 8 }}>Admin / Familles d&apos;accueil</p>

      {/* Heading */}
      <h1 style={{ fontSize: 28, fontWeight: 600, color: AD.ink, letterSpacing: '-0.025em', marginBottom: 4 }}>
        Familles d&apos;accueil
      </h1>
      <p style={{ fontSize: 13, color: AD.inkMuted, marginBottom: 22 }}>{total} famille(s) au total</p>

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
          {['Famille', 'Adresse', 'Capacité', 'Enfants', 'Chiens', 'Chats', 'Hébergés', 'Actions'].map(col => (
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

            {/* Hébergés */}
            <p style={{ fontSize: 13, color: AD.ink, fontWeight: 600, textAlign: 'center' }}>
              {family.foster_assignments?.length ?? 0}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6 }}>
              <Link
                href={`/admin/foster-families/${family.documentId}`}
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
              <form action={deleteFosterFamily.bind(null, family.documentId)}>
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

        {fosterFamilies.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucune famille d&apos;accueil trouvée.
          </div>
        )}
      </div>
    </div>
  )
}
