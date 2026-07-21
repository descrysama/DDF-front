'use client'

import { useState, useMemo, useTransition } from 'react'
import { AD } from '@/lib/admin-tokens'
import { fieldStyle } from '@/lib/admin-styles'
import { Card } from '@/components/ui/card'
import { changeUserRole } from './actions'
import type { StrapiUser, StrapiRole } from '@/lib/strapi'

const GRID_COLS = '1.4fr 1.8fr 200px 140px'

function omitKey<T>(obj: Record<number, T>, key: number): Record<number, T> {
  const next = { ...obj }
  delete next[key]
  return next
}

interface UsersTableProps {
  users: StrapiUser[]
  roles: StrapiRole[]
  currentUserId: number | null
  rolesAvailable: boolean
}

export default function UsersTable({ users, roles, currentUserId, rolesAvailable }: UsersTableProps) {
  const [activeRole, setActiveRole] = useState<string>('all')
  const [search, setSearch] = useState('')
  // Keyed by user id, so concurrent edits on different rows don't clobber each
  // other's pending/error state. `pendingRoles` doubles as the optimistic value
  // for the select: without it the input would snap back to the stale server
  // prop for the length of the round-trip, reading as a rejected change.
  const [pendingRoles, setPendingRoles] = useState<Record<number, number>>({})
  const [errorUserIds, setErrorUserIds] = useState<Record<number, true>>({})
  const [, startTransition] = useTransition()

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      const matchesRole = activeRole === 'all' || u.role?.type === activeRole
      const matchesSearch =
        q === '' ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      return matchesRole && matchesSearch
    })
  }, [users, activeRole, search])

  function onRoleChange(userId: number, roleId: number) {
    setErrorUserIds((prev) => omitKey(prev, userId))
    setPendingRoles((prev) => ({ ...prev, [userId]: roleId }))
    startTransition(async () => {
      try {
        await changeUserRole(userId, roleId)
      } catch {
        setErrorUserIds((prev) => ({ ...prev, [userId]: true }))
      } finally {
        setPendingRoles((prev) => omitKey(prev, userId))
      }
    })
  }

  const TABS = [
    { key: 'all', label: 'Tous', count: users.length },
    ...roles.map((r) => ({
      key: r.type,
      label: r.name,
      count: users.filter((u) => u.role?.type === r.type).length,
    })),
  ]

  return (
    <>
      {/* Filter tabs + search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {TABS.map((tab) => {
            const active = activeRole === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveRole(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid ${active ? AD.coral : AD.border}`,
                  background: active ? AD.coralSoft : AD.surface,
                  color: active ? AD.coralInk : AD.inkMuted,
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
                <span style={{ fontSize: 11, color: active ? AD.coralInk : AD.inkSubtle }}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        <input
          type="search"
          placeholder="Rechercher un nom ou un email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...fieldStyle, width: 280 }}
        />
      </div>

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
          {['Utilisateur', 'Email', 'Rôle', 'Inscrit le'].map((col) => (
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

        {visible.map((user) => {
          const isSelf = currentUserId != null && user.id === currentUserId
          const pendingRoleId = pendingRoles[user.id]
          const isPending = pendingRoleId !== undefined
          return (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: GRID_COLS,
                alignItems: 'center',
                padding: '12px 18px',
                gap: 12,
                borderBottom: `1px solid ${AD.border}`,
                background: AD.surface,
                opacity: isPending ? 0.55 : 1,
              }}
            >
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: AD.ink }}>{user.username}</p>
                {isSelf && (
                  <p style={{ fontSize: 11, color: AD.inkSubtle }}>C&apos;est vous</p>
                )}
              </div>

              <p
                style={{
                  fontSize: 12.5,
                  color: AD.inkMuted,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.email}
              </p>

              <div>
                {rolesAvailable && !isSelf ? (
                  <select
                    value={pendingRoleId ?? user.role?.id ?? ''}
                    disabled={isPending}
                    onChange={(e) => onRoleChange(user.id, Number(e.target.value))}
                    style={{ ...fieldStyle, padding: '5px 8px', fontSize: 12.5 }}
                  >
                    {user.role == null && <option value="">— Aucun rôle —</option>}
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p style={{ fontSize: 12.5, color: AD.inkMuted }}>{user.role?.name ?? '—'}</p>
                )}
                {errorUserIds[user.id] && (
                  <p style={{ fontSize: 11, color: AD.coral, marginTop: 4 }}>
                    Échec de la mise à jour. Réessayez.
                  </p>
                )}
              </div>

              <p style={{ fontSize: 12.5, color: AD.inkMuted }}>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
          )
        })}

        {visible.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucun utilisateur trouvé.
          </div>
        )}
      </Card>
    </>
  )
}
