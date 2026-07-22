import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Page introuvable – Sans Croquettes Fixes',
  description: "Cette page n'existe pas ou a été déplacée.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <main className="flex-1 flex items-center">
        <section className="max-w-[1200px] w-full mx-auto px-6 py-20 text-center">
          <div className="relative inline-block mb-6">
            <span className="text-[96px] md:text-[140px] leading-none font-semibold tracking-[-0.04em] text-coral">
              404
            </span>
            <Image
              src="/paw.png"
              alt=""
              width={48}
              height={48}
              className="absolute -top-2 -right-10 rotate-12 opacity-80"
            />
          </div>

          <h1 className="text-h1-sm leading-tight tracking-[-0.03em] font-semibold m-0 mb-3 text-ink">
            Ce chat s&apos;est <span className="text-coral">perdu</span>.
          </h1>
          <p className="text-sm text-ink-muted max-w-[440px] mx-auto mb-8 leading-[1.6]">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
            Pas de panique&nbsp;: nos chats, eux, savent où retrouver leur panier.
          </p>

          <div className="flex gap-2 flex-wrap justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-[18px] py-3 rounded-md bg-ink text-white text-sm font-semibold no-underline"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/adopt-pet"
              className="inline-flex items-center gap-2 px-[18px] py-3 rounded-md bg-coral text-white text-sm font-semibold no-underline"
            >
              Voir les chats à adopter
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
