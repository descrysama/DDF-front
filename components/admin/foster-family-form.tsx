'use client'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Combobox,
  ComboboxValue,
  ComboboxInputGroup,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipRemove,
} from '@/components/ui/combobox'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import SubmitButton from '@/components/admin/submit-button'
import StatusBadge from '@/components/admin/status-badge'
import { useServerFormAction } from '@/lib/hooks/use-server-form-action'
import type { FosterPickerAnimal, StrapiFosterFamilyRaw, StrapiUser } from '@/lib/strapi'

type FosterFamilyFormData = Pick<StrapiFosterFamilyRaw, 'address' | 'max_capacity' | 'has_children' | 'has_dogs' | 'has_cats' | 'is_available'>

interface UserOption {
  value: number
  label: string
}

interface AnimalOption {
  value: number
  label: string
  status: FosterPickerAnimal['status']
}

interface FosterFamilyFormProps {
  defaultValues?: Partial<FosterFamilyFormData> & { linkedAnimalIds?: number[]; userId?: number | null }
  animals?: FosterPickerAnimal[]
  users?: StrapiUser[]
  action: (formData: FormData) => Promise<void>
}

export default function FosterFamilyForm({ defaultValues = {}, animals = [], users = [], action }: FosterFamilyFormProps) {
  const { error, isPending, handleSubmit } = useServerFormAction(action)
  const linkedAnimalIds = defaultValues.linkedAnimalIds ?? []
  const userOptions: UserOption[] = users.map((u) => ({ value: u.id, label: `${u.username} (${u.email})` }))
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(
    userOptions.find((o) => o.value === defaultValues.userId) ?? null
  )
  const animalOptions: AnimalOption[] = animals.map((a) => ({ value: a.id, label: a.name, status: a.status }))
  const [selectedAnimals, setSelectedAnimals] = useState<AnimalOption[]>(
    animalOptions.filter((o) => linkedAnimalIds.includes(o.value))
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="user_id">Utilisateur lié</FieldLabel>
          <Combobox items={userOptions} value={selectedUser} onValueChange={setSelectedUser}>
            <ComboboxInputGroup>
              <ComboboxInput id="user_id" placeholder="Rechercher un utilisateur…" />
              <ComboboxTrigger />
            </ComboboxInputGroup>
            <ComboboxContent emptyMessage="Aucun utilisateur trouvé.">
              {(item: UserOption) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxContent>
          </Combobox>
          <input type="hidden" name="user_id" value={selectedUser?.value ?? ''} />
        </Field>
        <Field>
          <FieldLabel htmlFor="address">Adresse</FieldLabel>
          <Input id="address" name="address" required defaultValue={defaultValues.address ?? ''} placeholder="Ex: 12 rue des Lilas, 69001 Lyon" />
        </Field>
        <Field>
          <FieldLabel htmlFor="max_capacity">Capacité maximale</FieldLabel>
          <Input id="max_capacity" name="max_capacity" type="number" required min={1} defaultValue={defaultValues.max_capacity ?? 1} />
        </Field>
        <Field>
          <FieldLabel>Présence dans le foyer</FieldLabel>
          <div className="flex flex-col gap-2">
            {[
              { name: 'has_children', label: 'Enfants présents', checked: defaultValues.has_children },
              { name: 'has_dogs',     label: 'Chiens présents',  checked: defaultValues.has_dogs },
              { name: 'has_cats',     label: 'Chats présents',   checked: defaultValues.has_cats },
            ].map(({ name, label, checked }) => (
              <Label key={name} htmlFor={name} className="flex cursor-pointer items-center gap-2 font-normal">
                <Checkbox id={name} name={name} defaultChecked={!!checked} />
                {label}
              </Label>
            ))}
          </div>
        </Field>
        <Field>
          <Label htmlFor="is_available" className="flex cursor-pointer items-center gap-2 font-normal">
            <Checkbox id="is_available" name="is_available" defaultChecked={defaultValues.is_available ?? true} />
            Disponible pour un nouveau placement
          </Label>
        </Field>
        <Field>
          <FieldLabel htmlFor="animal_ids">Chats à héberger</FieldLabel>
          <Combobox items={animalOptions} multiple value={selectedAnimals} onValueChange={setSelectedAnimals}>
            <ComboboxChips>
              <ComboboxValue>
                {(value: AnimalOption[]) =>
                  value.map((item) => (
                    <ComboboxChip key={item.value}>
                      {item.label}
                      <ComboboxChipRemove aria-label={`Retirer ${item.label}`} />
                    </ComboboxChip>
                  ))
                }
              </ComboboxValue>
              <ComboboxInput id="animal_ids" placeholder="Rechercher un chat…" />
            </ComboboxChips>
            <ComboboxContent emptyMessage="Aucun chat trouvé.">
              {(item: AnimalOption) => (
                <ComboboxItem key={item.value} value={item}>
                  <span className="flex flex-1 items-center justify-between gap-2">
                    {item.label}
                    <StatusBadge status={item.status} />
                  </span>
                </ComboboxItem>
              )}
            </ComboboxContent>
          </Combobox>
          {selectedAnimals.map((a) => (
            <input key={a.value} type="hidden" name="animal_ids" value={a.value} />
          ))}
          {animalOptions.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun chat disponible.</p>
          )}
        </Field>
        <FormError message={error} />
        <SubmitButton label="Enregistrer" pending={isPending} />
      </FieldGroup>
    </form>
  )
}
