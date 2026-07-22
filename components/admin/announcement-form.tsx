'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Field, FieldLabel, FieldGroup, FieldDescription } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import SubmitButton from '@/components/admin/submit-button'
import { useServerFormAction } from '@/lib/hooks/use-server-form-action'
import type { AnnouncementStatus } from '@/lib/strapi'
import { AD } from '@/lib/admin-tokens'

export interface AnnouncementOption {
  documentId: string
  name: string
}

const STATUS_ITEMS: Record<string, string> = { open: 'Ouvert', closed: 'Fermé', draft: 'Brouillon' }

interface AnnouncementFormData {
  title?: string
  description?: string | null
  status?: AnnouncementStatus
  animalDocumentIds?: string[]
  constraintDocumentIds?: string[]
}

interface AnnouncementFormProps {
  defaultValues?: AnnouncementFormData
  animalOptions: AnnouncementOption[]
  constraintOptions: AnnouncementOption[]
  action: (formData: FormData) => Promise<void>
}

function CheckboxList({
  name,
  options,
  defaultSelected,
}: {
  name: string
  options: AnnouncementOption[]
  defaultSelected: string[]
}) {
  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        border: `1px solid ${AD.border}`, borderRadius: 8, padding: 10,
        maxHeight: 160, overflowY: 'auto',
      }}
    >
      {options.length === 0 && (
        <span style={{ fontSize: 12.5, color: AD.inkMuted }}>Aucune option disponible.</span>
      )}
      {options.map((opt) => (
        <label
          key={opt.documentId}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12.5, color: AD.ink, cursor: 'pointer',
            border: `1px solid ${AD.border}`, borderRadius: 999, padding: '4px 10px',
          }}
        >
          <input
            type="checkbox"
            name={name}
            value={opt.documentId}
            defaultChecked={defaultSelected.includes(opt.documentId)}
          />
          {opt.name}
        </label>
      ))}
    </div>
  )
}

export default function AnnouncementForm({ defaultValues = {}, animalOptions, constraintOptions, action }: AnnouncementFormProps) {
  const { error, isPending, handleSubmit } = useServerFormAction(action)
  const [status, setStatus] = useState<string>(defaultValues.status ?? 'open')

  function handleStatusChange(value: string | null) {
    if (value !== null) setStatus(value)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Titre</FieldLabel>
          <Input id="title" name="title" required defaultValue={defaultValues.title ?? ''} placeholder="Ex: Mimi cherche un foyer" />
        </Field>
        <Field>
          <FieldLabel htmlFor="status">Statut de la demande</FieldLabel>
          <Select value={status} onValueChange={handleStatusChange} items={STATUS_ITEMS}>
            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Ouvert — accepte des demandes</SelectItem>
              <SelectItem value="closed">Fermé — n&apos;accepte plus de demandes</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="status" value={status} />
          <FieldDescription>
            La publication (visibilité publique) est gérée séparément via le bouton « Publier ».
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" name="description" rows={5} defaultValue={defaultValues.description ?? ''} placeholder="Décrivez l'annonce..." />
        </Field>
        <Field>
          <FieldLabel>Chats concernés</FieldLabel>
          <CheckboxList name="animals" options={animalOptions} defaultSelected={defaultValues.animalDocumentIds ?? []} />
          <FieldDescription>Sélectionnez deux chats pour une adoption en duo.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Contraintes</FieldLabel>
          <CheckboxList name="constraints" options={constraintOptions} defaultSelected={defaultValues.constraintDocumentIds ?? []} />
        </Field>
        <FormError message={error} />
        <SubmitButton label="Enregistrer" pending={isPending} />
      </FieldGroup>
    </form>
  )
}
