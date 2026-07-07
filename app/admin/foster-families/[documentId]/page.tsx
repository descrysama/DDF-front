import Link from 'next/link'
import { notFound } from 'next/navigation'
import FosterFamilyForm from '@/components/admin/foster-family-form'
import { fetchResource } from '@/lib/strapi'
import type { StrapiFosterFamilyRaw } from '@/lib/strapi'
import { updateFosterFamily } from '../actions'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

export default async function EditFosterFamilyPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  const { documentId } = await params

  let family: StrapiFosterFamilyRaw
  try {
    const res = await fetchResource<StrapiFosterFamilyRaw>(
      `/api/foster-families/${documentId}?populate[0]=user&populate[1]=foster_assignments`
    )
    family = res.data
  } catch {
    notFound()
  }

  const boundUpdate = updateFosterFamily.bind(null, documentId)

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/foster-families"
          style={{ fontSize: 13, color: AD.inkMuted, textDecoration: 'none' }}
        >
          ← Retour aux familles d&apos;accueil
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 4 }}>
        Modifier la famille
      </h1>
      {family.user && (
        <p style={{ fontSize: 14, color: AD.inkMuted, marginBottom: 24 }}>
          {family.user.username} — {family.user.email}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Edit form */}
        <Card className="p-6 hover:translate-y-0">
          <FosterFamilyForm defaultValues={family} action={boundUpdate} />
        </Card>

        {/* Foster assignments */}
        <Card className="p-6 hover:translate-y-0">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: AD.ink, marginBottom: 14 }}>
            Hébergements en cours
          </h2>
          {family.foster_assignments && family.foster_assignments.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {family.foster_assignments.map((assignment) => (
                <li
                  key={assignment.id}
                  style={{
                    padding: '8px 12px',
                    background: '#f8f9fa',
                    borderRadius: 6,
                    marginBottom: 8,
                    fontSize: 13,
                    color: AD.inkMuted,
                    fontFamily: 'Geist Mono, ui-monospace, monospace',
                  }}
                >
                  {assignment.documentId}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: AD.inkMuted, fontSize: 14 }}>
              Aucun hébergement en cours.
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
