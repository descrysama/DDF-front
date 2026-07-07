"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { useUserStore } from "@/lib/stores/user-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User, Mail, Shield, Pencil, Check, X, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const user = useUserStore((s) => s.user)
  const hydrated = useUserStore((s) => s.hydrated)
  const setUser = useUserStore((s) => s.setUser)
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?from=/profile")
    }
  }, [hydrated, user, router])

  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setEmail(user.email)
    }
  }, [user])

  function startEditing() {
    setError("")
    setSuccess("")
    setEditing(true)
  }

  function cancelEditing() {
    if (user) {
      setUsername(user.username)
      setEmail(user.email)
    }
    setEditing(false)
    setError("")
  }

  async function handleSave() {
    if (!user) return
    if (!username.trim() || !email.trim()) {
      setError("Tous les champs sont requis.")
      return
    }

    if (username === user.username && email === user.email) {
      setEditing(false)
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la mise à jour.")
        return
      }

      setUser(data.user)
      setEditing(false)
      setSuccess("Profil mis à jour avec succès.")
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-coral border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  const roleName = user.role?.name ?? "Utilisateur"

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-16">
        <div className="max-w-lg mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-coral flex items-center justify-center mb-4">
              <User size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-ink m-0">{user.username}</h1>
            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-coral-soft text-coral text-xs font-semibold">
              <Shield size={12} />
              {roleName}
            </span>
          </div>

          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide m-0">
                Informations du compte
              </h2>
              {!editing ? (
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-coral bg-coral-soft border-0 cursor-pointer hover:bg-coral hover:text-white transition-colors"
                >
                  <Pencil size={12} />
                  Modifier
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-coral border-0 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    Enregistrer
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-ink bg-surface-alt border-0 cursor-pointer hover:bg-border transition-colors disabled:opacity-50"
                  >
                    <X size={12} />
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <div className="divide-y divide-border">
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-lg bg-surface-alt flex items-center justify-center shrink-0">
                  <User size={16} className="text-ink-muted" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-muted m-0">Nom d&apos;utilisateur</p>
                  {editing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-md border border-border bg-bg text-sm text-ink outline-none focus:border-coral focus:ring-1 focus:ring-coral"
                    />
                  ) : (
                    <p className="text-sm font-medium text-ink m-0 mt-0.5 truncate">{user.username}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-lg bg-surface-alt flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-ink-muted" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-muted m-0">Adresse email</p>
                  {editing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-md border border-border bg-bg text-sm text-ink outline-none focus:border-coral focus:ring-1 focus:ring-coral"
                    />
                  ) : (
                    <p className="text-sm font-medium text-ink m-0 mt-0.5 truncate">{user.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-lg bg-surface-alt flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-ink-muted" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-ink-muted m-0">Rôle</p>
                  <p className="text-sm font-medium text-ink m-0 mt-0.5 truncate">{roleName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
