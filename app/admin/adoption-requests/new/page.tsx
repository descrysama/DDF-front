import Link from 'next/link'
import { fetchAnnouncements, fetchUsers } from '@/lib/strapi'
import { createAdoptionRequest } from '../actions'
import { ADMIN } from '@/lib/admin-tokens'

const fieldStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  border: `1px solid ${ADMIN.border}`,
  borderRadius: 6,
  fontSize: 14,
  color: ADMIN.ink,
  background: '#fff',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: ADMIN.ink,
  marginBottom: 4,
}

export default async function NewAdoptionRequestPage() {
  const [{ announcements }, users] = await Promise.all([
    fetchAnnouncements({ limit: 100 }),
    fetchUsers(),
  ])

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
      <h1 style={{ fontSize: 22, fontWeight: 700, color: ADMIN.ink, marginBottom: 24 }}>
        Nouvelle demande d&apos;adoption
      </h1>

      <div
        style={{
          background: ADMIN.card,
          border: `1px solid ${ADMIN.border}`,
          borderRadius: 10,
          padding: 28,
          maxWidth: 640,
        }}
      >
        <form action={createAdoptionRequest}>
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

          <button
            type="submit"
            style={{
              padding: '10px 24px',
              background: ADMIN.coral,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Créer la demande
          </button>
        </form>
      </div>
    </div>
  )
}
