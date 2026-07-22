import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchResource, fetchAnnouncements, fetchUsers, fetchAnimals } from '@/lib/strapi'
import type { StrapiAdoptionRequestRaw } from '@/lib/strapi'
import { updateAdoptionRequest, deleteAdoptionRequest } from '../actions'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import StatusBadge from '@/components/admin/status-badge'
import SubmitButton from '@/components/admin/submit-button'
import { AD } from '@/lib/admin-tokens'
import { fieldStyle, labelStyle, metaRowStyle } from '@/lib/admin-styles'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function DossierGroup({ title, rows }: { title: string; rows: [string, string | undefined][] }) {
  const visible = rows.filter(([, value]) => value)
  if (visible.length === 0) return null

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: AD.inkMuted, marginBottom: 6 }}>
        {title}
      </p>
      <div style={{ display: 'grid', gap: 4 }}>
        {visible.map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
            <span style={{ color: AD.inkMuted }}>{label}</span>
            <span style={{ color: AD.ink, textAlign: 'right' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function AdoptionRequestDetailPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  const { documentId } = await params
  const currentUser = await getCurrentUser()
  const admin = isAdmin(currentUser)

  let request: StrapiAdoptionRequestRaw
  try {
    const res = await fetchResource<StrapiAdoptionRequestRaw>(
      `/api/adoption-requests/${documentId}?populate[announcement]=true&populate[adopter]=true&populate[referent]=true&populate[animal][populate][referent]=true&populate[animal][populate][backup_referents]=true`
    )
    request = res.data
  } catch {
    notFound()
  }

  if (!admin) {
    const ownsRequest =
      request.animal?.referent?.id === currentUser?.id ||
      request.animal?.backup_referents?.some((u) => u.id === currentUser?.id)
    if (!ownsRequest) notFound()
  }

  const [{ announcements }, users, { animals }] = admin
    ? await Promise.all([
        fetchAnnouncements({ limit: 100 }),
        fetchUsers(),
        fetchAnimals({ limit: 200 }),
      ])
    : [{ announcements: [] }, [], { animals: [] }]
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
          style={{ fontSize: 13, color: AD.inkMuted, textDecoration: 'none' }}
        >
          ← Retour aux demandes
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 4 }}>
            Demande d&apos;adoption
          </h1>
          <p style={{ fontSize: 14, color: AD.inkMuted }}>
            {request.animal?.name ?? 'Chat inconnu'}
            {request.announcement && ` · via ${request.announcement.title}`}
          </p>
        </div>
        {admin && (
          <form action={boundDelete}>
            <Button variant="destructive" type="submit">
              Supprimer
            </Button>
          </form>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Informations en lecture seule */}
        <Card className="p-6 hover:translate-y-0">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: AD.ink, marginBottom: 14 }}>
            Informations
          </h2>
          <div>
            <div style={metaRowStyle}>
              <span style={{ color: AD.inkMuted }}>Statut actuel</span>
              <StatusBadge status={request.status} />
            </div>
            <div style={metaRowStyle}>
              <span style={{ color: AD.inkMuted }}>Chat concerné</span>
              <span style={{ fontWeight: 500 }}>{request.animal?.name ?? '—'}</span>
            </div>
            <div style={metaRowStyle}>
              <span style={{ color: AD.inkMuted }}>Adoptant</span>
              <span style={{ fontWeight: 500 }}>
                {request.adopter
                  ? `${request.adopter.username} (${request.adopter.email})`
                  : '—'}
              </span>
            </div>
            <div style={metaRowStyle}>
              <span style={{ color: AD.inkMuted }}>Référent</span>
              <span>{request.referent?.username ?? '—'}</span>
            </div>
            <div style={{ ...metaRowStyle, borderBottom: 'none' }}>
              <span style={{ color: AD.inkMuted }}>Score de correspondance</span>
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
                  color: AD.ink,
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

          {(request.candidat || request.foyer || request.chat_info || request.engagements) && (
            <div style={{ marginTop: 20 }}>
              <p style={{ ...labelStyle, marginBottom: 8 }}>Dossier du candidat</p>
              <div style={{ background: '#f8f9fa', borderRadius: 6, padding: 14, display: 'grid', gap: 14 }}>
                {request.candidat && (
                  <DossierGroup
                    title="Candidat"
                    rows={[
                      ['Nom', `${request.candidat.prenom ?? ''} ${request.candidat.nom ?? ''}`.trim()],
                      ['Email', request.candidat.email],
                      ['Téléphone', request.candidat.telephone],
                      ['Adresse', [request.candidat.codePostal, request.candidat.ville].filter(Boolean).join(' ')],
                      ['Âge', request.candidat.age],
                      ['Profession', request.candidat.profession],
                    ]}
                  />
                )}
                {request.foyer && (
                  <DossierGroup
                    title="Foyer"
                    rows={[
                      ['Logement', request.foyer.typeLogement],
                      ['Surface', request.foyer.surface],
                      ['Accès extérieur', request.foyer.accesExterieur],
                      ['Composition', request.foyer.compositionFoyer],
                      ['Autres animaux', request.foyer.autresAnimaux],
                      ['Statut', request.foyer.statutLogement],
                      ['Personnes au foyer', request.foyer.personnesFoyer],
                    ]}
                  />
                )}
                {request.chat_info && (
                  <DossierGroup
                    title="Le chat"
                    rows={[
                      ['Expérience', request.chat_info.experienceChat],
                      ['Pourquoi ce chat', request.chat_info.pourquoiCeChat],
                      ['Vétérinaire', request.chat_info.veterinaire],
                      ['Disponibilité', request.chat_info.disponibilite],
                    ]}
                  />
                )}
                {request.engagements && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: AD.inkMuted, marginBottom: 4 }}>
                      Engagements
                    </p>
                    <p style={{ fontSize: 13, color: AD.ink, margin: 0 }}>
                      {request.engagements.filter(Boolean).length} / {request.engagements.length} coché(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Formulaire d'édition complet */}
        <Card className="p-6 hover:translate-y-0">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: AD.ink, marginBottom: 14 }}>
            Modifier la demande
          </h2>
          <form action={boundUpdate}>
            {admin && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Chat concerné</label>
                  <select
                    name="animal_id"
                    defaultValue={request.animal?.documentId ?? ''}
                    style={fieldStyle}
                  >
                    <option value="">— Aucun —</option>
                    {animals.map(a => (
                      <option key={a.documentId} value={a.documentId}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

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
                  <label style={labelStyle}>Référent</label>
                  <select
                    name="referent_id"
                    defaultValue={users.find(u => u.username === request.referent?.username)?.id ?? ''}
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
              </>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Statut</label>
              <select name="status" defaultValue={request.status} style={fieldStyle}>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>

            {admin && (
              <>
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
              </>
            )}

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
