import Link from "next/link"
import { ArrowRight } from "lucide-react"

const stats = [
  { value: '11',   label: 'ans d\'activité'   },
  { value: '350+', label: 'chats adoptés'      },
  { value: '100%', label: 'bénévole'            },
  { value: '52',   label: 'distributions / an' },
]

export function StatsStrip() {
  return (
    <section className="bg-coral text-white relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 py-[22px] flex flex-wrap justify-between items-center gap-5">
        <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-0">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex items-baseline gap-2.5 py-1 ${i > 0 ? 'pl-5 border-l border-white/25' : ''}`}
            >
              <span className="text-[28px] font-semibold tracking-tight">{value}</span>
              <span className="text-xs opacity-[0.85]">{label}</span>
            </div>
          ))}
        </div>
        <Link
          href="/about-us"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white text-coral text-xs font-semibold no-underline shrink-0"
        >
          Notre rapport 2025 <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  )
}
