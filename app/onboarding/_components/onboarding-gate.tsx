"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/stores/user-store"
import { OnboardingWizard } from "./onboarding-wizard"

export function OnboardingGate() {
  const user = useUserStore((s) => s.user)
  const hydrated = useUserStore((s) => s.hydrated)
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?from=/onboarding")
    }
  }, [hydrated, user, router])

  if (!hydrated || !user) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-coral border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="flex-1 px-4 py-16">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-ink m-0">Bienvenue, {user.username} !</h1>
          <p className="text-sm text-ink-muted mt-2">
            Quelques infos sur votre foyer pour calculer votre compatibilité avec chaque chat.
          </p>
        </div>
        <OnboardingWizard />
      </div>
    </main>
  )
}
