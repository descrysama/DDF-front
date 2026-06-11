import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MONO } from '@/lib/admin-styles'
import { AD } from '@/lib/admin-tokens'

interface PageHeaderProps {
  breadcrumb: string
  title: string
  subtitle: string
  action?: { label: string; href: string }
}

export default function PageHeader({ breadcrumb, title, subtitle, action }: PageHeaderProps) {
  return (
    <>
      <p style={{ ...MONO, marginBottom: 8 }}>{breadcrumb}</p>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: AD.ink, letterSpacing: '-0.025em', marginBottom: 4 }}>{title}</h1>
          <p style={{ fontSize: 13, color: AD.inkMuted }}>{subtitle}</p>
        </div>
        {action && (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
    </>
  )
}
