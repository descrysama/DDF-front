import Link from "next/link"
import { CAT_TINT } from "@/lib/placeholder-cats"
import type { CardAnimal } from "@/lib/strapi"

interface CatCardProps {
  cat: CardAnimal
}

export function CatCard({ cat }: CatCardProps) {
  const tintClass = CAT_TINT[cat.tag]
  const tagClass = cat.tagStyle === 'coral' ? 'bg-coral' : 'bg-ink'

  return (
    <Link
      href={`/adopt-pet/${cat.documentId}`}
      className={`${tintClass} rounded-xl p-2.5 block no-underline text-ink transition-transform duration-150`}
    >
      {/* Gradient placeholder — replaced by next/image once Strapi media is wired */}
      <div
        className="relative mb-2.5 rounded-lg overflow-hidden aspect-square"
        style={{
          background: `linear-gradient(135deg, ${cat.tones[0]} 0%, ${cat.tones[1]} 100%)`,
        }}
      >
        <svg
          width="100%" height="100%"
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id={`stripe-${cat.id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="14" stroke="#ffffff" strokeWidth="6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#stripe-${cat.id})`} />
        </svg>

        <div className="absolute inset-0 flex items-end p-3 text-white/90">
          <span className="text-2xs font-medium">Photo · {cat.name}</span>
        </div>

        <div className={`absolute bottom-2 right-2 ${tagClass} text-white px-2.5 py-1 rounded text-2xs font-semibold`}>
          {cat.tag}
        </div>
      </div>

      <div className="px-1 pb-1">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
            {cat.name}
          </span>
          <span className="text-2xs text-ink-muted">{cat.age}</span>
        </div>
        <p className="text-xs text-ink-muted leading-[1.4] m-0">
          {cat.blurb}
        </p>
      </div>
    </Link>
  )
}
