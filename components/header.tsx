"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, User, Heart, LogOut, Shield, Cat } from "lucide-react"
import { useUserStore, useIsStaff } from "@/lib/stores/user-store"
import { Button } from "@/components/ui/button"

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
  const isStaff = useIsStaff()
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
                <Button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full border-0 bg-coral-soft text-coral transition-colors hover:bg-coral hover:text-white"
                  aria-label="Menu utilisateur"
                >
                  <User className="size-[18px]" />
                </Button>
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
                      <Link
                        href="/matches"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink no-underline hover:bg-surface-alt"
                      >
                        <Cat size={14} />
                        Trouver mon match
                      </Link>
                      {isStaff && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ink no-underline hover:bg-surface-alt"
                        >
                          <Shield size={14} />
                          Administration
                        </Link>
                      )}
                      <Button
                        onClick={() => {
                          setDropdownOpen(false)
                          handleLogout()
                        }}
                        variant="ghost"
                        className="h-auto w-full justify-start gap-2 rounded-none border-0 bg-transparent px-4 py-2 text-sm font-normal text-ink hover:bg-surface-alt hover:text-ink"
                      >
                        <LogOut className="size-3.5" />
                        Déconnexion
                      </Button>
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
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto h-auto w-auto rounded-md border-0 bg-transparent p-1 text-ink hover:bg-transparent hover:text-ink"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X className="size-[22px]" /> : <Menu className="size-[22px]" />}
          </Button>
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
                  <Link
                    href="/matches"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 rounded-md bg-surface-alt text-ink font-semibold text-sm no-underline text-center"
                  >
                    Trouver mon match
                  </Link>
                  {isStaff && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2.5 rounded-md bg-ink text-white font-semibold text-sm no-underline text-center"
                    >
                      Admin
                    </Link>
                  )}
                  <Button
                    onClick={() => {
                      setMenuOpen(false)
                      handleLogout()
                    }}
                    variant="ghost"
                    className="h-auto rounded-md border-0 bg-surface-alt px-4 py-2.5 text-center text-sm font-semibold text-ink hover:bg-surface-alt hover:text-ink"
                  >
                    Déconnexion ({user.username})
                  </Button>
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
