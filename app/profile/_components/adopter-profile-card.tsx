"use client"

import { useEffect, useState } from "react"
import { Home, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ACTIVITY_LABEL, type AdopterActivityPreference, type AdopterAgePreference, type AdopterExperience, type AdopterHousingType, type StrapiAdopterProfileRaw } from "@/lib/strapi"

type FormState = Pick<
  StrapiAdopterProfileRaw,
  'housing_type' | 'has_garden' | 'has_children' | 'has_dogs' | 'has_cats' | 'experience_level' | 'age_preference' | 'activity_level_preference' | 'motivation'
>

const DEFAULT_STATE: FormState = {
  housing_type: 'apartment',
  has_garden: false,
  has_children: false,
  has_dogs: false,
  has_cats: false,
  experience_level: 'none',
  age_preference: 'peu_importe',
  activity_level_preference: 'peu_importe',
  motivation: '',
}

export function AdopterProfileCard() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState<FormState>(DEFAULT_STATE)

  useEffect(() => {
    fetch("/api/adopter-profile")
      .then((res) => res.json())
      .then((data: { profile: StrapiAdopterProfileRaw | null }) => {
        if (data.profile) {
          const { housing_type, has_garden, has_children, has_dogs, has_cats, experience_level, age_preference, activity_level_preference, motivation } = data.profile
          setForm({ housing_type, has_garden, has_children, has_dogs, has_cats, experience_level, age_preference, activity_level_preference, motivation })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setSuccess(false)
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/adopter-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Erreur lors de l'enregistrement.")
        return
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-border bg-white shadow-sm px-6 py-8 flex items-center justify-center">
        <Loader2 size={18} className="animate-spin text-ink-muted" />
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide m-0">Profil adoptant</h2>
        <p className="text-xs text-ink-muted m-0 mt-1">
          Utilisé pour calculer votre % de compatibilité avec chaque chat, sur les fiches et dans le swipe.
        </p>
      </div>

      <div className="px-6 py-5 grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-ink-muted mb-1.5 block">Type de logement</Label>
            <Select value={form.housing_type ?? undefined} onValueChange={(v) => v && patch('housing_type', v as AdopterHousingType)}>
              <SelectTrigger className="w-full h-auto py-2 text-sm"><SelectValue placeholder="Choisir…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Appartement</SelectItem>
                <SelectItem value="house">Maison</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-ink-muted mb-1.5 block">Expérience avec les chats</Label>
            <Select value={form.experience_level} onValueChange={(v) => v && patch('experience_level', v as AdopterExperience)}>
              <SelectTrigger className="w-full h-auto py-2 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                <SelectItem value="some">Un peu</SelectItem>
                <SelectItem value="experienced">Expérimenté·e</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs text-ink-muted mb-1.5 block">Préférence d&apos;âge</Label>
          <Select value={form.age_preference} onValueChange={(v) => v && patch('age_preference', v as AdopterAgePreference)}>
            <SelectTrigger className="w-full h-auto py-2 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="chaton">Chaton</SelectItem>
              <SelectItem value="adulte">Adulte</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="peu_importe">Peu importe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-ink-muted mb-1.5 block">Préférence d&apos;énergie</Label>
          <Select value={form.activity_level_preference} onValueChange={(v) => v && patch('activity_level_preference', v as AdopterActivityPreference)}>
            <SelectTrigger className="w-full h-auto py-2 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">{ACTIVITY_LABEL.low}</SelectItem>
              <SelectItem value="medium">{ACTIVITY_LABEL.medium}</SelectItem>
              <SelectItem value="high">{ACTIVITY_LABEL.high}</SelectItem>
              <SelectItem value="peu_importe">Peu importe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs text-ink-muted mb-2 block flex items-center gap-1.5">
            <Home size={12} /> Votre foyer
          </Label>
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'has_garden' as const, label: 'Jardin sécurisé' },
              { key: 'has_children' as const, label: 'Enfants' },
              { key: 'has_dogs' as const, label: 'Chien(s)' },
              { key: 'has_cats' as const, label: 'Chat(s)' },
            ].map(({ key, label }) => (
              <Label key={key} className="flex items-center gap-2 font-normal text-sm text-ink cursor-pointer">
                <Checkbox checked={form[key]} onCheckedChange={(v) => patch(key, v === true)} />
                {label}
              </Label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs text-ink-muted mb-1.5 block">Votre motivation</Label>
          <Textarea
            rows={3}
            value={form.motivation ?? ''}
            onChange={(e) => patch('motivation', e.target.value)}
            placeholder="Ce qui vous donne envie d'adopter…"
            className="text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600 m-0">{error}</p>}

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-auto gap-1.5 px-4 py-2 border-0 text-xs font-semibold text-white bg-coral hover:bg-coral hover:opacity-90"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            Enregistrer mon profil
          </Button>
          {success && <span className="text-xs text-green-700">Enregistré.</span>}
        </div>
      </div>
    </div>
  )
}
