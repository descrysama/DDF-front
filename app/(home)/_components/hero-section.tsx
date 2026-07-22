import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { fetchAnnouncements } from "@/lib/strapi"

export async function HeroSection() {
  const { announcements, total } = await fetchAnnouncements({ limit: 1 })
  const featured = announcements[0]

  return (
    <section className="relative overflow-hidden bg-bg">
      {/* Right-side coral wash panel */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 right-0 w-[42%] bg-gradient-to-br from-pink to-rose"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-[1200px] mx-auto px-6 pt-[52px] pb-16 relative gap-12 items-center">
        {/* Left — copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-[5px] rounded-full bg-surface border border-coral/25 text-xs font-medium text-coral-ink mb-[22px]">
            <span className="animate-scf-pulse w-1.5 h-1.5 rounded-full bg-coral inline-block" />
            {`${total} chats actuellement à l'adoption`}
          </div>

          <h1 className="text-h1 leading-[0.96] tracking-[-0.035em] font-semibold m-0 mb-[18px] text-ink">
            Un toit, des câlins,{' '}<br />
            <span className="bg-gradient-to-r from-coral to-magenta bg-clip-text text-transparent">
              une seconde chance.
            </span>
          </h1>

          <p className="text-lg leading-[1.55] text-ink-muted m-0 mb-[26px] max-w-[480px]">
            Sans Croquettes Fixes accompagne les chats les plus fragiles de la région lyonnaise
            vers une famille pour la vie.
          </p>

          <div className="flex gap-2 flex-wrap">
            <Link
              href="/adopt-pet"
              className="inline-flex items-center gap-2 px-[18px] py-3 rounded-md bg-coral text-white text-sm font-semibold no-underline"
            >
              Adopter un chat
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 px-[18px] py-3 rounded-md bg-ink text-white text-sm font-semibold no-underline"
            >
              Découvrir l&apos;asso
            </Link>
          </div>
        </div>

        {/* Right — featured cat */}
        {featured && (
          <div className="relative aspect-[5/4] rounded-[10px] overflow-hidden shadow-card">
            {featured.photoUrl ? (
              <Image
                src={featured.photoUrl}
                alt={featured.name}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${featured.tones[0]} 0%, ${featured.tones[1]} 100%)`,
                  }}
                />
                <svg
                  width="100%" height="100%"
                  className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern id="hero-stripe" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                      <line x1="0" y1="0" x2="0" y2="14" stroke="#ffffff" strokeWidth="6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hero-stripe)" />
                </svg>
              </>
            )}

            <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded bg-coral text-white text-[11px] font-semibold">
              Nouvelle arrivée
            </div>

            <div className="absolute left-3.5 bottom-3.5 right-3.5 flex justify-between items-end text-white">
              <div>
                <div className="text-[22px] font-semibold leading-none">{featured.name}</div>
                <div className="text-xs opacity-[0.85] mt-1">
                  {featured.age} · {featured.sex}
                </div>
              </div>
              <Link
                href={`/adopt-pet/${featured.documentId}`}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white no-underline border border-white/30"
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
              >
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
