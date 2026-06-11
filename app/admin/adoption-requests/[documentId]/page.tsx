import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchResource, fetchAnnouncements, fetchUsers } from '@/lib/strapi'
import type { StrapiAdoptionRequestRaw } from '@/lib/strapi'
import { updateAdoptionRequest, deleteAdoptionRequest } from '../actions'
import StatusBadge from '@/components/admin/status-badge'
import SubmitButton from '@/components/admin/submit-button'
import { ADMIN } from '@/lib/admin-tokens'
import { fieldStyle, labelStyle, metaRowStyle } from '@/lib/admin-styles'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AdoptionRequestDetailPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  const { documentId } = await params

  let request: StrapiAdoptionRequestRaw
  try {
    const res = await fetchResource<StrapiAdoptionRequestRaw>(
      `/api/adoption-requests/${documentId}?populate[0]=announcement&populate[1]=adopter&populate[2]=referent`
    )
    request = res.data
  } catch {
    notFound()
  }

  const [{ announcements }, users] = await Promise.all([
    fetchAnnouncements({ limit: 100 }),
    fetchUsers(),
  ])
  const boundUpdate = updateAdoptionRequest.bind(null, documentId)
  const boundDelete = deleteAdoptionRequest.bind(null, documentId)

  const requestDateValue = request.request_date
    ? new Date(request.request_date).toISOString().split('T')[0]
    : ''

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/adoption-requests"
          style={{ fontSize: 13, color: ADMIN.inkMuted, textDecoration: 'none' }}
        >
          ← Retour aux demandes
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: ADMIN.ink, marginBottom: 4 }}>
            Demande d&apos;adoption
          </h1>
          <p style={{ fontSize: 14, color: ADMIN.inkMuted }}>
            {request.announcement?.title ?? 'Annonce inconnue'}
          </p>
        </div>
        <form action={boundDelete}>
          <Button variant="destructive" type="submit">
            Supprimer
          </Button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Informations en lecture seule */}
        <Card className="p-6 hover:translate-y-0">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: ADMIN.ink, marginBottom: 14 }}>
            Informations
          </h2>
          <div>
            <div style={metaRowStyle}>
              <span style={{ color: ADMIN.inkMuted }}>Statut actuel</span>
              <StatusBadge status={request.status} />
            </div>
            <div style={metaRowStyle}>
              <span style={{ color: ADMIN.inkMuted }}>Adoptant</span>
              <span style={{ fontWeight: 500 }}>
                {request.adopter
                  ? `${request.adopter.username} (${request.adopter.email})`
                  : '—'}
              </span>
            </div>
            <div style={metaRowStyle}>
              <span style={{ color: ADMIN.inkMuted }}>Référent</span>
              <span>{request.referent?.username ?? '—'}</span>
            </div>
            <div style={{ ...metaRowStyle, borderBottom: 'none' }}>
              <span style={{ color: ADMIN.inkMuted }}>Score de correspondance</span>
              <span style={{ fontWeight: 700 }}>
                {request.match_score != null ? `${request.match_score}%` : '—'}
              </span>
            </div>
          </div>

          {request.message && (
            <div style={{ marginTop: 20 }}>
              <p style={{ ...labelStyle, marginBottom: 8 }}>Message</p>
              <p
                style={{
                  fontSize: 14,
                  color: ADMIN.ink,
                  lineHeight: 1.6,
                  background: '#f8f9fa',
                  padding: 14,
                  borderRadius: 6,
                  margin: 0,
                }}
              >
                {request.message}
              </p>
            </div>
          )}
        </Card>

        {/* Formulaire d'édition complet */}
        <Card className="p-6 hover:translate-y-0">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: ADMIN.ink, marginBottom: 14 }}>
            Modifier la demande
          </h2>
          <form action={boundUpdate}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Annonce liée</label>
              <select
                name="announcement_id"
                defaultValue={request.announcement?.documentId ?? ''}
                style={fieldStyle}
              >
                <option value="">— Aucune —</option>
                {announcements.map(a => (
                  <option key={a.documentId} value={a.documentId}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Adoptant</label>
              <select
                name="adopter_id"
                defaultValue={users.find(u => u.email === request.adopter?.email)?.id ?? ''}
                style={fieldStyle}
              >
                <option value="">— Aucun —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Statut</label>
              <select name="status" defaultValue={request.status} style={fieldStyle}>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Score de correspondance (%)</label>
              <input
                name="match_score"
                type="number"
                min={0}
                max={100}
                defaultValue={request.match_score ?? ''}
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Date de la demande</label>
              <input
                name="request_date"
                type="date"
                defaultValue={requestDateValue}
                style={fieldStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                rows={4}
                defaultValue={request.message ?? ''}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>

            <SubmitButton label="Enregistrer" />
          </form>
        </Card>
      </div>
    </div>
  )
}
