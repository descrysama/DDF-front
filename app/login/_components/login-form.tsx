'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/stores/user-store'

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter()
  const setUser = useUserStore((s) => s.setUser)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'Erreur de connexion')
      return
    }
    setUser(data.user)
    router.push(redirectTo ?? '/')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Email ou nom d'utilisateur</span>
        <input
          type="text"
          required
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="rounded-md border border-border px-3 py-2 text-sm text-ink outline-none focus:border-coral"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Mot de passe</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}
