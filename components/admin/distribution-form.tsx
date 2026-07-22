'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import SubmitButton from '@/components/admin/submit-button'
import { useServerFormAction } from '@/lib/hooks/use-server-form-action'
import type { DistributionStatus, StrapiDistributionRaw, StrapiUser } from '@/lib/strapi'

const STATUS_ITEMS: Record<string, string> = { planned: 'Planifiée', completed: 'Terminée', cancelled: 'Annulée' }

interface DistributionFormData {
  date?: string
  location?: string
  status?: DistributionStatus
  notes?: string | null
  volunteers?: StrapiUser[]
}

interface DistributionFormProps {
  defaultValues?: DistributionFormData
  users: StrapiUser[]
  action: (formData: FormData) => Promise<void>
}

export default function DistributionForm({ defaultValues = {}, users, action }: DistributionFormProps) {
  const { error, isPending, handleSubmit } = useServerFormAction(action)
  const [status, setStatus] = useState<string>(defaultValues.status ?? 'planned')

  function handleStatusChange(value: string | null) {
    if (value !== null) setStatus(value)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="date">Date</FieldLabel>
          <Input id="date" name="date" type="date" required defaultValue={defaultValues.date ?? ''} />
        </Field>
        <Field>
          <FieldLabel htmlFor="location">Lieu</FieldLabel>
          <Input
            id="location"
            name="location"
            required
            defaultValue={defaultValues.location ?? 'Rue Desaix, Lyon 3e'}
            placeholder="Ex: Rue Desaix, Lyon 3e"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="status">Statut</FieldLabel>
          <Select value={status} onValueChange={handleStatusChange} items={STATUS_ITEMS}>
            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planifiée</SelectItem>
              <SelectItem value="completed">Terminée</SelectItem>
              <SelectItem value="cancelled">Annulée</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="status" value={status} />
        </Field>
        <Field>
          <FieldLabel htmlFor="notes">Notes</FieldLabel>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={defaultValues.notes ?? ''}
            placeholder="Quantité distribuée, remarques..."
          />
        </Field>
        <Field>
          <FieldLabel>Bénévoles inscrits</FieldLabel>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {users.map((u) => (
              <Label key={u.id} htmlFor={`volunteer-${u.id}`} className="flex cursor-pointer items-center gap-2 font-normal">
                <Checkbox
                  id={`volunteer-${u.id}`}
                  name="volunteer_ids"
                  value={String(u.id)}
                  defaultChecked={(defaultValues.volunteers ?? []).some((v) => v.id === u.id)}
                />
                {u.username}
              </Label>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun utilisateur disponible.</p>
            )}
          </div>
        </Field>
        <FormError message={error} />
        <SubmitButton label="Enregistrer" pending={isPending} />
      </FieldGroup>
    </form>
  )
}
