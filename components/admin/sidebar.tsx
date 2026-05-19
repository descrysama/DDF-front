'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ADMIN } from '@/lib/admin-tokens'

const NAV_ITEMS = [
  { label: '🏠 Dashboard',              href: '/admin' },
  { label: '🐱 Animaux',               href: '/admin/animals' },
  { label: '📢 Annonces',              href: '/admin/announcements' },
  { label: "🏡 Familles d'accueil",    href: '/admin/foster-families' },
  { label: "📋 Demandes d'adoption",   href: '/admin/adoption-requests' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: ADMIN.sidebar,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '-0.3px',
          }}
        >
          Admin DDF
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block',
                padding: '9px 12px',
                borderRadius: 6,
                marginBottom: 2,
                fontSize: 14,
                textDecoration: 'none',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                fontWeight: isActive ? 600 : 400,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
