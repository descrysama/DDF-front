"use client"

import { useEffect, useState } from "react"
import { PartyPopper, Info } from "lucide-react"
import type { MyAdoptionRequest } from "@/lib/strapi"

const NOTIFIED_STATUSES = new Set(["approved", "rejected"])

export function AdoptionRequestsNotice() {
  const [requests, setRequests] = useState<MyAdoptionRequest[]>([])

  useEffect(() => {
    fetch("/api/adoption-requests/mine")
      .then((res) => res.json())
      .then((data: { requests: MyAdoptionRequest[] }) => setRequests(data.requests ?? []))
      .catch(() => {})
  }, [])

  const notable = requests.filter((r) => NOTIFIED_STATUSES.has(r.status))
  if (notable.length === 0) return null

  return (
    <div className="mb-4 flex flex-col gap-2">
      {notable.map((request) => {
        const approved = request.status === "approved"
        const name = request.animal?.name ?? "un chat"
        return (
          <a
            key={request.documentId}
            href="/my-adoption-requests"
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm no-underline ${
              approved
                ? "bg-mint border-transparent text-ink"
                : "bg-surface-alt border-border text-ink"
            }`}
          >
            {approved ? <PartyPopper size={18} className="shrink-0 mt-0.5" /> : <Info size={18} className="shrink-0 mt-0.5 text-ink-muted" />}
            <span>
              {approved
                ? <>Bonne nouvelle ! Votre demande d&apos;adoption pour <strong>{name}</strong> a été approuvée.</>
                : <>Votre demande d&apos;adoption pour <strong>{name}</strong> n&apos;a pas été retenue.</>}
              {" "}
              <span className="underline">Voir mes demandes</span>
            </span>
          </a>
        )
      })}
    </div>
  )
}
