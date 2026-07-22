import Link from "next/link"
import Image from "next/image"
import { fetchSocialLinks } from "@/lib/strapi"

const LINKS = [
  { label: 'À propos',              href: '/about-us'                    },
  { label: 'Chats à l\'adoption',   href: '/adopt-pet'                   },
  { label: 'Faire un don',          href: '/donate'                      },
  { label: 'Distributions',         href: '/distribution-de-croquettes'  },
  { label: 'Blog',                  href: '/news'                        },
]

export default async function Footer() {
  const socialLinks = await fetchSocialLinks()

  return (
    <footer
      className="text-ink relative overflow-hidden border-t-[3px] border-t-coral"
      style={{
        background: 'linear-gradient(180deg, var(--scf-surface-alt) 0%, var(--scf-peach) 100%)',
      }}
    >
      {/* Decorative radial wash */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[360px] h-[200px] opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, var(--scf-rose) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative">

        {/* Brand + links + contact */}
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5">
          <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
            <div className="relative w-6 h-6 shrink-0">
              <Image src="/logo.png" alt="" fill className="object-contain" />
            </div>
            <span className="text-sm font-semibold tracking-[-0.015em] text-ink">
              Sans Croquettes Fixes
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="text-sm text-ink-muted no-underline">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a href="mailto:contact@sanscroquettesfixes.fr" className="text-sm text-ink-muted no-underline">
              contact@sanscroquettesfixes.fr
            </a>
            <div className="flex gap-1.5">
              {socialLinks.map(({ id, label, url, iconUrl }) => (
                <Link
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-7 h-7 rounded-lg bg-white border border-border-strong flex items-center justify-center shrink-0"
                >
                  {iconUrl && (
                    <div className="relative w-3.5 h-3.5">
                      <Image src={iconUrl} alt="" fill unoptimized className="object-contain" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex justify-between items-center py-3 text-2xs text-ink-muted border-t border-border flex-wrap gap-3">
          <span>© 2026 Sans Croquettes Fixes · SIRET 81819530700017</span>
          <Link href="/mentions-legales" className="text-ink-muted no-underline">
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  )
}