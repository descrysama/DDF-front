'use client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import SubmitButton from '@/components/admin/submit-button'
import { useServerFormAction } from '@/lib/hooks/use-server-form-action'
import type { StrapiFosterFamilyRaw } from '@/lib/strapi'

type FosterFamilyFormData = Pick<StrapiFosterFamilyRaw, 'address' | 'max_capacity' | 'has_children' | 'has_dogs' | 'has_cats'>

interface FosterFamilyFormProps {
  defaultValues?: Partial<FosterFamilyFormData>
  action: (formData: FormData) => Promise<void>
}

export default function FosterFamilyForm({ defaultValues = {}, action }: FosterFamilyFormProps) {
  const { error, isPending, handleSubmit } = useServerFormAction(action)

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="address">Adresse</FieldLabel>
          <Input id="address" name="address" required defaultValue={defaultValues.address ?? ''} placeholder="Ex: 12 rue des Lilas, 69001 Lyon" />
        </Field>
        <Field>
          <FieldLabel htmlFor="max_capacity">Capacité maximale</FieldLabel>
          <Input id="max_capacity" name="max_capacity" type="number" required min={1} defaultValue={defaultValues.max_capacity ?? 1} />
        </Field>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Présence dans le foyer</p>
          {[
            { name: 'has_children', label: 'Enfants présents', checked: defaultValues.has_children },
            { name: 'has_dogs',     label: 'Chiens présents',  checked: defaultValues.has_dogs },
            { name: 'has_cats',     label: 'Chats présents',   checked: defaultValues.has_cats },
          ].map(({ name, label, checked }) => (
            <Label key={name} className="flex cursor-pointer items-center gap-2 font-normal">
              <input type="checkbox" name={name} defaultChecked={!!checked} className="size-4 rounded" />
              {label}
            </Label>
          ))}
        </div>
        <FormError message={error} />
        <SubmitButton label="Enregistrer" pending={isPending} />
      </FieldGroup>
    </form>
  )
}
