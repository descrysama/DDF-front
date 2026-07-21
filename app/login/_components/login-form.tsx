'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/stores/user-store'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import { Button } from '@/components/ui/button'

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
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="identifier">Email ou nom d&apos;utilisateur</FieldLabel>
          <Input
            id="identifier"
            type="text"
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <FormError message={error} />
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-auto rounded-md bg-coral px-4 py-2.5 text-sm font-semibold text-white hover:bg-coral disabled:opacity-60"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </FieldGroup>
    </form>
  )
}
