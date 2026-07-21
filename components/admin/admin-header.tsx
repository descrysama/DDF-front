import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { AD } from '@/lib/admin-tokens'
import type { AuthUser } from '@/lib/auth'

function initials(username: string) {
  const parts = username.trim().split(/\s+/)
  const chars = parts.length > 1 ? [parts[0][0], parts[1][0]] : [username[0], username[1]]
  return chars.filter(Boolean).join('').toUpperCase()
}

export default function AdminHeader({ user }: { user: AuthUser | null }) {
  return (
    <header
      style={{
        height: 56,
        background: AD.surface,
        borderBottom: `1px solid ${AD.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        gap: 16,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left — logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 200 }}>
        <div style={{ position: 'relative', width: 32, height: 32 }}>
          <Image src="/logo.png" alt="Sans Croquettes Fixes" fill style={{ objectFit: 'contain' }} priority />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: AD.ink, whiteSpace: 'nowrap' }}>
          Sans Croquettes Fixes
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: AD.surface,
            background: AD.ink,
            padding: '2px 7px',
            borderRadius: 4,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginLeft: 4,
          }}
        >
          Admin
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            color: AD.inkMuted,
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Voir le site public
          <ArrowUpRight size={14} color={AD.inkMuted} />
        </Link>

        {/* Avatar */}
        {user && (
          <div
            title={user.username}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${AD.coral}, ${AD.magenta})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {initials(user.username)}
          </div>
        )}
      </div>
    </header>
  )
}
