import Link from 'next/link'
import DistributionForm from '@/components/admin/distribution-form'
import { createDistribution } from '../actions'
import { fetchUsers } from '@/lib/strapi'
import { AD } from '@/lib/admin-tokens'
import { cardStyle } from '@/lib/admin-styles'

export default async function NewDistributionPage() {
  const users = await fetchUsers()

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/distributions" style={{ fontSize: 13, color: AD.inkMuted, textDecoration: 'none' }}>
          ← Retour aux distributions
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 24 }}>
        Nouvelle distribution
      </h1>
      <div style={{ ...cardStyle, padding: 28, maxWidth: 600 }}>
        <DistributionForm users={users} action={createDistribution} />
      </div>
    </div>
  )
}
