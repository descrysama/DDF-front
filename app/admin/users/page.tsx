import { fetchUsers, fetchRoles, type StrapiRole } from '@/lib/strapi'
import { getCurrentUser, requireAdmin } from '@/lib/auth'
import PageHeader from '@/components/admin/page-header'
import StatCard from '@/components/admin/stat-card'
import UsersTable from './users-table'

/**
 * Strapi ships two built-in roles that aren't part of this association's domain:
 * `public` is the role for unauthenticated requests (never valid on a real
 * user), and `authenticated` is the stock default, unused here — signups land on
 * `membre`. Both are hidden so they can't be assigned and don't render as
 * permanently-empty filter tabs.
 */
const BUILTIN_ROLE_TYPES = ['public', 'authenticated']

const STAT_DOTS = ['#3FA66E', '#E0944A', '#9C9588']

export default async function AdminUsersPage() {
  await requireAdmin()
  const [users, rolesResult, currentUser] = await Promise.all([
    fetchUsers(),
    fetchRoles().catch((): StrapiRole[] => []),
    getCurrentUser(),
  ])

  const roles = rolesResult.filter((r) => !BUILTIN_ROLE_TYPES.includes(r.type))
  const rolesAvailable = roles.length > 0

  const STAT_CARDS = [
    { key: 'total', label: 'Total utilisateurs', count: users.length, dot: '#7B6CC4' },
    ...roles.map((role, i) => ({
      key: `role-${role.id}`,
      label: role.name,
      count: users.filter((u) => u.role?.type === role.type).length,
      dot: STAT_DOTS[i % STAT_DOTS.length],
    })),
  ]

  return (
    <div style={{ padding: '28px 32px' }}>
      <PageHeader
        breadcrumb="Admin / Utilisateurs"
        title="Utilisateurs"
        subtitle={`${users.length} utilisateur(s) au total`}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${STAT_CARDS.length}, 1fr)`,
          gap: 14,
          marginBottom: 22,
        }}
      >
        {STAT_CARDS.map(({ key, label, count, dot }) => (
          <StatCard key={key} label={label} count={count} dot={dot} />
        ))}
      </div>

      <UsersTable
        users={users}
        roles={roles}
        currentUserId={currentUser?.id ?? null}
        rolesAvailable={rolesAvailable}
      />
    </div>
  )
}
