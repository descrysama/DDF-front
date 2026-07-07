"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, User, Heart, LogOut, Shield } from "lucide-react"
import { useUserStore, useIsAdmin } from "@/lib/stores/user-store"

const NAV_LINKS = [
  { label: "Accueil",       href: "/",                            key: "home"    },
  { label: "À l'adoption",  href: "/adopt-pet",                   key: "adopt"   },
  { label: "Distributions", href: "/distribution-de-croquettes",  key: "distrib" },
  { label: "À propos",      href: "/about-us",                    key: "about"   },
  { label: "Blog",          href: "/news",                        key: "blog"    },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const user = useUserStore((s) => s.user)
  const clear = useUserStore((s) => s.clear)
  const isAdmin = useIsAdmin()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    clear()
    router.push('/')
    router.refresh()
  }

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
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-coral-soft text-coral border-0 cursor-pointer transition-colors hover:bg-coral hover:text-white"
                  aria-label="Menu utilisateur"
                >
                  <User size={18} />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-white shadow-lg"
                    style={{ zIndex: 60 }}
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-ink m-0">{user.username}</p>
                      <p className="text-xs text-ink-muted m-0 mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink no-underline hover:bg-surface-alt"
                      >
                        <User size={14} />
                        Mon profil
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/animals"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ink no-underline hover:bg-surface-alt"
                        >
                          <Shield size={14} />
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setDropdownOpen(false)
                          handleLogout()
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-ink bg-transparent border-0 cursor-pointer hover:bg-surface-alt"
                      >
                        <LogOut size={14} />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border-strong text-sm font-semibold text-ink no-underline"
              >
                <User size={13} />
                Se connecter
              </Link>
            )}
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
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 rounded-md bg-surface-alt text-ink font-semibold text-sm no-underline text-center"
                  >
                    Mon profil
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/animals"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2.5 rounded-md bg-ink text-white font-semibold text-sm no-underline text-center"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      handleLogout()
                    }}
                    className="px-4 py-2.5 rounded-md bg-surface-alt text-ink font-semibold text-sm text-center border-0 cursor-pointer"
                  >
                    Déconnexion ({user.username})
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 rounded-md bg-surface-alt text-ink font-semibold text-sm no-underline text-center"
                >
                  Se connecter
                </Link>
              )}
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
