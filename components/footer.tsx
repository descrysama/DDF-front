import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const COLUMNS = [
  {
    title: 'Association',
    items: [
      { label: 'À propos',        href: '/about-us'              },
      { label: 'Notre histoire',  href: '/about-us#histoire'     },
      { label: 'Bénévoles',       href: '/about-us#benevoles'    },
      { label: 'Partenaires',     href: '/about-us#partenaires'  },
    ],
  },
  {
    title: 'Adopter',
    items: [
      { label: 'Chats à l\'adoption', href: '/adopt-pet'               },
      { label: 'Procédure',           href: '/adopt-pet#procedure'      },
      { label: 'Famille d\'accueil',  href: '/adopt-pet#famille'        },
      { label: 'Frais d\'adoption',   href: '/adopt-pet#frais'          },
    ],
  },
  {
    title: 'Soutenir',
    items: [
      { label: 'Faire un don',     href: '/donate'               },
      { label: 'Don matériel',     href: '/donate#materiel'      },
      { label: 'Devenir bénévole', href: '/about-us#benevoles'   },
      { label: 'Mécénat',          href: '/donate#mecenat'       },
    ],
  },
  {
    title: 'Ressources',
    items: [
      { label: 'Distributions', href: '/distribution-de-croquettes' },
      { label: 'Blog',          href: '/news'                       },
      { label: 'FAQ',           href: '/faq'                        },
      { label: 'Presse',        href: '/presse'                     },
    ],
  },
]

const SOCIAL = [
  { label: 'ig', bgClass: 'bg-rose',  href: 'https://www.instagram.com/sanscroquettesfixes/' },
  { label: 'fb', bgClass: 'bg-lilac', href: 'https://www.facebook.com/sanscroquettesfixes'   },
  { label: 'yt', bgClass: 'bg-mint',  href: 'https://www.youtube.com/@SansCroquettesFixes'   },
]

export default function Footer() {
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

        {/* Newsletter strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-9 pb-7 border-b border-border-strong">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="relative w-7 h-7 shrink-0">
                <Image src="/logo.png" alt="" fill className="object-contain" />
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.015em]">
                Sans Croquettes Fixes
              </span>
            </div>
            <p className="text-sm leading-[1.55] text-ink-muted m-0 max-w-[360px]">
              Association loi 1901 — Protection animale dans la région lyonnaise depuis 2015.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold m-0 mb-2">
              Recevez les nouvelles de l&apos;asso
            </p>
            <div className="flex bg-white rounded-lg p-1 border border-border-strong">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 border-none outline-none bg-transparent text-sm text-ink px-3 py-2 font-[inherit]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-coral text-white border-none cursor-pointer text-sm font-semibold font-[inherit] inline-flex items-center gap-1.5"
              >
                S&apos;abonner <ArrowRight size={12} />
              </button>
            </div>
            <p className="text-2xs text-ink-muted mt-1.5 mb-0">
              Une newsletter par mois, pas plus — promis.
            </p>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-7 py-7 pb-6">
          {COLUMNS.map(({ title, items }) => (
            <div key={title}>
              <div className="text-xs font-semibold text-ink mb-2.5">{title}</div>
              <ul className="list-none p-0 m-0 grid gap-2">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-ink-muted no-underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact + social */}
          <div>
            <div className="text-xs font-semibold text-ink mb-2.5">Contact</div>
            <div className="grid gap-1.5 text-sm text-ink-muted mb-3.5">
              <div>contact@sanscroquettesfixes.fr</div>
              <div>Lyon (69) &amp; alentours</div>
            </div>
            <div className="flex gap-1.5">
              {SOCIAL.map(({ label, bgClass, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-lg ${bgClass} text-ink flex items-center justify-center text-2xs font-semibold no-underline shrink-0 font-[var(--font-geist-mono)]`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex justify-between items-center py-4 pb-6 text-2xs text-ink-muted border-t border-border flex-wrap gap-3">
          <span>© 2026 Sans Croquettes Fixes · SIRET 81819530700017</span>
          <div className="flex gap-[18px]">
            <Link href="/mentions-legales" className="text-ink-muted no-underline">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-ink-muted no-underline">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}