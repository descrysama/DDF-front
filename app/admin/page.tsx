import Link from 'next/link'
import {
  fetchAnimals,
  fetchAnnouncements,
  fetchFosterFamilies,
  fetchAdoptionRequests,
  fetchUnassignedAnimals,
  fetchNextDistribution,
  type AnimalStatus,
} from '@/lib/strapi'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { AD, TINT, STATUS_META } from '@/lib/admin-tokens'
import StatusBadge from '@/components/admin/status-badge'
import { Card } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { PawPrint, Megaphone, Home, ClipboardList, AlertTriangle, CalendarClock, ArrowRight } from 'lucide-react'

const MONO: React.CSSProperties = {
  fontFamily: 'Geist Mono, ui-monospace, monospace',
  fontSize: 11.5,
  color: AD.inkMuted,
}

const STATUS_ORDER: AnimalStatus[] = ['available', 'in_foster', 'reserved', 'adopted']

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  // The dashboard is admin-only ground truth (global counts across every
  // section) — a bénévole only ever cares about their own cats, so send them
  // straight to "Mes chats" instead of a landing page with nothing for them.
  if (!isAdmin(user)) {
    redirect('/admin/my-animals')
  }

  const [animalsRes, announcements, fosterFamilies, adoptionRequestsRes, unassigned, nextDistribution] =
    await Promise.all([
      fetchAnimals({ limit: 200 }),
      fetchAnnouncements({ limit: 1 }),
      fetchFosterFamilies({ limit: 1 }),
      fetchAdoptionRequests({ limit: 100 }),
      fetchUnassignedAnimals({ limit: 1 }),
      fetchNextDistribution(),
    ])

  const CARDS = [
    {
      label: 'Animaux',
      subtitle: 'chats référencés',
      count: animalsRes.total,
      tint: TINT.mint,
      iconColor: '#3FA66E',
      Icon: PawPrint,
    },
    {
      label: 'Annonces',
      subtitle: 'annonces publiées',
      count: announcements.total,
      tint: TINT.pink,
      iconColor: AD.coral,
      Icon: Megaphone,
    },
    {
      label: "Familles d'accueil",
      subtitle: 'familles enregistrées',
      count: fosterFamilies.total,
      tint: TINT.peach,
      iconColor: '#E0944A',
      Icon: Home,
    },
    {
      label: "Demandes d'adoption",
      subtitle: 'demandes reçues',
      count: adoptionRequestsRes.total,
      tint: TINT.lilac,
      iconColor: '#7B6CC4',
      Icon: ClipboardList,
    },
  ]

  const recentRequests = [...adoptionRequestsRes.adoptionRequests]
    .sort((a, b) => (b.request_date ?? '').localeCompare(a.request_date ?? ''))
    .slice(0, 5)

  const statusCounts: Record<AnimalStatus, number> = {
    available: 0,
    in_foster: 0,
    reserved: 0,
    adopted: 0,
  }
  for (const a of animalsRes.animals) statusCounts[a.status]++
  const statusTotal = animalsRes.animals.length

  const distributionDate = nextDistribution
    ? new Date(nextDistribution.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <p style={{ ...MONO, marginBottom: 8 }}>Admin / Tableau de bord</p>

      {/* Heading */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: AD.ink,
          letterSpacing: '-0.025em',
          marginBottom: 4,
        }}
      >
        Tableau de bord
      </h1>
      <p style={{ fontSize: 13, color: AD.inkMuted, marginBottom: 28 }}>
        Vue d&apos;ensemble des ressources de l&apos;association
      </p>

      {/* Stat cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {CARDS.map(({ label, subtitle, count, tint, iconColor, Icon }) => (
          <div
            key={label}
            style={{
              background: AD.surface,
              border: `1px solid ${AD.border}`,
              borderRadius: 10,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: tint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={18} color={iconColor} strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 11.5, color: AD.inkMuted, marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: AD.ink, lineHeight: 1 }}>{count}</p>
              <p style={{ fontSize: 11, color: AD.inkMuted, marginTop: 2 }}>{subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent requests + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Recent adoption requests */}
        <Card className="overflow-hidden hover:translate-y-0" style={{ padding: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: `1px solid ${AD.border}`,
            }}
          >
            <h2 style={{ fontSize: 14.5, fontWeight: 700, color: AD.ink }}>Demandes d&apos;adoption récentes</h2>
            <Link
              href="/admin/adoption-requests"
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: AD.coral, textDecoration: 'none' }}
            >
              Voir tout <ArrowRight size={13} />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: AD.inkMuted, fontSize: 13.5 }}>
              Aucune demande d&apos;adoption pour l&apos;instant.
            </div>
          ) : (
            recentRequests.map((req) => {
              const dateStr = req.request_date
                ? new Date(req.request_date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'
              return (
                <div
                  key={req.documentId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1fr auto auto',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 18px',
                    borderBottom: `1px solid ${AD.border}`,
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 600, color: AD.ink }}>{req.adopter?.username ?? '—'}</p>
                  <p style={{ fontSize: 12.5, color: AD.inkMuted }}>{req.animal?.name ?? '—'}</p>
                  <StatusBadge status={req.status} />
                  <p style={{ fontSize: 12, color: AD.inkMuted, justifySelf: 'end' }}>{dateStr}</p>
                </div>
              )
            })
          )}
        </Card>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Unassigned animals alert */}
          <Link href="/admin/unassigned-animals" style={{ textDecoration: 'none' }}>
            <Card
              className="hover:-translate-y-0.5"
              style={{ padding: '16px 18px', background: TINT.rose, border: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <AlertTriangle size={18} color={AD.coral} strokeWidth={2} />
                <p style={{ fontSize: 13, fontWeight: 700, color: AD.ink }}>Chats sans référent</p>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 2 }}>{unassigned.total}</p>
              <p style={{ fontSize: 12, color: AD.inkMuted }}>
                {unassigned.total > 0 ? 'à attribuer' : 'tous les chats ont un référent'}
              </p>
            </Card>
          </Link>

          {/* Next distribution */}
          <Link href="/admin/distributions" style={{ textDecoration: 'none' }}>
            <Card className="hover:-translate-y-0.5" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <CalendarClock size={18} color={AD.coral} strokeWidth={2} />
                <p style={{ fontSize: 13, fontWeight: 700, color: AD.ink }}>Prochaine distribution</p>
              </div>
              {nextDistribution ? (
                <>
                  <p style={{ fontSize: 15, fontWeight: 700, color: AD.ink, marginBottom: 2 }}>{distributionDate}</p>
                  <p style={{ fontSize: 12.5, color: AD.inkMuted, marginBottom: 2 }}>{nextDistribution.location}</p>
                  <p style={{ fontSize: 12, color: AD.inkMuted }}>
                    {nextDistribution.volunteers?.length ?? 0} bénévole
                    {(nextDistribution.volunteers?.length ?? 0) > 1 ? 's' : ''}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 12.5, color: AD.inkMuted }}>Aucune distribution planifiée</p>
              )}
            </Card>
          </Link>
        </div>
      </div>

      {/* Status breakdown */}
      <Card className="hover:translate-y-0" style={{ padding: '16px 18px' }}>
        <h2 style={{ fontSize: 14.5, fontWeight: 700, color: AD.ink, marginBottom: 14 }}>
          Répartition des animaux par statut
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STATUS_ORDER.map((status) => {
            const count = statusCounts[status]
            const pct = statusTotal > 0 ? Math.round((count / statusTotal) * 100) : 0
            const meta = STATUS_META[status]
            return (
              <div key={status} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 40px', alignItems: 'center', gap: 12 }}>
                <p style={{ fontSize: 12.5, color: AD.ink }}>{meta.label}</p>
                <div style={{ height: 8, borderRadius: 4, background: AD.surfaceAlt, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: 4, background: meta.dot }} />
                </div>
                <p style={{ fontSize: 12.5, color: AD.inkMuted, textAlign: 'right' }}>{count}</p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
