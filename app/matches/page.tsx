import { redirect } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getCurrentUser } from "@/lib/auth"
import { fetchAdopterProfile, fetchDiscoverAnimals } from "@/lib/strapi"
import { SwipeDeck } from "./_components/swipe-deck"

export default async function MatchesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?from=/matches")

  const [cats, profile] = await Promise.all([
    fetchDiscoverAnimals(user.id, { limit: 30 }),
    fetchAdopterProfile(user.id),
  ])

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <main className="flex-1">
        <SwipeDeck initialCats={cats} hasProfile={Boolean(profile)} />
      </main>
      <Footer />
    </div>
  )
}
