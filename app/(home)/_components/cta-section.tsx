import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-16 px-6 bg-bg">
      <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-coral to-magenta text-white rounded-xl px-10 py-11 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="text-xs text-pink font-semibold mb-2">
              Comment vous remercier ?
            </div>
            <h2 className="text-h3 leading-[1.05] tracking-[-0.02em] font-semibold m-0 mb-3 text-white">
              Grâce à votre aide, des milliers d&apos;animaux ont une seconde chance.
            </h2>
            <p className="text-sm leading-[1.55] text-white/90 m-0 max-w-[460px]">
              Frais vétérinaires, matériel, transports — votre don sert directement nos pensionnaires.
            </p>
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <Link
              href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between px-5 py-3.5 rounded-md bg-white text-ink text-sm font-semibold no-underline"
            >
              <span>Faire un don</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about-us#benevoles"
              className="inline-flex items-center justify-between px-5 py-3.5 rounded-md bg-white/15 border border-white/30 text-white text-sm font-medium no-underline"
            >
              <span>Devenir famille d&apos;accueil</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
