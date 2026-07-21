import Link from 'next/link'
import { notFound } from 'next/navigation'
import FosterFamilyForm from '@/components/admin/foster-family-form'
import StatusBadge from '@/components/admin/status-badge'
import { fetchResource, fetchAnimalsForFosterPicker, fetchUsersForFosterPicker } from '@/lib/strapi'
import type { StrapiFosterFamilyRaw } from '@/lib/strapi'
import { updateFosterFamily, removeFosterAssignment } from '../actions'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function EditFosterFamilyPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  const { documentId } = await params

  let family: StrapiFosterFamilyRaw
  try {
    const res = await fetchResource<StrapiFosterFamilyRaw>(
      `/api/foster-families/${documentId}?populate[user]=true&populate[foster_assignments][populate]=animal`
    )
    family = res.data
  } catch {
    notFound()
  }

  const [animals, users] = await Promise.all([
    fetchAnimalsForFosterPicker(documentId),
    fetchUsersForFosterPicker(documentId),
  ])
  const activeAssignments = (family.foster_assignments ?? []).filter((a) => a.status === 'active')
  const linkedAnimalIds = activeAssignments
    .map((a) => a.animal?.id)
    .filter((id): id is number => id != null)

  const boundUpdate = updateFosterFamily.bind(null, documentId)

  const formDefaultValues = {
    address: family.address,
    max_capacity: family.max_capacity,
    has_children: family.has_children,
    has_dogs: family.has_dogs,
    has_cats: family.has_cats,
    is_available: family.is_available,
    linkedAnimalIds,
    userId: family.user?.id ?? null,
  }

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
          <FosterFamilyForm
            key={`${formDefaultValues.userId}:${linkedAnimalIds.slice().sort((a, b) => a - b).join(',')}`}
            defaultValues={formDefaultValues}
            animals={animals}
            users={users}
            action={boundUpdate}
          />
        </Card>

        {/* Linked cats */}
        <Card className="p-6 hover:translate-y-0">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: AD.ink, marginBottom: 14 }}>
            Chats liés
          </h2>
          {activeAssignments.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: '#f8f9fa',
                    borderRadius: 6,
                    fontSize: 13,
                    color: AD.ink,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {assignment.animal ? (
                      <Link
                        href={`/admin/animals/${assignment.animal.documentId}`}
                        style={{ fontWeight: 600, color: AD.ink, textDecoration: 'none' }}
                      >
                        {assignment.animal.name}
                      </Link>
                    ) : (
                      <span style={{ color: AD.inkMuted }}>Chat supprimé</span>
                    )}
                    {assignment.animal && <StatusBadge status={assignment.animal.status} />}
                  </div>
                  <form action={removeFosterAssignment.bind(null, assignment.documentId, documentId)}>
                    <Button variant="outline" size="sm" type="submit">Retirer</Button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: AD.inkMuted, fontSize: 14 }}>
              Aucun chat hébergé actuellement.
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
