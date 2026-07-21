"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
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

const STEPS = ['Logement', 'Foyer', 'Expérience', 'Motivation'] as const

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(DEFAULT_STATE)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function persistAndExit() {
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
      router.push("/")
      router.refresh()
    } catch {
      setError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  const isLast = step === STEPS.length - 1

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 pt-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i <= step ? 'bg-coral text-white' : 'bg-surface-alt text-ink-muted'
              }`}
            >
              {i < step ? <Check size={13} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 ${i < step ? 'bg-coral' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>
      <p className="px-6 mt-2 text-xs font-semibold text-ink-muted uppercase tracking-wide">
        Étape {step + 1}/{STEPS.length} — {STEPS[step]}
      </p>

      <div className="px-6 py-5 grid gap-4">
        {step === 0 && (
          <>
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
            <Label className="flex items-center gap-2 font-normal text-sm text-ink cursor-pointer">
              <Checkbox checked={form.has_garden} onCheckedChange={(v) => patch('has_garden', v === true)} />
              Jardin sécurisé
            </Label>
          </>
        )}

        {step === 1 && (
          <div className="flex flex-wrap gap-4">
            {[
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
        )}

        {step === 2 && (
          <>
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
          </>
        )}

        {step === 3 && (
          <div>
            <Label className="text-xs text-ink-muted mb-1.5 block">Votre motivation (optionnel)</Label>
            <Textarea
              rows={3}
              value={form.motivation ?? ''}
              onChange={(e) => patch('motivation', e.target.value)}
              placeholder="Ce qui vous donne envie d'adopter…"
              className="text-sm"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600 m-0">{error}</p>}

        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={persistAndExit}
            disabled={saving}
            className="text-xs text-ink-muted underline underline-offset-2 hover:text-ink disabled:opacity-60"
          >
            Passer, je compléterai plus tard
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                disabled={saving}
                className="h-auto gap-1.5 px-4 py-2 border-0 text-xs font-semibold text-ink bg-surface-alt hover:bg-border"
              >
                Précédent
              </Button>
            )}
            <Button
              type="button"
              onClick={() => (isLast ? persistAndExit() : setStep((s) => s + 1))}
              disabled={saving}
              className="h-auto gap-1.5 px-4 py-2 border-0 text-xs font-semibold text-white bg-coral hover:bg-coral hover:opacity-90"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : null}
              {isLast ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
