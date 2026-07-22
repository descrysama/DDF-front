import Link from "next/link"
import Image from "next/image"
import type { MyAdoptionRequest } from "@/lib/strapi"
import { RequestStatusBadge } from "./request-status-badge"

export function RequestCard({ request }: { request: MyAdoptionRequest }) {
  const { animal } = request
  const dateStr = request.requestDate
    ? new Date(request.requestDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    : null

  return (
    <div className="rounded-xl border border-border bg-surface p-3 flex gap-3">
      <div
        className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0"
        style={!animal?.photoUrl ? { background: `linear-gradient(135deg, ${animal?.tones[0] ?? "#E8C9B3"} 0%, ${animal?.tones[1] ?? "#C99879"} 100%)` } : undefined}
      >
        {animal?.photoUrl && (
          <Image src={animal.photoUrl} alt={animal.name} fill unoptimized sizes="80px" style={{ objectFit: "cover" }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          {animal ? (
            <Link href={`/adopt-pet/${animal.documentId}`} className="text-[15px] font-semibold text-ink hover:text-coral transition-colors">
              {animal.name}
            </Link>
          ) : (
            <span className="text-[15px] font-semibold text-ink-muted">Chat indisponible</span>
          )}
          <RequestStatusBadge status={request.status} />
        </div>
        {dateStr && <p className="text-xs text-ink-muted">Demande envoyée le {dateStr}</p>}
      </div>
    </div>
  )
}
