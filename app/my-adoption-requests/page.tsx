import { redirect } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getCurrentUser } from "@/lib/auth"
import { fetchMyAdoptionRequests } from "@/lib/strapi"
import { RequestCard } from "./_components/request-card"

export default async function MyAdoptionRequestsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?from=/my-adoption-requests")

  const requests = await fetchMyAdoptionRequests(user.id)

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-semibold text-ink tracking-[-0.02em] mb-1">Mes demandes d&apos;adoption</h1>
        <p className="text-sm text-ink-muted mb-8">
          {requests.length > 0
            ? `${requests.length} demande${requests.length > 1 ? "s" : ""} envoyée${requests.length > 1 ? "s" : ""}`
            : "Vous n'avez pas encore fait de demande d'adoption."}
        </p>

        {requests.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-ink-muted mb-4">
              Parcourez nos chats disponibles pour trouver votre futur compagnon.
            </p>
            <Link href="/adopt-pet" className="inline-block bg-coral text-white text-sm font-semibold px-4 py-2 rounded-lg">
              Voir les chats à adopter
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((request) => (
              <RequestCard key={request.documentId} request={request} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
