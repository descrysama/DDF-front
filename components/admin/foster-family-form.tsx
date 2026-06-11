'use client'

import { useState, useTransition } from 'react'
import { ADMIN } from '@/lib/admin-tokens'
import { fieldStyle, labelStyle } from '@/lib/admin-styles'
import SubmitButton from '@/components/admin/submit-button'
import type { StrapiFosterFamilyRaw } from '@/lib/strapi'

type FosterFamilyFormData = Pick<
  StrapiFosterFamilyRaw,
  'address' | 'max_capacity' | 'has_children' | 'has_dogs' | 'has_cats'
>

interface FosterFamilyFormProps {
  defaultValues?: Partial<FosterFamilyFormData>
  action: (formData: FormData) => Promise<void>
}

export default function FosterFamilyForm({ defaultValues = {}, action }: FosterFamilyFormProps) {
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
      {/* Address */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Adresse</label>
        <input
          name="address"
          required
          defaultValue={defaultValues.address ?? ''}
          style={fieldStyle}
          placeholder="Ex: 12 rue des Lilas, 69001 Lyon"
        />
      </div>

      {/* Max capacity */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Capacité maximale</label>
        <input
          name="max_capacity"
          type="number"
          required
          min={1}
          defaultValue={defaultValues.max_capacity ?? 1}
          style={fieldStyle}
        />
      </div>

      {/* Checkboxes */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ ...labelStyle, marginBottom: 10 }}>Présence dans le foyer</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'has_children', label: 'Enfants présents',  checked: defaultValues.has_children },
            { name: 'has_dogs',     label: 'Chiens présents',   checked: defaultValues.has_dogs },
            { name: 'has_cats',     label: 'Chats présents',    checked: defaultValues.has_cats },
          ].map(({ name, label, checked }) => (
            <label
              key={name}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: ADMIN.ink }}
            >
              <input type="checkbox" name={name} defaultChecked={!!checked} />
              {label}
            </label>
          ))}
        </div>
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
