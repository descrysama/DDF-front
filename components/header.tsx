"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, User, Heart } from "lucide-react"

const NAV_LINKS = [
  { label: "Accueil",       href: "/",                            key: "home"    },
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
    <header
      className="sticky top-0 z-50 border-b border-border"
      style={{
        background: 'rgba(251,250,247,0.90)',
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-7 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Sans Croquettes Fixes" fill className="object-contain" priority />
            </div>
            <span className="text-sm font-semibold tracking-[-0.015em] text-ink">
              Sans Croquettes Fixes
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex ml-auto gap-5.5">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-1 no-underline text-sm tracking-[-0.005em] ${active ? 'text-ink font-semibold' : 'text-ink-muted font-medium'}`}
                >
                  {label}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-coral rounded-sm" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border-strong text-sm font-semibold text-ink no-underline"
            >
              <User size={13} />
              Se connecter
            </Link>
            <Link
              href="/donate"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-coral text-white text-sm font-semibold no-underline"
            >
              <Heart size={12} />
              Faire un don
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden ml-auto bg-transparent border-0 cursor-pointer p-1 text-ink"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-5 border-t border-border">
            <nav className="pt-3 flex flex-col gap-0.5">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-2 py-2.5 rounded-md text-sm no-underline ${isActive(href) ? 'text-coral font-semibold' : 'text-ink font-medium'}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-3.5">
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-md bg-surface-alt text-ink font-semibold text-sm no-underline text-center"
              >
                Se connecter
              </Link>
              <Link
                href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-md bg-coral text-white font-semibold text-sm no-underline text-center"
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
