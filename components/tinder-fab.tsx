"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cat } from "lucide-react"

const HIDDEN_PREFIXES = ["/admin", "/matches"]

export default function TinderFab() {
  const pathname = usePathname()
  const hidden = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  if (hidden) return null

  return (
    <Link
      href="/matches"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full text-white text-sm font-semibold no-underline shadow-[0_10px_30px_rgba(232,74,119,0.35)] transition-transform hover:scale-105"
      style={{ background: "linear-gradient(135deg, #F76C70 0%, #E84A77 100%)" }}
    >
      <Cat size={16} />
      Trouver mon match
    </Link>
  )
}
