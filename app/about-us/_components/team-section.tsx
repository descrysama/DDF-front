import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { TeamMember } from "@/lib/strapi"

const FALLBACK_TONES = [
  ['#E0AC9C', '#A87968'],
  ['#C6C8CB', '#7E8189'],
  ['#E8C9B3', '#C99879'],
  ['#D9B898', '#A47A55'],
  ['#D9D3C5', '#9D9485'],
  ['#F1D7C4', '#D3A88C'],
]

export function TeamSection({ team }: { team: TeamMember[] }) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-14">
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <div className="text-sm text-coral font-semibold mb-2">
            L&apos;équipe
          </div>
          <h2 className="text-h2 leading-[1.05] tracking-tight font-semibold m-0 text-ink">
            18 bénévoles, un seul cap.
          </h2>
        </div>
        <Link
          href="/about-us#benevoles"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-border-strong bg-surface text-sm font-semibold text-ink no-underline"
        >
          Devenir bénévole <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {team.map(({ id, name, role, photoUrl }, i) => {
          const tone = FALLBACK_TONES[i % FALLBACK_TONES.length]
          return (
            <div key={id}>
              <div className="relative aspect-square rounded-[10px] overflow-hidden mb-2">
                {photoUrl ? (
                  <Image src={photoUrl} alt="" fill sizes="150px" className="object-cover" />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${tone[0]} 0%, ${tone[1]} 100%)` }}
                  />
                )}
              </div>
              <div className="text-sm font-semibold tracking-[-0.01em] text-ink">{name}</div>
              <div className="text-2xs text-ink-muted mt-0.5">{role}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
