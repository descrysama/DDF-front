'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/stores/user-store'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { FormError } from '@/components/ui/form-error'
import { Button } from '@/components/ui/button'

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
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Nom d&apos;utilisateur</FieldLabel>
          <Input
            id="username"
            type="text"
            required
            minLength={3}
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm">Confirmer le mot de passe</FieldLabel>
          <Input
            id="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <FormError message={error} />
        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-auto rounded-md bg-coral px-4 py-2.5 text-sm font-semibold text-white hover:bg-coral disabled:opacity-60"
        >
          {loading ? 'Création…' : 'Créer mon compte'}
        </Button>
      </FieldGroup>
    </form>
  )
}
