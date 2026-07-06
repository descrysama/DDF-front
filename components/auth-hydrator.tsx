'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/lib/stores/user-store'

export default function AuthHydrator() {
  const hydrated = useUserStore((s) => s.hydrated)
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    if (hydrated) return
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null))
  }, [hydrated, setUser])

  return null
}
