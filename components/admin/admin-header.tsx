import Link from 'next/link'
import { PawPrint, ArrowUpRight } from 'lucide-react'
import { AD } from '@/lib/admin-tokens'

export default function AdminHeader() {
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
        <PawPrint size={28} color={AD.coral} strokeWidth={2} />
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

      {/* Center — search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            maxWidth: 380,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: AD.surfaceAlt,
            border: `1px solid ${AD.border}`,
            borderRadius: 8,
            padding: '7px 12px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke={AD.inkSubtle} strokeWidth="1.6" />
            <path d="M10.5 10.5L14 14" stroke={AD.inkSubtle} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 13, color: AD.inkSubtle, flex: 1 }}>Rechercher…</span>
          <kbd
            style={{
              fontSize: 11,
              color: AD.inkSubtle,
              background: AD.surface,
              border: `1px solid ${AD.border}`,
              borderRadius: 4,
              padding: '1px 5px',
              fontFamily: 'Geist Mono, ui-monospace, monospace',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 200, justifyContent: 'flex-end' }}>
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
        <div
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
            cursor: 'pointer',
          }}
        >
          CM
        </div>
      </div>
    </header>
  )
}
