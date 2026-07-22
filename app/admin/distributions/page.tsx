import { fetchDistributions } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'
import { deleteDistribution } from './actions'
import PageHeader from '@/components/admin/page-header'
import StatCard from '@/components/admin/stat-card'
import ActionButtons from '@/components/admin/action-buttons'
import StatusBadge from '@/components/admin/status-badge'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

const GRID_COLS = '1fr 1.6fr 1fr 1fr 110px'

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function AdminDistributionsPage() {
  await requireAdmin()
  const { distributions, total } = await fetchDistributions({ limit: 100 })

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = distributions.filter((d) => d.status === 'planned' && d.date >= today)
  const totalVolunteerSignups = distributions.reduce((sum, d) => sum + (d.volunteers?.length ?? 0), 0)

  const STAT_CARDS = [
    { label: 'Total distributions', count: total,                  dot: '#7B6CC4' },
    { label: 'À venir',             count: upcoming.length,        dot: '#3FA66E' },
    { label: 'Inscriptions bénévoles', count: totalVolunteerSignups, dot: '#E0944A' },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      <PageHeader
        breadcrumb="Admin / Distributions"
        title="Distributions"
        subtitle={`${total} distribution(s) au total`}
        action={{ label: '+ Ajouter une distribution', href: '/admin/distributions/new' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {STAT_CARDS.map(({ label, count, dot }) => (
          <StatCard key={label} label={label} count={count} dot={dot} />
        ))}
      </div>

      <Card className="overflow-hidden hover:translate-y-0">
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
          {['Date', 'Lieu', 'Statut', 'Bénévoles', 'Actions'].map((col) => (
            <div
              key={col}
              style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: AD.inkMuted }}
            >
              {col}
            </div>
          ))}
        </div>

        {distributions.map((d) => (
          <div
            key={d.documentId}
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
            <p style={{ fontSize: 13.5, fontWeight: 600, color: AD.ink }}>{formatDate(d.date)}</p>
            <p style={{ fontSize: 12.5, color: AD.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {d.location}
            </p>
            <div>
              <StatusBadge status={d.status} />
            </div>
            <p style={{ fontSize: 13, color: AD.ink, fontWeight: 600 }}>{d.volunteers?.length ?? 0}</p>
            <ActionButtons
              editHref={`/admin/distributions/${d.documentId}`}
              deleteAction={deleteDistribution.bind(null, d.documentId)}
            />
          </div>
        ))}

        {distributions.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucune distribution trouvée.
          </div>
        )}
      </Card>
    </div>
  )
}
