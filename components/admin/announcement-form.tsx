'use client'

import { useState, useTransition } from 'react'
import { ADMIN } from '@/lib/admin-tokens'
import type { AnnouncementStatus } from '@/lib/strapi'

interface AnnouncementFormData {
  title?: string
  description?: string | null
  status?: AnnouncementStatus
}

interface AnnouncementFormProps {
  defaultValues?: AnnouncementFormData
  action: (formData: FormData) => Promise<void>
}

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

export default function AnnouncementForm({ defaultValues = {}, action }: AnnouncementFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      try {
        await action(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Titre</label>
        <input
          name="title"
          required
          defaultValue={defaultValues.title ?? ''}
          style={fieldStyle}
          placeholder="Ex: Mimi cherche un foyer"
        />
      </div>

      {/* Status */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Statut</label>
        <select name="status" required defaultValue={defaultValues.status ?? 'draft'} style={fieldStyle}>
          <option value="open">Ouvert</option>
          <option value="closed">Fermé</option>
          <option value="draft">Brouillon</option>
        </select>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          rows={5}
          defaultValue={defaultValues.description ?? ''}
          style={{ ...fieldStyle, resize: 'vertical' }}
          placeholder="Décrivez l'annonce..."
        />
      </div>

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            background: '#FEE6E5',
            border: '1px solid #F76C70',
            borderRadius: 6,
            fontSize: 13,
            color: '#B43A3F',
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '10px 24px',
          background: isPending ? '#c4c4c4' : ADMIN.coral,
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 14,
          cursor: isPending ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
