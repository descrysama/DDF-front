import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#272633] text-white border-t border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">

          {/* Logo + description */}
          <div className="flex flex-row items-center gap-3 shrink-0 max-w-[280px]">
            <div className="w-[50px] h-[50px] relative shrink-0">
              <Image
                src="/logo.png"
                alt="Sans Croquettes Fixes"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              Association à but non lucratif loi 1901. Protection animale sur Lyon (69) et ses alentours.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <Link href="/about-us" className="text-xs text-gray-300 hover:text-[hsl(var(--primary))] transition-colors">À propos de nous</Link>
            <Link href="/news" className="text-xs text-gray-300 hover:text-[hsl(var(--primary))] transition-colors">Blog</Link>
            <Link href="/mentions-legales" className="text-xs text-gray-300 hover:text-[hsl(var(--primary))] transition-colors">Mentions légales</Link>
          </nav>

          {/* Right: social + copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-3">
              <Link href="https://www.facebook.com/sanscroquettesfixes" target="_blank" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                <Facebook size={16} />
              </Link>
              <Link href="https://x.com/CroquettesFixes" target="_blank" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                <Twitter size={16} />
              </Link>
              <Link href="https://www.instagram.com/sanscroquettesfixes/" target="_blank" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                <Instagram size={16} />
              </Link>
            </div>
            <p className="text-[11px] text-gray-500">© 2026 Sans Croquettes Fixes</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
