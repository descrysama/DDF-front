import { fetchAdoptionRequests } from '@/lib/strapi'
import { deleteAdoptionRequest } from './actions'
import StatusBadge from '@/components/admin/status-badge'
import PageHeader from '@/components/admin/page-header'
import StatCard from '@/components/admin/stat-card'
import ActionButtons from '@/components/admin/action-buttons'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

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

const GRID_COLS = '32px 1.5fr 1.1fr 0.8fr 0.7fr 0.8fr 130px'

export default async function AdminAdoptionRequestsPage() {
  const { adoptionRequests, total } = await fetchAdoptionRequests({ limit: 100 })

  const pending  = adoptionRequests.filter(r => r.status === 'pending').length
  const approved = adoptionRequests.filter(r => r.status === 'approved').length
  const rejected = adoptionRequests.filter(r => r.status === 'rejected').length
  const inProcess = adoptionRequests.filter(r => !['pending','approved','rejected'].includes(r.status)).length

  const STAT_CARDS = [
    { label: 'Nouvelles',       count: pending,   dot: '#E84A77' },
    { label: 'En traitement',   count: inProcess, dot: '#E0944A' },
    { label: 'Visites prévues', count: 0,         dot: '#7B6CC4' },
    { label: 'Validées',        count: approved,  dot: '#3FA66E' },
    { label: 'Archivées',       count: rejected,  dot: '#9C9588' },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      <PageHeader
        breadcrumb="Admin / Demandes d'adoption"
        title="Demandes d'adoption"
        subtitle={`${total} demande(s) au total`}
        action={{ label: '+ Nouvelle demande', href: '/admin/adoption-requests/new' }}
      />

      {/* Stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
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
          {['Demandeur', 'Chat concerné', 'Statut', 'Score', 'Reçue', 'Actions'].map(col => (
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
                  {req.animal?.name ?? '—'}
                </p>
                {req.announcement && (
                  <p style={{ fontSize: 11.5, color: AD.inkSubtle }}>
                    via {req.announcement.title}
                  </p>
                )}
              </div>

              {/* Statut */}
              <StatusBadge status={req.status} />

              {/* Score */}
              <p style={{ fontSize: 12.5, fontWeight: 600, color: AD.inkMuted }}>
                {req.match_score != null ? `${req.match_score}%` : '—'}
              </p>

              {/* Reçue */}
              <p style={{ fontSize: 12.5, color: AD.inkMuted }}>{dateStr}</p>

              {/* Actions */}
              <ActionButtons
                editHref={`/admin/adoption-requests/${req.documentId}`}
                deleteAction={deleteAdoptionRequest.bind(null, req.documentId)}
              />
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
      </Card>
    </div>
  )
}
