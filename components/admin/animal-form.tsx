'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import SubmitButton from '@/components/admin/submit-button'
import { useServerFormAction } from '@/lib/hooks/use-server-form-action'

const GENDER_ITEMS: Record<string, string> = { female: 'Femelle', male: 'Mâle' }

const STATUS_ITEMS: Record<string, string> = {
  available: 'Disponible',
  in_foster: "En famille d'accueil",
  reserved: 'Réservé',
  adopted: 'Adopté',
}

const ACTIVITY_ITEMS: Record<string, string> = { low: 'Faible', medium: 'Moyen', high: 'Élevé' }

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
  vaccinated?: boolean
  sterilized?: boolean
  identified?: boolean
  dewormed?: boolean
  breed_id?: number | null
}

interface AnimalFormProps {
  defaultValues?: AnimalFormData
  action: (formData: FormData) => Promise<void>
  breeds?: { id: number; name: string }[]
  characters?: { id: number; name: string }[]
}

export default function AnimalForm({ defaultValues = {}, action, breeds = [], characters = [] }: AnimalFormProps) {
  const { error, isPending, handleSubmit } = useServerFormAction(action)
  const [gender, setGender] = useState<string>(defaultValues.gender ?? 'female')
  const [status, setStatus] = useState<string>(defaultValues.status ?? 'available')
  const [activityLevel, setActivityLevel] = useState<string>(defaultValues.activity_level ?? 'medium')
  const [breedId, setBreedId] = useState<string>(defaultValues.breed_id ? String(defaultValues.breed_id) : '')
  const breedItems: Record<string, string> = {}
  breeds.forEach((b) => { breedItems[String(b.id)] = b.name })

  function handleGenderChange(value: string | null) {
    if (value !== null) setGender(value)
  }
  function handleStatusChange(value: string | null) {
    if (value !== null) setStatus(value)
  }
  function handleActivityLevelChange(value: string | null) {
    if (value !== null) setActivityLevel(value)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nom</FieldLabel>
          <Input id="name" name="name" required defaultValue={defaultValues.name ?? ''} placeholder="Ex: Mimi" />
        </Field>

        <Field>
          <FieldLabel htmlFor="age">Âge (années)</FieldLabel>
          <Input id="age" name="age" type="number" required min={0} defaultValue={defaultValues.age ?? 0} />
        </Field>

        <Field>
          <FieldLabel htmlFor="gender">Genre</FieldLabel>
          <Select value={gender} onValueChange={handleGenderChange} items={GENDER_ITEMS}>
            <SelectTrigger id="gender" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Femelle</SelectItem>
              <SelectItem value="male">Mâle</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="gender" value={gender} />
        </Field>

        <Field>
          <FieldLabel htmlFor="status">Statut</FieldLabel>
          <Select value={status} onValueChange={handleStatusChange} items={STATUS_ITEMS}>
            <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="in_foster">En famille d&apos;accueil</SelectItem>
              <SelectItem value="reserved">Réservé</SelectItem>
              <SelectItem value="adopted">Adopté</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="status" value={status} />
        </Field>

        <Field>
          <FieldLabel htmlFor="breed_id">Race</FieldLabel>
          <Select value={breedId} onValueChange={(v) => setBreedId(v ?? '')} items={breedItems}>
            <SelectTrigger id="breed_id" className="w-full"><SelectValue placeholder="Non renseignée" /></SelectTrigger>
            <SelectContent>
              {breeds.map((b) => (
                <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="breed_id" value={breedId} />
        </Field>

        <Field>
          <FieldLabel htmlFor="activity_level">Niveau d&apos;activité</FieldLabel>
          <Select value={activityLevel} onValueChange={handleActivityLevelChange} items={ACTIVITY_ITEMS}>
            <SelectTrigger id="activity_level" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Faible</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="high">Élevé</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" name="activity_level" value={activityLevel} />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" name="description" rows={4} defaultValue={defaultValues.description ?? ''} placeholder="Décrivez l'animal..." />
        </Field>

        <Field>
          <FieldLabel>Compatibilités</FieldLabel>
          <div className="flex flex-col gap-2">
            {[
              { name: 'ok_with_children', label: 'Compatible enfants', checked: defaultValues.ok_with_children },
              { name: 'ok_with_dogs',     label: 'Compatible chiens',  checked: defaultValues.ok_with_dogs },
              { name: 'ok_with_cats',     label: 'Compatible chats',   checked: defaultValues.ok_with_cats },
              { name: 'indoor_only',      label: 'Intérieur uniquement', checked: defaultValues.indoor_only },
            ].map(({ name, label, checked }) => (
              <Label key={name} htmlFor={name} className="flex cursor-pointer items-center gap-2 font-normal">
                <Checkbox id={name} name={name} defaultChecked={!!checked} />
                {label}
              </Label>
            ))}
          </div>
        </Field>

        <Field>
          <FieldLabel>Caractère</FieldLabel>
          <div className="flex flex-col gap-2">
            {characters.map((c) => (
              <Label key={c.id} htmlFor={`character-${c.id}`} className="flex cursor-pointer items-center gap-2 font-normal">
                <Checkbox id={`character-${c.id}`} name="character_ids" value={String(c.id)} />
                {c.name}
              </Label>
            ))}
          </div>
        </Field>

        <Field>
          <FieldLabel>Santé & identification</FieldLabel>
          <div className="flex flex-col gap-2">
            {[
              { name: 'vaccinated', label: 'Vacciné',           checked: defaultValues.vaccinated },
              { name: 'sterilized', label: 'Stérilisé/castré',  checked: defaultValues.sterilized },
              { name: 'identified', label: 'Identifié',         checked: defaultValues.identified },
              { name: 'dewormed',   label: 'Déparasité',        checked: defaultValues.dewormed },
            ].map(({ name, label, checked }) => (
              <Label key={name} htmlFor={name} className="flex cursor-pointer items-center gap-2 font-normal">
                <Checkbox id={name} name={name} defaultChecked={!!checked} />
                {label}
              </Label>
            ))}
          </div>
        </Field>

        <FormError message={error} />
        <SubmitButton label="Enregistrer" pending={isPending} />
      </FieldGroup>
    </form>
  )
}

export type { AnimalFormData }
