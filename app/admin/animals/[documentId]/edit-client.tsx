'use client'

import Link from 'next/link'
import { useTransition, useState, useRef } from 'react'
import { AD } from '@/lib/admin-tokens'
import {
  updateAnimal, deleteAnimal, addMediaToAnimal, deleteMedia, setCoverMedia,
  updateAnimalVideo, removeAnimalVideo, addMedicalEvent, removeMedicalEvent,
  updateAnimalReferents,
} from '../actions'
import type { StrapiMedia, StrapiMedicalEvent, StrapiUser, StrapiBreed, MedicalEventType } from '@/lib/strapi'

interface FosterAssignment {
  id: number
  documentId: string
  status: string
  start_date: string | null
  foster_family?: { id: number; documentId: string; address: string } | null
}

interface Animal {
  id: number
  documentId: string
  name: string
  age: number
  gender: string
  description: string | null
  status: string
  activity_level: string
  ok_with_children: boolean
  ok_with_dogs: boolean
  ok_with_cats: boolean
  indoor_only: boolean
  breed?: StrapiBreed | null
  medias?: StrapiMedia[]
  video_url?: string | null
  trap_date?: string | null
  medical_history?: StrapiMedicalEvent[]
  referent?: StrapiUser | null
  backup_referents?: StrapiUser[]
  foster_assignments?: FosterAssignment[]
}

const MEDICAL_EVENT_LABEL: Record<MedicalEventType, string> = {
  vaccination: 'Vaccination',
  sterilisation: 'Stérilisation',
  consultation: 'Consultation',
  traitement: 'Traitement',
  autre: 'Autre',
}

const input: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '9px 12px',
  border: `1px solid ${AD.border}`,
  borderRadius: 7,
  fontSize: 13,
  color: AD.ink,
  background: '#fff',
  fontFamily: 'inherit',
  outline: 'none',
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: AD.ink,
  marginBottom: 6,
}

const card: React.CSSProperties = {
  background: '#fff',
  border: `1px solid ${AD.border}`,
  borderRadius: 10,
  padding: 22,
}

const cardTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: AD.ink,
  marginBottom: 4,
}

const cardHint: React.CSSProperties = {
  fontSize: 12,
  color: AD.inkMuted,
  marginBottom: 16,
}

