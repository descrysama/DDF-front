'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  PawPrint,
  Heart,
  Smile,
  Calendar,
  Shield,
  FileText,
  Settings,
  Megaphone,
} from 'lucide-react'
import { AD } from '@/lib/admin-tokens'
import type { StrapiDistributionRaw } from '@/lib/strapi'

type NavItem = {
  key: string
  label: string
  href: string
  icon: React.ElementType
  badge?: number | null
  badgeHighlight?: boolean
}

const GESTION_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Tableau de bord',       href: '/admin',                    icon: Home },
  { key: 'cats',      label: 'Chats',                  href: '/admin/animals',            icon: PawPrint },
  { key: 'annonces',  label: 'Annonces',                href: '/admin/announcements',      icon: Megaphone },
  { key: 'demandes',  label: "Demandes d'adoption",    href: '/admin/adoption-requests',  icon: Heart,   badge: null, badgeHighlight: true },
  { key: 'fa',        label: "Familles d'accueil",     href: '/admin/foster-families',    icon: Smile },
  { key: 'distrib',   label: 'Distributions',          href: '/admin/distributions',       icon: Calendar },
  { key: 'blog',      label: 'Blog & actualités',      href: '/admin/blog',               icon: FileText },
]

const CONFIG_ITEMS: NavItem[] = [
  { key: 'benevoles',  label: 'Bénévoles',   href: '#', icon: Smile },
  { key: 'parametres', label: 'Paramètres',  href: '#', icon: Settings },
]

const SECTION_LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: AD.inkSubtle,
  padding: '0 10px',
  marginBottom: 4,
}

interface AdminSidebarProps {
  nextDistribution: StrapiDistributionRaw | null
}

export default function AdminSidebar({ nextDistribution }: AdminSidebarProps) {
  const pathname = usePathname()

  function isActive(item: NavItem) {
    if (item.href === '/admin') return pathname === '/admin'
    return item.href !== '#' && pathname.startsWith(item.href)
  }

  function renderItem(item: NavItem) {
    const active = isActive(item)
    const disabled = item.href === '#'
    const Icon = item.icon

    const inner = (
      <>
        {active && (
          <span
            style={{
              position: 'absolute',
              left: -14,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 3,
              height: 22,
              borderRadius: 2,
              background: AD.coral,
            }}
          />
        )}

        <Icon
          size={16}
          color={disabled ? AD.border : active ? AD.coral : AD.inkSubtle}
          strokeWidth={active ? 2.2 : 1.8}
        />

        <span style={{ flex: 1 }}>{item.label}</span>

        {disabled && (
          <span style={{ fontSize: 9, color: AD.border, fontWeight: 600 }}>
            Bientôt
          </span>
        )}

        {item.badge != null && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 10,
              background: item.badgeHighlight ? AD.coral : AD.surfaceAlt,
              color: item.badgeHighlight ? '#fff' : AD.inkMuted,
              lineHeight: '16px',
            }}
          >
            {item.badge}
          </span>
        )}
      </>
    )

    const baseStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 10px',
      borderRadius: 6,
      marginBottom: 2,
      fontSize: 13.5,
      textDecoration: 'none',
      transition: 'background 0.12s',
    }

    if (disabled) {
      return (
        <span
          key={item.key}
          style={{
            ...baseStyle,
            color: AD.border,
            cursor: 'default',
            fontWeight: 400,
          }}
        >
          {inner}
        </span>
      )
    }

    return (
      <Link
        key={item.key}
        href={item.href}
        style={{
          ...baseStyle,
          fontWeight: active ? 600 : 400,
          background: active ? AD.surfaceAlt : 'transparent',
          color: active ? AD.ink : AD.inkMuted,
        }}
      >
        {inner}
      </Link>
    )
  }

  return (
    <aside
      style={{
        width: 232,
        minHeight: '100%',
        background: AD.surface,
        borderRight: `1px solid ${AD.border}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        paddingTop: 16,
      }}
    >
      {/* Gestion section */}
      <div style={{ padding: '0 14px', marginBottom: 16 }}>
        <p style={SECTION_LABEL_STYLE}>Gestion</p>
        <nav style={{ paddingLeft: 14 }}>
          {GESTION_ITEMS.map(renderItem)}
        </nav>
      </div>

      {/* Configuration section */}
      <div style={{ padding: '0 14px', marginBottom: 16 }}>
        <p style={SECTION_LABEL_STYLE}>Configuration</p>
        <nav style={{ paddingLeft: 14 }}>
          {CONFIG_ITEMS.map(renderItem)}
        </nav>
      </div>

      {/* Promo card */}
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 14px 20px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FEE6E5 0%, #FCE9D9 100%)',
            borderRadius: 10,
            padding: '14px 14px 12px',
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: AD.ink,
              marginBottom: 4,
            }}
          >
            {nextDistribution
              ? `Distribution du ${new Date(nextDistribution.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}`
              : 'Aucune distribution prévue'}
          </p>
          <p style={{ fontSize: 11.5, color: AD.inkMuted, marginBottom: 8, lineHeight: 1.5 }}>
            {nextDistribution
              ? `${nextDistribution.volunteers?.length ?? 0} inscription(s) confirmée(s)`
              : 'Planifiez-en une pour voir apparaître les inscriptions ici.'}
          </p>
          {nextDistribution ? (
            <Link
              href={`/admin/distributions/${nextDistribution.documentId}`}
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: AD.coral,
                textDecoration: 'none',
              }}
            >
              Gérer l&apos;événement →
            </Link>
          ) : (
            <Link
              href="/admin/distributions/new"
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: AD.coral,
                textDecoration: 'none',
              }}
            >
              Planifier une distribution →
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}
