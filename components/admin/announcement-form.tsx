'use client'

import { useState, useTransition } from 'react'
import { fieldStyle, labelStyle } from '@/lib/admin-styles'
import SubmitButton from '@/components/admin/submit-button'
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

      <SubmitButton label="Enregistrer" />
    </form>
  )
}
