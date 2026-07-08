'use client'

import { useState, useTransition } from 'react'

export function useServerFormAction(action: (formData: FormData) => Promise<void>) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      try {
        await action(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    })
  }

  return { error, isPending, handleSubmit }
}
