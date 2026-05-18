import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { T } from "@/lib/design-tokens"

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
      { label: 'Faire un don',    href: '/donate'                },
      { label: 'Don matériel',    href: '/donate#materiel'       },
      { label: 'Devenir bénévole', href: '/about-us#benevoles'  },
      { label: 'Mécénat',         href: '/donate#mecenat'       },
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
  { label: 'ig', bg: T.rose,  href: 'https://www.instagram.com/sanscroquettesfixes/' },
  { label: 'fb', bg: T.lilac, href: 'https://www.facebook.com/sanscroquettesfixes'   },
  { label: 'yt', bg: T.mint,  href: 'https://www.youtube.com/@SansCroquettesFixes'   },
]

export default function Footer() {
  return (
    <footer style={{
      background: `linear-gradient(180deg, ${T.surfaceAlt} 0%, ${T.peach} 100%)`,
      color: T.ink,
      position: 'relative',
      overflow: 'hidden',
      borderTop: `3px solid ${T.coral}`,
    }}>
      {/* Decorative radial wash */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, right: 0,
          width: 360, height: 200,
          background: `radial-gradient(ellipse at top right, ${T.rose} 0%, transparent 70%)`,
          opacity: 0.6, pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* Newsletter strip */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: 40, alignItems: 'center',
            padding: '36px 0 28px',
            borderBottom: `1px solid ${T.borderStrong}`,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, position: 'relative', flexShrink: 0 }}>
                <Image src="/logo.png" alt="" fill className="object-contain" />
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.015em' }}>
                Sans Croquettes Fixes
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: T.inkMuted, margin: 0, maxWidth: 360 }}>
              Association loi 1901 — Protection animale dans la région lyonnaise depuis 2015.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px' }}>
              Recevez les nouvelles de l&apos;asso
            </p>
            <div style={{
              display: 'flex', background: '#fff',
              borderRadius: 8, padding: 4,
              border: `1px solid ${T.borderStrong}`,
            }}>
              <input
                type="email"
                placeholder="Votre email"
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 13, fontFamily: 'inherit', color: T.ink, padding: '8px 12px',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 16px', borderRadius: 6,
                  background: T.coral, color: '#fff',
                  border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                S&apos;abonner <ArrowRight size={12} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: T.inkMuted, margin: '6px 0 0' }}>
              Une newsletter par mois, pas plus — promis.
            </p>
          </div>
        </div>

        {/* Link columns */}
        <div
          className="grid grid-cols-2 md:grid-cols-5"
          style={{ gap: 28, padding: '28px 0 24px' }}
        >
          {COLUMNS.map(({ title, items }) => (
            <div key={title}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 10 }}>{title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      style={{ fontSize: 13, color: T.inkMuted, textDecoration: 'none' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact + social */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 10 }}>Contact</div>
            <div style={{ display: 'grid', gap: 6, fontSize: 13, color: T.inkMuted, marginBottom: 14 }}>
              <div>contact@sanscroquettesfixes.fr</div>
              <div>Lyon (69) &amp; alentours</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {SOCIAL.map(({ label, bg, href }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: bg, color: T.ink,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600, textDecoration: 'none',
                    fontFamily: 'var(--font-geist-mono)', flexShrink: 0,
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 0 24px',
          fontSize: 11, color: T.inkMuted,
          borderTop: `1px solid ${T.border}`,
          flexWrap: 'wrap', gap: 12,
        }}>
          <span>© 2026 Sans Croquettes Fixes · SIRET 81819530700017</span>
          <div style={{ display: 'flex', gap: 18 }}>
            <Link href="/mentions-legales" style={{ color: 'inherit', textDecoration: 'none' }}>
              Mentions légales
            </Link>
            <Link href="/confidentialite" style={{ color: 'inherit', textDecoration: 'none' }}>
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}