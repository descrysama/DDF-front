import Link from "next/link"
import Image from "next/image"
import { Heart, Package, CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "Faire un don – Sans Croquettes Fixes",
  description:
    "Soutenez l'association Sans Croquettes Fixes en faisant un don financier ou matériel. Chaque contribution aide nos pensionnaires.",
}

const materialNeeds = [
  "Nourriture humide chats et chiens (non périmée)",
  "Croquettes pour chats et chiens (dans des paquets fermés)",
  "Friandises",
  "Accessoires chiens (harnais, muselière, laisses, etc.)",
  "Produits de soins (shampoing, nettoyant oreille, etc.)",
  "Jeux et jouets",
]

export default function DonatePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-[#f5f4f0]">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden min-h-[300px] flex items-center">
        <Image
          src="/donation-banner.jpg"
          alt="Bannière don"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#292930]/70" />
        <div className="relative z-10 container mx-auto max-w-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--primary))]/20 mb-6">
            <Heart className="text-[hsl(var(--primary))]" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Faire un don
          </h1>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Left – Financial donation */}
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#393b4f] mb-4">
                Don financier
              </h2>
              <div className="w-12 h-0.5 bg-[hsl(var(--primary))] mb-6" />
              <p className="text-gray-600 mb-4">
                Soutenez notre projet en faisant un don :{" "}
                <strong>chaque contribution, même modeste, nous permet d'avancer.</strong>
              </p>
              <p className="text-gray-600 mb-4">
                Les dons financiers nous servent à couvrir les{" "}
                <span className="text-[hsl(var(--primary))] font-medium">
                  frais vétérinaire
                </span>{" "}
                de nos animaux, à financer du matériel, à organiser des actions locales et à
                faire vivre notre engagement au quotidien.
              </p>
              <p className="font-bold text-[#393b4f]">
                En nous soutenant, vous nous aidez à rester indépendants, réactifs et engagés
                sur le long terme.
              </p>
            </div>

            <div className="bg-[#f5f4f0] rounded-xl p-5 text-sm text-gray-600 flex gap-3">
              <p>
                Les dons se font via la plateforme{" "}
                <strong>HelloAsso</strong> et sont entièrement sécurisés. Votre reçu fiscal
                sera automatiquement généré par la plateforme.
              </p>
            </div>

            <div className="text-xs text-gray-400 border-t pt-4 border-gray-100">
              L'association Sans Croquettes Fixes est reconnue d'intérêt général, tous vos dons
              peuvent potentiellement vous donner droit à une déduction fiscale.
            </div>

            <Button
              asChild
              size="lg"
              className="mt-auto w-full text-base font-bold"
            >
              <Link
                href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Heart size={18} />
                Faire un don financier
              </Link>
            </Button>
          </div>

          {/* Right – Material donation */}
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-[hsl(var(--primary))]" size={24} />
                <h2 className="text-2xl font-bold text-[#393b4f]">
                  Et les dons matériels ?
                </h2>
              </div>
              <div className="w-12 h-0.5 bg-[hsl(var(--primary))] mb-6" />

              <p className="text-gray-600 mb-4">
                Vous avez du matériel inutilisé ou en bon état que vous souhaiteriez nous
                transmettre ? On en a peut-être besoin ! Pour nous faire un don matériel,{" "}
                <strong>contactez-nous par mail à </strong>
                <a
                  href="mailto:dons@sanscroquettesfixes.fr"
                  className="text-[hsl(var(--primary))] font-bold hover:underline"
                >
                  dons@sanscroquettesfixes.fr
                </a>
              </p>

              <p className="text-gray-500 text-sm mb-6">
                Nous reviendrons vers vous rapidement pour organiser la récupération ou
                l'envoi (Lyon et alentours seulement).
              </p>

              <div className="w-12 h-0.5 bg-gray-200 mb-6" />

              <p className="text-[hsl(var(--primary))] font-bold mb-4 flex items-center gap-2">
                <Mail size={16} />
                Nous avons notamment besoin de :
              </p>

              <ul className="space-y-2">
                {materialNeeds.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                    <CheckCircle
                      size={16}
                      className="text-[hsl(var(--primary))] mt-0.5 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="text-base font-bold px-10">
                <a
                  href="mailto:dons@sanscroquettesfixes.fr"
                  className="flex items-center gap-2"
                >
                  <Package size={18} />
                  Faire un don matériel
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  )
}
