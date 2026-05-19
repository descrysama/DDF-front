'use client'

import { useTransition } from 'react'
import { ADMIN } from '@/lib/admin-tokens'
import type { StrapiFosterFamilyRaw } from '@/lib/strapi'

type FosterFamilyFormData = Pick<
  StrapiFosterFamilyRaw,
  'address' | 'max_capacity' | 'has_children' | 'has_dogs' | 'has_cats'
>

interface FosterFamilyFormProps {
  defaultValues?: Partial<FosterFamilyFormData>
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

export default function FosterFamilyForm({ defaultValues = {}, action }: FosterFamilyFormProps) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => action(formData))
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
