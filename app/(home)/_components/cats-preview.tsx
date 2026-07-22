import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CatCard } from "@/components/cat-card"
import { fetchAnnouncements } from "@/lib/strapi"

export async function CatsPreview() {
  const { announcements, total } = await fetchAnnouncements({ limit: 4 })

  return (
    <section className="bg-bg">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-14">
        <div className="flex justify-between items-end mb-7 flex-wrap gap-4">
          <div>
            <div className="text-sm text-coral font-semibold mb-2">
              Nos chats disponibles
            </div>
            <h2 className="text-h2 leading-[1.05] tracking-tight font-semibold m-0 max-w-[520px] text-ink">
              Trouvez votre nouveau compagnon pour la vie.
            </h2>
          </div>
          <Link
            href="/adopt-pet"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-border-strong bg-surface text-sm font-semibold text-ink no-underline"
          >
            Voir les {total} chats <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {announcements.map((cat) => (
            <CatCard key={cat.documentId} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}
