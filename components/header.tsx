"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, User, Heart } from "lucide-react"
import { T } from "@/lib/design-tokens"

const NAV_LINKS = [
  { label: "Accueil",       href: "/",                             key: "home"    },
  { label: "À l'adoption",  href: "/adopt-pet",                   key: "adopt"   },
  { label: "Distributions", href: "/distribution-de-croquettes",  key: "distrib" },
  { label: "À propos",      href: "/about-us",                    key: "about"   },
  { label: "Blog",          href: "/news",                        key: "blog"    },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href)
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(251,250,247,0.90)',
      backdropFilter: 'saturate(180%) blur(12px)',
      WebkitBackdropFilter: 'saturate(180%) blur(12px)',
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '12px 0' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, position: 'relative' }}>
              <Image src="/logo.png" alt="Sans Croquettes Fixes" fill className="object-contain" priority />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.015em', color: T.ink }}>
              Sans Croquettes Fixes
            </span>
          </Link>

          {/* Desktop nav — hidden on mobile via Tailwind, no inline display override */}
          <nav
            className="hidden md:flex"
            style={{ gap: 22, marginLeft: 'auto' }}
          >
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    color: active ? T.ink : T.inkMuted,
                    fontWeight: active ? 600 : 500,
                    fontSize: 13,
                    textDecoration: 'none',
                    letterSpacing: '-0.005em',
                    position: 'relative',
                    padding: '4px 0',
                  }}
                >
                  {label}
                  {active && (
                    <span style={{
                      position: 'absolute', left: 0, right: 0, bottom: -2, height: 2,
                      background: T.coral, borderRadius: 2,
                    }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop actions */}
          <div
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: 8 }}
          >
            <Link
              href="/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 12px', borderRadius: 6,
                background: 'transparent', color: T.ink,
                border: `1px solid ${T.borderStrong}`,
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <User size={13} />
              Se connecter
            </Link>
            <Link
              href="/donate"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 6,
                background: T.coral, color: '#fff',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <Heart size={12} />
              Faire un don
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', padding: 4, color: T.ink,
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden"
            style={{ paddingBottom: 20, borderTop: `1px solid ${T.border}` }}
          >
            <nav style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block', padding: '10px 8px',
                    color: isActive(href) ? T.coral : T.ink,
                    fontWeight: isActive(href) ? 600 : 500,
                    fontSize: 14, textDecoration: 'none', borderRadius: 6,
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              <Link
                href="/login"
                style={{
                  padding: '10px 16px', borderRadius: 6,
                  background: T.surfaceAlt, color: T.ink,
                  fontWeight: 600, fontSize: 14,
                  textDecoration: 'none', textAlign: 'center',
                }}
              >
                Se connecter
              </Link>
              <Link
                href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 16px', borderRadius: 6,
                  background: T.coral, color: '#fff',
                  fontWeight: 600, fontSize: 14,
                  textDecoration: 'none', textAlign: 'center',
                }}
              >
                Faire un don
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}