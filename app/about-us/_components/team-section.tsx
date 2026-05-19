import Link from "next/link"
import { ArrowRight } from "lucide-react"

const TEAM = [
  { name: 'Clara',   role: 'Présidente, fondatrice', tone: ['#E0AC9C', '#A87968'] },
  { name: 'Léo',     role: 'Trésorier',              tone: ['#C6C8CB', '#7E8189'] },
  { name: 'Margaux', role: 'Coordination FA',         tone: ['#E8C9B3', '#C99879'] },
  { name: 'Yannis',  role: 'Distributions',           tone: ['#D9B898', '#A47A55'] },
  { name: 'Aïda',    role: 'Réseaux sociaux',         tone: ['#D9D3C5', '#9D9485'] },
  { name: 'Hugo',    role: 'Vétérinaire bénévole',    tone: ['#F1D7C4', '#D3A88C'] },
]

export function TeamSection() {
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
        {TEAM.map(({ name, role, tone }) => (
          <div key={name}>
            <div
              className="aspect-square rounded-[10px] overflow-hidden mb-2"
              style={{ background: `linear-gradient(135deg, ${tone[0]} 0%, ${tone[1]} 100%)` }}
            />
            <div className="text-sm font-semibold tracking-[-0.01em] text-ink">{name}</div>
            <div className="text-2xs text-ink-muted mt-0.5">{role}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
