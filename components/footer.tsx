import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#272633] text-white">
      <div className="bg-[#2e2c38] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="w-[120px] h-[50px] relative">
              <Image
                src="/logo.png"
                alt="Sans Croquettes Fixes"
                fill
                className="object-contain"
              />
            </div>

            {/* Description */}
            <div className="max-w-2xl text-center md:text-left">
              <p className="text-sm text-gray-300">
                Sans Croquettes Fixes est une association à but non lucratif loi 1901. Son cœur d'action est la protection animale. Nous agissons sur la ville de Lyon (69) et ses alentours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Menu */}
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/adopt-pet" className="text-sm hover:text-primary transition-colors">
                À l'adoption
              </Link>
              <Link href="/about-us" className="text-sm hover:text-primary transition-colors">
                À propos de nous
              </Link>
              <Link href="/news" className="text-sm hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/mentions-legales" className="text-sm hover:text-primary transition-colors">
                Mentions légales
              </Link>
            </nav>

            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <Link href="https://www.facebook.com/sanscroquettesfixes" target="_blank" className="hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="https://x.com/CroquettesFixes" target="_blank" className="hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="https://www.instagram.com/sanscroquettesfixes/" target="_blank" className="hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-400">
            <p>© 2026 Sans Croquettes Fixes • Copyright © 2022 - Litl'Pal Theme</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