export default function AnimalEditClient({
  animal,
  strapiUrl,
  users,
  breeds,
}: {
  animal: Animal
  strapiUrl: string
  users: StrapiUser[]
  breeds: StrapiBreed[]
}) {
  const [isPending, startTransition] = useTransition()
  const [isMediaPending, startMediaTransition] = useTransition()
  const [isVideoPending, startVideoTransition] = useTransition()
  const [isMedicalPending, startMedicalTransition] = useTransition()
  const [isReferentsPending, startReferentsTransition] = useTransition()
  const [gender, setGender] = useState(animal.gender)
  const [backupIds, setBackupIds] = useState<number[]>((animal.backup_referents ?? []).map(u => u.id))
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const medicalFormRef = useRef<HTMLFormElement>(null)
  const medias = animal.medias ?? []
  const videoUrl = animal.video_url ? `${strapiUrl}${animal.video_url}` : null
  const medicalHistory = [...(animal.medical_history ?? [])].sort((a, b) => b.event_date.localeCompare(a.event_date))
  const activeAssignments = (animal.foster_assignments ?? []).filter(a => a.status === 'active')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => updateAnimal(animal.documentId, formData))
  }

  function handleDelete() {
    if (!confirm(`Supprimer définitivement la fiche de ${animal.name} ?`)) return
    startTransition(() => deleteAnimal(animal.documentId))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('photo', file)
    e.target.value = ''
    startMediaTransition(() => addMediaToAnimal(animal.documentId, formData))
  }

  function handleVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('video', file)
    e.target.value = ''
    startVideoTransition(() => updateAnimalVideo(animal.documentId, formData))
  }

  function handleRemoveVideo() {
    if (!confirm('Supprimer cette vidéo ?')) return
    startVideoTransition(() => removeAnimalVideo(animal.documentId))
  }

  function handleAddMedicalEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    medicalFormRef.current?.reset()
    startMedicalTransition(() => addMedicalEvent(animal.documentId, formData))
  }

  function handleRemoveMedicalEvent(eventId: number) {
    if (!confirm('Supprimer cet événement médical ?')) return
    startMedicalTransition(() => removeMedicalEvent(eventId, animal.documentId))
  }

  function toggleBackup(userId: number) {
    setBackupIds((ids) => (ids.includes(userId) ? ids.filter(id => id !== userId) : [...ids, userId]))
  }

  function handleSaveReferents(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startReferentsTransition(() => updateAnimalReferents(animal.documentId, formData))
  }

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* Breadcrumb */}
      <div style={{
        fontSize: 11.5, color: AD.inkMuted, marginBottom: 6,
        fontFamily: 'Geist Mono, ui-monospace, monospace',
      }}>
        <Link href="/admin" style={{ color: AD.inkMuted, textDecoration: 'none' }}>Admin</Link>
        {' / '}
        <Link href="/admin/animals" style={{ color: AD.inkMuted, textDecoration: 'none' }}>Chats</Link>
        {' / '}
        Modifier · #{animal.id}
      </div>

      {/* Title + action buttons */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 22, gap: 16, flexWrap: 'wrap',
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1, color: AD.ink }}>
          Modifier la fiche de{' '}
          <span style={{ color: AD.coral }}>{animal.name}</span>
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/animals" style={{
            padding: '9px 14px', borderRadius: 6,
            background: '#fff', color: AD.ink, border: `1px solid ${AD.borderStrong}`,
            fontSize: 12.5, fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center',
          }}>Annuler</Link>
          <button
            type="submit"
            form="animal-form"
            disabled={isPending}
            style={{
              padding: '9px 14px', borderRadius: 6,
              background: isPending ? AD.border : AD.coral,
              color: '#fff', border: 'none',
              fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit',
              cursor: isPending ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {isPending ? 'En cours…' : 'Publier les changements'}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18, alignItems: 'start' }}>

        {/* ── Left: form cards ── */}
        <form id="animal-form" onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>

          {/* Identité */}
          <div style={card}>
            <div style={cardTitle}>Identité</div>
            <div style={cardHint}>Les informations affichées sur la fiche publique.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={label}>Nom</span>
                <input name="name" required defaultValue={animal.name} style={input} placeholder="Ex: Mimi" />
              </div>
              <div>
                <span style={label}>Âge (années)</span>
                <input name="age" type="number" required min={0} defaultValue={animal.age} style={input} />
              </div>
              <div>
                <span style={label}>Date de trappage</span>
                <input name="trap_date" type="date" defaultValue={animal.trap_date ?? ''} style={input} />
              </div>
              <div>
                <span style={label}>Race</span>
                <select name="breed_id" defaultValue={animal.breed?.id ?? ''} style={input}>
                  <option value="">— Non renseignée —</option>
                  {breeds.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={label}>Sexe</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { value: 'female', label: 'Femelle' },
                    { value: 'male', label: 'Mâle' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      style={{
                        flex: 1, padding: '8px 12px', borderRadius: 7, cursor: 'pointer',
                        border: gender === opt.value ? `1.5px solid ${AD.ink}` : `1px solid ${AD.border}`,
                        background: gender === opt.value ? AD.surfaceAlt : '#fff',
                        fontSize: 12.5, fontWeight: 600, color: AD.ink,
                        textAlign: 'center', userSelect: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={opt.value}
                        checked={gender === opt.value}
                        onChange={() => setGender(opt.value)}
                        style={{ display: 'none' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profil & compatibilités */}
          <div style={card}>
            <div style={cardTitle}>Profil & compatibilités</div>
            <div style={cardHint}>Critères pour matcher avec les bons adoptants.</div>
            <div style={{ marginBottom: 14 }}>
              <span style={label}>Niveau d&apos;activité</span>
              <select name="activity_level" required defaultValue={animal.activity_level} style={input}>
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { name: 'ok_with_children', label: 'Compatible enfants', checked: animal.ok_with_children },
                { name: 'ok_with_dogs',     label: 'Compatible chiens',  checked: animal.ok_with_dogs },
                { name: 'ok_with_cats',     label: 'Compatible chats',   checked: animal.ok_with_cats },
                { name: 'indoor_only',      label: 'Intérieur uniquement', checked: animal.indoor_only },
              ].map((item) => (
                <label key={item.name} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
                  padding: '8px 12px', borderRadius: 7, background: AD.surfaceAlt,
                }}>
                  <input type="checkbox" name={item.name} defaultChecked={!!item.checked} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: AD.ink }}>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description longue */}
          <div style={card}>
            <div style={cardTitle}>Description longue</div>
            <div style={cardHint}>Son histoire, son caractère — affiché sur la fiche détaillée.</div>
            <textarea
              name="description"
              rows={6}
              defaultValue={animal.description ?? ''}
              style={{ ...input, resize: 'vertical', lineHeight: 1.55 }}
              placeholder="Décrivez le chat…"
            />
          </div>

        </form>

        {/* ── Right column ── */}
        <div style={{ display: 'grid', gap: 16 }}>

          {/* Publication */}
          <div style={{ ...card, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: AD.ink, marginBottom: 10 }}>Publication</div>
            <span style={label}>Statut</span>
            {/* form attr links this select to the left-column form */}
            <select name="status" form="animal-form" required defaultValue={animal.status} style={input}>
              <option value="available">Disponible</option>
              <option value="in_foster">En famille d&apos;accueil</option>
              <option value="reserved">Réservé</option>
              <option value="adopted">Adopté</option>
            </select>
          </div>

          {/* Photos */}
          <div style={{ ...card, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: AD.ink }}>Photos</div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isMediaPending}
                style={{
                  fontSize: 11.5, color: AD.coralInk, fontWeight: 600,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                + Ajouter
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
              opacity: isMediaPending ? 0.6 : 1, transition: 'opacity 0.15s',
            }}>
              {medias.map((media) => {
                const relPath =
                  media.image?.formats?.medium?.url ??
                  media.image?.formats?.small?.url ??
                  media.image?.url ?? null
                const url = relPath ? `${strapiUrl}${relPath}` : null
                const isCover = media.is_cover
                return (
                  <div key={media.id} style={{
                    position: 'relative', borderRadius: 8, overflow: 'hidden',
                    border: `2px solid ${isCover ? AD.coral : 'transparent'}`,
                  }}>
                    <div style={{ aspectRatio: '1/1', background: AD.surfaceAlt }}>
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 10, color: AD.inkMuted }}>—</span>
                        </div>
                      )}
                    </div>
                    {isCover && (
                      <div style={{
                        position: 'absolute', top: 6, left: 6,
                        padding: '2px 7px', borderRadius: 4,
                        background: AD.coral, color: '#fff',
                        fontSize: 10, fontWeight: 700,
                      }}>Couverture</div>
                    )}
                    <div style={{ display: 'flex', gap: 3, padding: '4px 5px' }}>
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => startMediaTransition(() => setCoverMedia(media.id, animal.documentId))}
                          disabled={isMediaPending}
                          style={{
                            flex: 1, padding: '3px 0', fontSize: 10,
                            background: AD.coralSoft, color: AD.coralInk,
                            border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 600,
                          }}
                        >★</button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm('Supprimer cette photo ?')) return
                          startMediaTransition(() => deleteMedia(media.id, animal.documentId))
                        }}
                        disabled={isMediaPending}
                        style={{
                          padding: '3px 7px', fontSize: 10,
                          background: '#FEE6E5', color: AD.coralInk,
                          border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 600,
                        }}
                      >✕</button>
                    </div>
                  </div>
                )
              })}

              {/* Dashed upload slot */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isMediaPending}
                style={{
                  aspectRatio: '1/1', borderRadius: 8,
                  border: `1.5px dashed ${AD.borderStrong}`,
                  background: AD.bg,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: AD.inkMuted, fontSize: 11, gap: 4,
                  cursor: isMediaPending ? 'not-allowed' : 'pointer',
                  padding: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 3V13M3 8H13" />
                </svg>
                Ajouter
              </button>
            </div>
          </div>

          {/* Vidéo */}
          <div style={{ ...card, padding: 18, opacity: isVideoPending ? 0.6 : 1, transition: 'opacity 0.15s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: AD.ink }}>Vidéo</div>
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isVideoPending}
                  style={{
                    fontSize: 11.5, color: AD.coralInk, fontWeight: 600,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  Remplacer
                </button>
              )}
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleVideoChange}
            />

            {videoUrl ? (
              <div>
                <video
                  key={videoUrl}
                  src={videoUrl}
                  controls
                  style={{ width: '100%', borderRadius: 8, background: AD.ink, display: 'block', marginBottom: 8 }}
                />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  disabled={isVideoPending}
                  style={{
                    width: '100%', padding: '5px 0', fontSize: 11,
                    background: '#FEE6E5', color: AD.coralInk,
                    border: 'none', borderRadius: 4, cursor: isVideoPending ? 'not-allowed' : 'pointer', fontWeight: 600,
                  }}
                >
                  Supprimer la vidéo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={isVideoPending}
                style={{
                  width: '100%', aspectRatio: '16/9', borderRadius: 8,
                  border: `1.5px dashed ${AD.borderStrong}`,
                  background: AD.bg,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: AD.inkMuted, fontSize: 11, gap: 4,
                  cursor: isVideoPending ? 'not-allowed' : 'pointer',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M8 3V13M3 8H13" />
                </svg>
                {isVideoPending ? 'En cours…' : 'Ajouter une vidéo'}
              </button>
            )}
            <p style={{ fontSize: 11, color: AD.inkSubtle, marginTop: 8, marginBottom: 0 }}>
              MP4, WebM — une vidéo à la fois.
            </p>
          </div>

          {/* Famille d'accueil active */}
          <div style={{ ...card, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: AD.ink, marginBottom: 10 }}>Famille d&apos;accueil</div>
            {activeAssignments.length > 0 ? (
              <div style={{ display: 'grid', gap: 8 }}>
                {activeAssignments.map((a) => (
                  <div key={a.id} style={{ padding: '8px 10px', background: AD.surfaceAlt, borderRadius: 7 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: AD.ink }}>
                      {a.foster_family?.address ?? 'Famille inconnue'}
                    </div>
                    {a.start_date && (
                      <div style={{ fontSize: 11, color: AD.inkMuted, marginTop: 2 }}>
                        Depuis le {new Date(a.start_date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12.5, color: AD.inkMuted, margin: 0 }}>
                Aucune affectation en cours.
              </p>
            )}
          </div>

          {/* Responsable & backups */}
          <form
            onSubmit={handleSaveReferents}
            style={{ ...card, padding: 18, opacity: isReferentsPending ? 0.6 : 1, transition: 'opacity 0.15s' }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: AD.ink, marginBottom: 4 }}>Responsable & backups</div>
            <div style={cardHint}>Qui est notifié quand une demande d&apos;adoption arrive pour ce chat.</div>

            <div style={{ marginBottom: 12 }}>
              <span style={label}>Responsable d&apos;adoption</span>
              <select name="referent_id" defaultValue={animal.referent?.id ?? ''} style={input}>
                <option value="">— Aucun —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <span style={label}>Backups (si le responsable est absent)</span>
              <div style={{ display: 'grid', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                {users.map((u) => (
                  <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12.5, color: AD.ink }}>
                    <input
                      type="checkbox"
                      name="backup_referent_ids"
                      value={u.id}
                      checked={backupIds.includes(u.id)}
                      onChange={() => toggleBackup(u.id)}
                    />
                    {u.username}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isReferentsPending}
              style={{
                width: '100%', padding: '8px 0', fontSize: 12, fontWeight: 600,
                background: isReferentsPending ? AD.border : AD.coral, color: '#fff',
                border: 'none', borderRadius: 6, cursor: isReferentsPending ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {isReferentsPending ? 'En cours…' : 'Enregistrer'}
            </button>
          </form>

          {/* Suivi médical */}
          <div style={{ ...card, padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: AD.ink, marginBottom: 12 }}>Suivi médical</div>

            <div style={{ display: 'grid', gap: 6, marginBottom: 14, opacity: isMedicalPending ? 0.6 : 1, transition: 'opacity 0.15s' }}>
              {medicalHistory.length === 0 && (
                <p style={{ fontSize: 12.5, color: AD.inkMuted, margin: 0 }}>Aucun événement enregistré.</p>
              )}
              {medicalHistory.map((event) => (
                <div key={event.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
                  padding: '8px 10px', background: AD.surfaceAlt, borderRadius: 7,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: AD.ink }}>
                      {MEDICAL_EVENT_LABEL[event.event_type]} · {new Date(event.event_date).toLocaleDateString('fr-FR')}
                    </div>
                    {event.veterinarian && (
                      <div style={{ fontSize: 11, color: AD.inkMuted, marginTop: 2 }}>{event.veterinarian}</div>
                    )}
                    {event.note && (
                      <div style={{ fontSize: 11.5, color: AD.inkMuted, marginTop: 2 }}>{event.note}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicalEvent(event.id)}
                    disabled={isMedicalPending}
                    style={{
                      flexShrink: 0, padding: '3px 7px', fontSize: 10,
                      background: '#FEE6E5', color: AD.coralInk,
                      border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 600,
                    }}
                  >✕</button>
                </div>
              ))}
            </div>

            <form ref={medicalFormRef} onSubmit={handleAddMedicalEvent} style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input name="event_date" type="date" required style={{ ...input, fontSize: 12 }} />
                <select name="event_type" defaultValue="consultation" style={{ ...input, fontSize: 12 }}>
                  {Object.entries(MEDICAL_EVENT_LABEL).map(([value, entryLabel]) => (
                    <option key={value} value={value}>{entryLabel}</option>
                  ))}
                </select>
              </div>
              <input name="veterinarian" placeholder="Vétérinaire (facultatif)" style={{ ...input, fontSize: 12 }} />
              <input name="note" placeholder="Note (facultatif)" style={{ ...input, fontSize: 12 }} />
              <button
                type="submit"
                disabled={isMedicalPending}
                style={{
                  padding: '7px 0', fontSize: 11.5, fontWeight: 600,
                  background: AD.surfaceAlt, color: AD.coralInk,
                  border: `1px solid ${AD.border}`, borderRadius: 6, cursor: isMedicalPending ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                + Ajouter un événement
              </button>
            </form>
          </div>

          {/* Zone sensible */}
          <div style={{ background: '#FEE6E5', border: '1px solid #F5C5C3', borderRadius: 10, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', background: '#fff', flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={AD.coralInk} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3L14 13H2L8 3Z" /><path d="M8 7V9" /><circle cx="8" cy="11" r="0.5" fill={AD.coralInk} />
                </svg>
              </span>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: AD.coralInk }}>Zone sensible</div>
            </div>
            <div style={{ fontSize: 11.5, color: AD.ink, lineHeight: 1.5, marginBottom: 12 }}>
              Supprimer ce chat le retire définitivement du site public. Cette action est irréversible.
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 6,
                background: 'transparent', border: `1px solid ${AD.coral}`, color: AD.coralInk,
                fontSize: 12, fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Supprimer la fiche
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
