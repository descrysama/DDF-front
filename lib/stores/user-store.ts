'use client'

import { create } from 'zustand'
import type { AuthUser } from '@/lib/auth'

interface UserState {
  user: AuthUser | null
  hydrated: boolean
  setUser: (user: AuthUser | null) => void
  clear: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  hydrated: false,
  setUser: (user) => set({ user, hydrated: true }),
  clear: () => set({ user: null, hydrated: true }),
}))

export const useIsAdmin = () =>
  useUserStore((s) => s.user?.role?.name?.toLowerCase() === 'admin')
