import Link from 'next/link'
import { fetchAdoptionRequests } from '@/lib/strapi'
import { deleteAdoptionRequest } from './actions'
import StatusBadge from '@/components/admin/status-badge'
import { AD, TINT } from '@/lib/admin-tokens'
import { MoreHorizontal } from 'lucide-react'

const MONO: React.CSSProperties = {
  fontFamily: 'Geist Mono, ui-monospace, monospace',
  fontSize: 11.5,
  color: AD.inkMuted,
}

const AVATAR_BG = [
  ['#E8C9B3', '#C99879'],
  ['#D9D3C5', '#9D9485'],
  ['#E0AC9C', '#A87968'],
  ['#F1D7C4', '#D3A88C'],
  ['#D9B898', '#A47A55'],
  ['#C6C8CB', '#7E8189'],
]

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

const GRID_COLS = '32px 1.7fr 1.3fr 0.9fr 0.9fr 130px'

export default async function AdminAdoptionRequestsPage() {
  const { adoptionRequests, total } = await fetchAdoptionRequests({ limit: 100 })

  const pending  = adoptionRequests.filter(r => r.status === 'pending').length
  const approved = adoptionRequests.filter(r => r.status === 'approved').length
  const rejected = adoptionRequests.filter(r => r.status === 'rejected').length
  const inProcess = adoptionRequests.filter(r => !['pending','approved','rejected'].includes(r.status)).length

  const STAT_CARDS = [
    { label: 'Nouvelles',      count: pending,   tint: TINT.pink,  dot: '#E84A77' },
    { label: 'En traitement',  count: inProcess, tint: TINT.peach, dot: '#E0944A' },
    { label: 'Visites prévues',count: 0,         tint: TINT.lilac, dot: '#7B6CC4' },
    { label: 'Validées',       count: approved,  tint: TINT.mint,  dot: '#3FA66E' },
    { label: 'Archivées',      count: rejected,  tint: '#EFEAE2',  dot: '#9C9588' },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <p style={{ ...MONO, marginBottom: 8 }}>Admin / Demandes d&apos;adoption</p>

      {/* Heading */}
      <h1 style={{ fontSize: 28, fontWeight: 600, color: AD.ink, letterSpacing: '-0.025em', marginBottom: 4 }}>
        Demandes d&apos;adoption
      </h1>
      <p style={{ fontSize: 13, color: AD.inkMuted, marginBottom: 22 }}>{total} demande(s) au total</p>

      {/* Stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
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
          {['Demandeur', 'Chat concerné', 'Statut', 'Reçue', 'Actions'].map(col => (
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

        {adoptionRequests.map((req, idx) => {
          const avatarTones = AVATAR_BG[idx % AVATAR_BG.length]
          const username = req.adopter?.username ?? '—'
          const initStr = initials(username)
          const dateStr = req.request_date
            ? new Date(req.request_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—'

          return (
            <div
              key={req.documentId}
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
              {/* Checkbox */}
              <div style={{ width: 16, height: 16, border: `1.5px solid ${AD.border}`, borderRadius: 4 }} />

              {/* Demandeur */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${avatarTones[0]}, ${avatarTones[1]})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {initStr}
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: AD.ink }}>{username}</p>
                  <p style={{ fontSize: 11.5, color: AD.inkSubtle }}>
                    {req.adopter?.email ?? ''}
                  </p>
                </div>
              </div>

              {/* Chat concerné */}
              <div>
                <p style={{ fontSize: 13, color: AD.ink, fontWeight: 500 }}>
                  {req.announcement?.title ?? '—'}
                </p>
              </div>

              {/* Statut */}
              <StatusBadge status={req.status} />

              {/* Reçue */}
              <p style={{ fontSize: 12.5, color: AD.inkMuted }}>{dateStr}</p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Link
                  href={`/admin/adoption-requests/${req.documentId}`}
                  style={{
                    padding: '5px 12px',
                    background: AD.surfaceAlt,
                    color: AD.ink,
                    borderRadius: 6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: `1px solid ${AD.border}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Ouvrir
                </Link>
                <form action={deleteAdoptionRequest.bind(null, req.documentId)}>
                  <button
                    type="submit"
                    title="Plus d'actions"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: `1px solid ${AD.border}`,
                      background: AD.surface,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <MoreHorizontal size={14} color={AD.inkMuted} />
                  </button>
                </form>
              </div>
            </div>
          )
        })}

        {adoptionRequests.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucune demande d&apos;adoption trouvée.
          </div>
        )}

        {/* Pagination footer */}
        {adoptionRequests.length > 0 && (
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
              Affichage de 1 à {adoptionRequests.length} sur {total} résultats
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
      </div>
    </div>
  )
}
