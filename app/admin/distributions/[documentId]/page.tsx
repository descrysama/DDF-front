import Link from 'next/link'
import { notFound } from 'next/navigation'
import DistributionForm from '@/components/admin/distribution-form'
import { fetchResource, fetchUsers } from '@/lib/strapi'
import type { StrapiDistributionRaw } from '@/lib/strapi'
import { updateDistribution } from '../actions'
import { requireAdmin } from '@/lib/auth'
import { AD } from '@/lib/admin-tokens'
import { cardStyle } from '@/lib/admin-styles'

export default async function EditDistributionPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  await requireAdmin()
  const { documentId } = await params
  const allUsers = await fetchUsers()

  let distribution: StrapiDistributionRaw
  try {
    const res = await fetchResource<StrapiDistributionRaw>(`/api/distributions/${documentId}?populate[0]=volunteers`)
    distribution = res.data
  } catch {
    notFound()
  }

  const boundUpdate = updateDistribution.bind(null, documentId)

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/distributions" style={{ fontSize: 13, color: AD.inkMuted, textDecoration: 'none' }}>
          ← Retour aux distributions
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 24 }}>
        Modifier la distribution
      </h1>
      <div style={{ ...cardStyle, padding: 28, maxWidth: 600 }}>
        <DistributionForm defaultValues={distribution} users={allUsers} action={boundUpdate} />
      </div>
    </div>
  )
}
