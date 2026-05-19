'use client'

import { useTransition } from 'react'
import { ADMIN } from '@/lib/admin-tokens'

interface AnimalFormData {
  name?: string
  age?: number
  gender?: string
  description?: string | null
  status?: string
  activity_level?: string
  ok_with_children?: boolean
  ok_with_dogs?: boolean
  ok_with_cats?: boolean
  indoor_only?: boolean
}

interface AnimalFormProps {
  defaultValues?: AnimalFormData
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

export default function AnimalForm({ defaultValues = {}, action }: AnimalFormProps) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => action(formData))
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>Nom</label>
          <input
            name="name"
            required
            defaultValue={defaultValues.name ?? ''}
            style={fieldStyle}
            placeholder="Ex: Mimi"
          />
        </div>

        {/* Age */}
        <div>
          <label style={labelStyle}>Âge (années)</label>
          <input
            name="age"
            type="number"
            required
            min={0}
            defaultValue={defaultValues.age ?? 0}
            style={fieldStyle}
          />
        </div>

        {/* Gender */}
        <div>
          <label style={labelStyle}>Genre</label>
          <select name="gender" required defaultValue={defaultValues.gender ?? 'female'} style={fieldStyle}>
            <option value="female">Femelle</option>
            <option value="male">Mâle</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={labelStyle}>Statut</label>
          <select name="status" required defaultValue={defaultValues.status ?? 'available'} style={fieldStyle}>
            <option value="available">Disponible</option>
            <option value="in_foster">En famille d&apos;accueil</option>
            <option value="reserved">Réservé</option>
            <option value="adopted">Adopté</option>
          </select>
        </div>

        {/* Activity level */}
        <div>
          <label style={labelStyle}>Niveau d&apos;activité</label>
          <select name="activity_level" required defaultValue={defaultValues.activity_level ?? 'medium'} style={fieldStyle}>
            <option value="low">Faible</option>
            <option value="medium">Moyen</option>
            <option value="high">Élevé</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={defaultValues.description ?? ''}
          style={{ ...fieldStyle, resize: 'vertical' }}
          placeholder="Décrivez l'animal..."
        />
      </div>

      {/* Checkboxes */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ ...labelStyle, marginBottom: 10 }}>Compatibilités</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'ok_with_children', label: 'Compatible enfants', checked: defaultValues.ok_with_children },
            { name: 'ok_with_dogs',     label: 'Compatible chiens',  checked: defaultValues.ok_with_dogs },
            { name: 'ok_with_cats',     label: 'Compatible chats',   checked: defaultValues.ok_with_cats },
            { name: 'indoor_only',      label: 'Intérieur uniquement', checked: defaultValues.indoor_only },
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

export type { AnimalFormData }

