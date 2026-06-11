'use client'
import { useState, useTransition } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
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
  const [, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>(defaultValues.status ?? 'draft')

  function handleStatusChange(value: string | null) {
    if (value !== null) setStatus(value)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      try { await action(formData) }
      catch (err) { setError(err instanceof Error ? err.message : String(err)) }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required defaultValue={defaultValues.title ?? ''} placeholder="Ex: Mimi cherche un foyer" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Statut</Label>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Ouvert</SelectItem>
            <SelectItem value="closed">Fermé</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="status" value={status} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={5} defaultValue={defaultValues.description ?? ''} placeholder="Décrivez l'annonce..." />
      </div>
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      <SubmitButton label="Enregistrer" />
    </form>
  )
}
