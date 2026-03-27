"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-[#393b4f] to-[#292930] border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-[120px] h-[50px] relative">
              <Image
                src="/logo.png"
                alt="Sans Croquettes Fixes"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/adopt-pet" className="text-sm font-bold text-white hover:text-primary transition-colors">
              À l'adoption
            </Link>
            <Link href="/distribution-de-croquettes" className="text-sm font-bold text-white hover:text-primary transition-colors">
              Distribution de croquettes
            </Link>
            <Link href="/about-us" className="text-sm font-bold text-white hover:text-[hsl(var(--primary))] transition-colors">
              À propos de nous
            </Link>
            <Link href="/news" className="text-sm font-bold text-white hover:text-[hsl(var(--primary))] transition-colors">
              Blog
            </Link>
            <Button asChild>
              <Link href="/donate">Faire un don</Link>
            </Button>
          </nav>

          {/* Social Media */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="https://www.facebook.com/sanscroquettesfixes" target="_blank" className="text-white hover:text-primary transition-colors">
              <Facebook size={20} />
            </Link>
            <Link href="https://x.com/CroquettesFixes" target="_blank" className="text-white hover:text-primary transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="https://www.instagram.com/sanscroquettesfixes/" target="_blank" className="text-white hover:text-primary transition-colors">
              <Instagram size={20} />
            </Link>
          </div>

          {/* Menu Mobile */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/adopt-pet" className="block py-2 text-white hover:text-primary">
              À l'adoption
            </Link>
            <Link href="/distribution-de-croquettes" className="block py-2 text-white hover:text-primary">
              Distribution de croquettes
            </Link>
            <Link href="/about-us" className="block py-2 text-white hover:text-[hsl(var(--primary))]">
              À propos de nous
            </Link>
            <Link href="/donate" className="block py-2 text-white hover:text-[hsl(var(--primary))]">
              Faire un don
            </Link>
            <Link href="/news" className="block py-2 text-white hover:text-[hsl(var(--primary))]">
              Blog
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
