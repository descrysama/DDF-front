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

          {(request.applicant || request.household || request.employment || request.housing || request.outdoor || request.other_pets || request.remarks) && (
            <div style={{ marginTop: 20 }}>
              <p style={{ ...labelStyle, marginBottom: 8 }}>Dossier du candidat</p>
              <div style={{ background: '#f8f9fa', borderRadius: 6, padding: 14, display: 'grid', gap: 14 }}>
                <DossierGroup
                  title="Accord préalable"
                  rows={[
                    ["D'accord avec la démarche", request.adoption_process_agreement == null ? undefined : (request.adoption_process_agreement ? 'Oui' : 'Non')],
                  ]}
                />
                {request.applicant && (
                  <DossierGroup
                    title="Identité & contact"
                    rows={[
                      ['Animal concerné', request.applicant.animal_name],
                      ['Nom', `${request.applicant.first_name ?? ''} ${request.applicant.last_name ?? ''}`.trim()],
                      ['Date de naissance', request.applicant.birth_date],
                      ['Adresse', [request.applicant.address, request.applicant.postal_code, request.applicant.city].filter(Boolean).join(' · ')],
                      ['Téléphone', request.applicant.phone],
                      ['Email', request.applicant.email],
                    ]}
                  />
                )}
                {request.household && (
                  <DossierGroup
                    title="Foyer"
                    rows={[
                      ['Composition', request.household.composition],
                      ['Colocataires', request.household.roommates_count],
                      ['Enfants', request.household.has_children == null ? undefined : (request.household.has_children ? `Oui (${request.household.children_count ?? '?'}, ${request.household.children_ages ?? '?'})` : 'Non')],
                      ["Tous les habitants d'accord", request.household.household_agrees == null ? undefined : (request.household.household_agrees ? 'Oui' : `Non — ${request.household.disagreement_who ?? '?'} : ${request.household.disagreement_why ?? '?'}`)],
                    ]}
                  />
                )}
                {request.employment && (
                  <DossierGroup
                    title="Activité professionnelle"
                    rows={[
                      ['Travaille', request.employment.employed == null ? undefined : (request.employment.employed ? 'Oui' : 'Non')],
                      ['Profession', request.employment.profession],
                      ['Horaires', request.employment.work_hours],
                      ['Temps seul par jour', request.employment.hours_alone_per_day],
                    ]}
                  />
                )}
                {request.housing && (
                  <DossierGroup
                    title="Logement"
                    rows={[
                      ['Type', request.housing.type],
                      ['Superficie', request.housing.surface_area],
                      ['Animal vivra', request.housing.animal_environment],
                      ['Zone', request.housing.area_type],
                      ['Route passante', request.housing.busy_road_nearby],
                      ['Sortie extérieure autorisée', request.housing.outdoor_access_allowed],
                      ['Étage', request.housing.apartment?.floor],
                      ['Fenêtres sécurisées', request.housing.apartment?.windows_secured],
                      ['Sécurisation prévue', request.housing.apartment?.plans_to_secure_windows],
                    ]}
                  />
                )}
                {request.outdoor && (
                  <DossierGroup
                    title="Extérieur"
                    rows={[
                      ['Jardin', request.outdoor.garden?.has_garden == null ? undefined : (request.outdoor.garden.has_garden ? 'Oui' : 'Non')],
                      ['Lieu de vie', request.outdoor.garden?.description],
                      ['Superficie jardin', request.outdoor.garden?.surface_area],
                      ['Grillagé', request.outdoor.garden?.fenced == null ? undefined : (request.outdoor.garden.fenced ? `Oui (${request.outdoor.garden.fence_height ?? '?'})` : 'Non')],
                      ['Balcon/terrasse', request.outdoor.balcony?.has_balcony == null ? undefined : (request.outdoor.balcony.has_balcony ? 'Oui' : 'Non')],
                      ['Superficie balcon', request.outdoor.balcony?.surface_area],
                      ['Balcon sécurisé', request.outdoor.balcony?.secured],
                    ]}
                  />
                )}
                {request.other_pets && (
                  <DossierGroup
                    title="Autres animaux"
                    rows={[
                      ['Autres animaux', request.other_pets.has_other_pets == null ? undefined : (request.other_pets.has_other_pets ? 'Oui' : 'Non')],
                      ['Détails', request.other_pets.details],
                      ['Stérilisés', request.other_pets.sterilized],
                      ['Depuis quand', request.other_pets.owned_since],
                    ]}
                  />
                )}
                {request.remarks && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: AD.inkMuted, marginBottom: 4 }}>
                      Remarques
                    </p>
                    <p style={{ fontSize: 13, color: AD.ink, margin: 0 }}>{request.remarks}</p>
                  </div>
                )}
                <DossierGroup
                  title="Engagement"
                  rows={[
                    ['Mention de responsabilité acceptée', request.responsibility_agreement == null ? undefined : (request.responsibility_agreement ? 'Oui' : 'Non')],
                  ]}
                />
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
