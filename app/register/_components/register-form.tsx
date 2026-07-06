'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/stores/user-store'

export default function RegisterForm() {
  const router = useRouter()
  const setUser = useUserStore((s) => s.setUser)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (password.length < 8) {
      setError('Mot de passe: 8 caractères minimum')
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? "Impossible de créer le compte")
      return
    }
    setUser(data.user)
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Nom d'utilisateur</span>
        <input
          type="text"
          required
          minLength={3}
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm text-ink outline-none focus:border-coral"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm text-ink outline-none focus:border-coral"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Mot de passe</span>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm text-ink outline-none focus:border-coral"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Confirmer le mot de passe</span>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm text-ink outline-none focus:border-coral"
        />
      </label>
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-md bg-coral px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Création…' : 'Créer mon compte'}
      </button>
    </form>
  )
}
