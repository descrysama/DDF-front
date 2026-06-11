import Link from 'next/link'
import { AD } from '@/lib/admin-tokens'
import { MONO } from '@/lib/admin-styles'

interface PageHeaderProps {
  breadcrumb: string
  title: string
  subtitle: string
  action?: { label: string; href: string }
}

export default function PageHeader({ breadcrumb, title, subtitle, action }: PageHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <p style={{ ...MONO, marginBottom: 8 }}>{breadcrumb}</p>

      {/* Heading */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 22,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: AD.ink,
              letterSpacing: '-0.025em',
              marginBottom: 4,
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 13, color: AD.inkMuted }}>{subtitle}</p>
        </div>
        {action && (
          <Link
            href={action.href}
            style={{
              padding: '9px 18px',
              background: AD.coral,
              color: '#fff',
              borderRadius: 7,
              fontWeight: 600,
              fontSize: 13.5,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            {action.label}
          </Link>
        )}
      </div>
    </>
  )
}
