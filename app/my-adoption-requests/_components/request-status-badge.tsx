import type { AdoptionRequestStatus } from "@/lib/strapi"

const STATUS_STYLE: Record<AdoptionRequestStatus, { label: string; className: string }> = {
  pending:     { label: "En attente",         className: "bg-peach" },
  in_progress: { label: "En cours d'examen",  className: "bg-lilac" },
  approved:    { label: "Approuvée 🎉",        className: "bg-mint" },
  rejected:    { label: "Non retenue",        className: "bg-rose" },
}

export function RequestStatusBadge({ status }: { status: AdoptionRequestStatus }) {
  const { label, className } = STATUS_STYLE[status]
  return (
    <span className={`${className} text-ink text-xs font-semibold px-2.5 py-1 rounded-full inline-block`}>
      {label}
    </span>
  )
}
