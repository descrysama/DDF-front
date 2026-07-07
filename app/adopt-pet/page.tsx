import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { fetchAnimals } from "@/lib/strapi"
import { AdoptionFilters } from "./_components/adoption-filters"

export default async function AdoptionPage() {
  const { animals, total } = await fetchAnimals({ limit: 100 })

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        {/* Page header */}
        <section className="max-w-[1200px] mx-auto px-6 pt-10 pb-5">
          <div className="text-xs text-ink-muted mb-3">
            <Link href="/" className="text-ink-muted no-underline">Accueil</Link>
            <span className="mx-2 text-coral">—</span>
            <span className="text-ink">À l&apos;adoption</span>
          </div>

          <div className="flex justify-between items-end flex-wrap gap-6">
            <h1 className="text-h1-sm leading-none tracking-[-0.03em] font-semibold m-0 text-ink">
              Trouvez votre nouveau{" "}
              <span className="text-coral">compagnon</span>.
            </h1>
            <div className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">{total} chats</span>{" "}
              disponibles · mis à jour aujourd&apos;hui
            </div>
          </div>
        </section>

        <AdoptionFilters cats={animals} />
      </main>
      <Footer />
    </div>
  )
}