import Link from "next/link"
import { T } from "@/lib/design-tokens"
import { CAT_TINT, PlaceholderCat } from "@/lib/placeholder-cats"

interface CatCardProps {
  cat: PlaceholderCat
}

export function CatCard({ cat }: CatCardProps) {
  const tint = CAT_TINT[cat.tag]
  const tagBg = cat.tagStyle === 'coral' ? T.coral : T.ink

  return (
    <Link
      href={`/adopt-pet/${cat.id}`}
      style={{
        background: tint,
        borderRadius: 12,
        padding: 10,
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform .15s',
      }}
    >
      {/* Placeholder photo */}
      <div style={{
        position: 'relative',
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
        aspectRatio: '1 / 1',
        background: `linear-gradient(135deg, ${cat.tones[0]} 0%, ${cat.tones[1]} 100%)`,
      }}>
        {/* Stripe texture overlay */}
        <svg
          width="100%" height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.15, mixBlendMode: 'overlay' }}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id={`stripe-${cat.id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="14" stroke="#ffffff" strokeWidth="6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#stripe-${cat.id})`} />
        </svg>

        {/* Photo label */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-end',
          padding: 12, color: 'rgba(255,255,255,0.9)',
        }}>
          <span style={{ fontSize: 11, fontWeight: 500 }}>Photo · {cat.name}</span>
        </div>

        {/* Tag badge */}
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          background: tagBg, color: '#fff',
          padding: '4px 10px', borderRadius: 4,
          fontSize: 11, fontWeight: 600,
        }}>
          {cat.tag}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '0 4px 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: T.ink }}>
            {cat.name}
          </span>
          <span style={{ fontSize: 11, color: T.inkMuted }}>{cat.age}</span>
        </div>
        <p style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.4, margin: 0 }}>
          {cat.blurb}
        </p>
      </div>
    </Link>
  )
}