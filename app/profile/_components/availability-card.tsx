"use client"

import { useState } from "react"
import { Check, Loader2, PlaneTakeoff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useUserStore } from "@/lib/stores/user-store"

export function AvailabilityCard() {
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)

  const [isAbsent, setIsAbsent] = useState(user?.is_absent ?? false)
  const [absentUntil, setAbsentUntil] = useState(user?.absent_until?.slice(0, 10) ?? "")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  if (!user) return null

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_absent: isAbsent, absent_until: isAbsent ? absentUntil : null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la mise à jour.")
        return
      }
      setUser(data.user)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide m-0 flex items-center gap-2">
          <PlaneTakeoff size={14} /> Disponibilité
        </h2>
        <p className="text-xs text-ink-muted m-0 mt-1">
          Si vous êtes référent(e) sur un chat, on bascule automatiquement les demandes vers un backup pendant votre absence.
        </p>
      </div>

      <div className="px-6 py-5 grid gap-4">
        <Label className="flex items-center gap-2 font-normal text-sm text-ink cursor-pointer">
          <Checkbox checked={isAbsent} onCheckedChange={(v) => { setIsAbsent(v === true); setSuccess(false) }} />
          Je suis actuellement absent(e)
        </Label>

        {isAbsent && (
          <div>
            <Label className="text-xs text-ink-muted mb-1.5 block">Absent(e) jusqu&apos;au</Label>
            <input
              type="date"
              value={absentUntil}
              onChange={(e) => { setAbsentUntil(e.target.value); setSuccess(false) }}
              className="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm text-ink outline-none focus:border-coral"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600 m-0">{error}</p>}

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-auto gap-1.5 px-4 py-2 border-0 text-xs font-semibold text-white bg-coral hover:bg-coral hover:opacity-90"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
            Enregistrer
          </Button>
          {success && <span className="text-xs text-green-700">Enregistré.</span>}
        </div>
      </div>
    </div>
  )
}
