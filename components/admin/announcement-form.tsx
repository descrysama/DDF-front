'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import SubmitButton from '@/components/admin/submit-button'
import { useServerFormAction } from '@/lib/hooks/use-server-form-action'
import type { AnnouncementStatus } from '@/lib/strapi'

const STATUS_ITEMS: Record<string, string> = { open: 'Ouvert', closed: 'Fermé', draft: 'Brouillon' }

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
  const { error, isPending, handleSubmit } = useServerFormAction(action)
  const [status, setStatus] = useState<string>(defaultValues.status ?? 'draft')

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
          <FieldLabel htmlFor="status">Statut</FieldLabel>
          <Select value={status} onValueChange={handleStatusChange} items={STATUS_ITEMS}>
            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Ouvert</SelectItem>
              <SelectItem value="closed">Fermé</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="status" value={status} />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" name="description" rows={5} defaultValue={defaultValues.description ?? ''} placeholder="Décrivez l'annonce..." />
        </Field>
        <FormError message={error} />
        <SubmitButton label="Enregistrer" pending={isPending} />
      </FieldGroup>
    </form>
  )
}
