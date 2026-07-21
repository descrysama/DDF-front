import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { Partner } from "@/lib/strapi"

const PARTNER_TINT_CLASSES = ['bg-peach', 'bg-lilac', 'bg-mint', 'bg-pink']

const FUNDING = [
  { label: 'Dons particuliers', pct: '62%', width: 62 },
  { label: 'Subventions',       pct: '24%', width: 24 },
  { label: 'Évènements',        pct: '9%',  width: 9  },
  { label: 'Adoptions',         pct: '5%',  width: 5  },
]

export function PartnersSection({ partners }: { partners: Partner[] }) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-14">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5">

        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="text-sm text-coral font-semibold mb-2">
            Nos partenaires
          </div>
          <h3 className="text-xl font-semibold tracking-[-0.015em] m-0 mb-[18px] text-ink">
            Ils nous soutiennent au quotidien.
          </h3>
          <div className="grid grid-cols-4 gap-2.5">
            {partners.map(({ id, name, logoUrl }, i) =>
              logoUrl ? (
                <div key={id} className="relative rounded-lg overflow-hidden bg-white aspect-[2/1]">
                  <Image src={logoUrl} alt={name} fill sizes="150px" className="object-contain p-2" />
                </div>
              ) : (
                <div
                  key={id}
                  className={`${PARTNER_TINT_CLASSES[i % 4]} rounded-lg py-3.5 px-3 text-xs font-semibold text-ink text-center leading-[1.3]`}
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-coral to-magenta text-white rounded-xl p-6 relative overflow-hidden">
          <div className="text-sm text-pink font-semibold mb-2">
            Transparence
          </div>
          <h3 className="text-xl font-semibold tracking-[-0.015em] m-0 mb-4">
            D&apos;où vient l&apos;argent&nbsp;?
          </h3>
          <div className="grid gap-2.5">
            {FUNDING.map(({ label, pct, width }) => (
              <div key={label}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm">{label}</span>
                  <span className="text-sm font-semibold">{pct}</span>
                </div>
                <div className="h-1 bg-white/20 rounded-sm overflow-hidden">
                  <div className="h-full bg-white" style={{ width: `${width}%` }} />
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/about-us#rapport"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-white no-underline px-3 py-2 rounded-md border border-white/30 bg-white/15"
          >
            Rapport financier 2025 <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </section>
  )
}
