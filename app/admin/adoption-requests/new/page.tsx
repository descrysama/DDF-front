import Link from 'next/link'
import { fetchAnnouncements, fetchUsers, fetchAnimals } from '@/lib/strapi'
import { createAdoptionRequest } from '../actions'
import { AD } from '@/lib/admin-tokens'
import { fieldStyle, labelStyle } from '@/lib/admin-styles'
import SubmitButton from '@/components/admin/submit-button'
import { Card } from '@/components/ui/card'

export default async function NewAdoptionRequestPage() {
  const [{ announcements }, users, { animals }] = await Promise.all([
    fetchAnnouncements({ limit: 100 }),
    fetchUsers(),
    fetchAnimals({ limit: 200 }),
  ])

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
      <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 24 }}>
        Nouvelle demande d&apos;adoption
      </h1>

      <Card className="p-7 max-w-2xl hover:translate-y-0">
        <form action={createAdoptionRequest}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Chat concerné</label>
            <select name="animal_id" style={fieldStyle}>
              <option value="">— Aucun —</option>
              {animals.map(a => (
                <option key={a.documentId} value={a.documentId}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Annonce liée</label>
            <select name="announcement_id" style={fieldStyle}>
              <option value="">— Aucune —</option>
              {announcements.map(a => (
                <option key={a.documentId} value={a.documentId}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Adoptant</label>
            <select name="adopter_id" style={fieldStyle}>
              <option value="">— Aucun —</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Statut</label>
            <select name="status" defaultValue="pending" style={fieldStyle}>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Score de correspondance (%)</label>
            <input
              name="match_score"
              type="number"
              min={0}
              max={100}
              placeholder="Ex: 85"
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Date de la demande</label>
            <input
              name="request_date"
              type="date"
              style={fieldStyle}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Message</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Message de l'adoptant…"
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          </div>

          <SubmitButton label="Créer la demande" />
        </form>
      </Card>
    </div>
  )
}
