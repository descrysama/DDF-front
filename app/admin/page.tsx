import { redirect } from 'next/navigation'
import { fetchAnimals, fetchAnnouncements, fetchFosterFamilies, fetchAdoptionRequests } from '@/lib/strapi'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { AD, TINT } from '@/lib/admin-tokens'
import { PawPrint, Megaphone, Home, ClipboardList } from 'lucide-react'

const MONO: React.CSSProperties = {
  fontFamily: 'Geist Mono, ui-monospace, monospace',
  fontSize: 11.5,
  color: AD.inkMuted,
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  // The dashboard is admin-only ground truth (global counts across every
  // section) — a bénévole only ever cares about their own cats, so send them
  // straight to "Mes chats" instead of a landing page with nothing for them.
  if (!isAdmin(user)) {
    redirect('/admin/my-animals')
  }

  const [animals, announcements, fosterFamilies, adoptionRequests] = await Promise.all([
    fetchAnimals({ limit: 1 }),
    fetchAnnouncements({ limit: 1 }),
    fetchFosterFamilies({ limit: 1 }),
    fetchAdoptionRequests({ limit: 1 }),
  ])

  const CARDS = [
    {
      label: 'Animaux',
      subtitle: 'chats référencés',
      count: animals.total,
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
      count: adoptionRequests.total,
      tint: TINT.lilac,
      iconColor: '#7B6CC4',
      Icon: ClipboardList,
    },
  ]

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
    </div>
  )
}
