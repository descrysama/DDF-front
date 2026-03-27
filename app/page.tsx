import Link from "next/link"
import Image from "next/image"
import { Heart, Home as HomeIcon, Stethoscope, UserCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { VisaIcon, MastercardIcon, CbIcon, PayPalIcon } from "@/components/payment-icons"
import { WaveDivider, WAVE_PATH_INV } from "@/components/wave-divider"
import { AnimatedCounter } from "@/components/animated-counter"
import { DARK_BG, CREAM_BG, GRAY_50 } from "@/lib/constants"

const ACTIONS = [
  {
    icon: Heart,
    title: "Prise en charge",
    desc: "Chats malades, âgés ou abandonnés : Sans Croquettes Fixes prend en charge ceux qui n'ont plus d'autre solution, pour leur offrir soins, sécurité et, parfois, une seconde chance.",
  },
  {
    icon: HomeIcon,
    title: "Distribution",
    desc: "Tous les vendredis à Lyon (69), nous proposons une distribution gratuite de croquettes pour aider les familles en difficulté à nourrir leurs animaux et éviter les abandons pour des raisons financières.",
  },
  {
    icon: Stethoscope,
    title: "Stérilisation",
    desc: "Tout au long de l'année, nous menons des campagnes de stérilisation, notamment en partenariat avec les communes, pour limiter la prolifération des chats errants et améliorer leur qualité de vie.",
  },
  {
    icon: UserCheck,
    title: "Accompagnement",
    desc: "Nous accompagnons les particuliers confrontés à des difficultés avec leurs animaux en leur apportant écoute, conseils et solutions adaptées. L'objectif : éviter les abandons.",
  },
  {
    icon: Users,
    title: "Sensibilisation",
    desc: "Nous participons régulièrement à des événements pour sensibiliser le public à la cause animale, au respect du vivant et au bien-être des animaux, quels qu'ils soient.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section
          className="relative overflow-hidden"
          style={{ background: `linear-gradient(to right, ${DARK_BG}, #292930)` }}
        >
          <div className="container mx-auto px-4 pt-20 pb-32 md:pt-32 md:pb-40">
            <div className="max-w-3xl space-y-6"> {/* Augmenté de 2xl à 3xl pour le confort de lecture */}
              <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase">
                Association de protection animale (69)
              </span>

              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                Sans Croquettes Fixes : L'association des chats à Lyon.
              </h1>

              <h2 className="text-xl md:text-2xl font-medium text-white/80 leading-relaxed max-w-2xl">
                Depuis 2015, nous luttons contre l'abandon et la précarité animale. 
                <strong> Adoptez, donnez ou agissez</strong> pour offrir une seconde chance aux félins oubliés.
              </h2>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="text-base px-8">
                  <Link href="/about-us">Notre histoire</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base px-8 bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/adopt-pet">Adopter un chat à Lyon</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative paw prints */}
          <div className="absolute right-10 top-10 opacity-10 rotate-[-25deg] hidden md:block">
            <Image src="/paw.png" alt="" width={180} height={180} />
          </div>
          <div className="absolute right-48 bottom-20 opacity-5 rotate-12 hidden lg:block">
            <Image src="/paw.png" alt="" width={100} height={100} />
          </div>

          {/* Wave interne : dark → white */}
          <div aria-hidden="true" className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
            <svg
              viewBox="0 0 1440 70"
              preserveAspectRatio="none"
              style={{ display: "block", width: "100%", height: 70 }}
            >
              <path d={WAVE_PATH_INV} fill="white" />
            </svg>
          </div>
        </section>

        {/* ── Donation Banner ── */}
        <section className="bg-white py-14">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="border-l-4 border-primary pl-6">
                <p className="text-lg leading-relaxed text-gray-700">
                  Derrière chaque chat soigné, il y a un don. Sans Croquettes Fixes est une{" "}
                  <strong>association 100 % bénévole basée à Lyon</strong> : pas de salaires, pas de frais cachés.
                  Votre argent va directement là où il compte — la nourriture, les soins vétérinaires, la stérilisation.{" "}
                  <strong>Même 5 €, ça change une vie.</strong>
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Button asChild size="lg" className="w-full md:w-auto text-base px-10">
                  <Link
                    href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
                    target="_blank"
                  >
                    Je fais un don pour les chats de Lyon
                  </Link>
                </Button>
                <div className="flex items-center gap-3">
                  <VisaIcon className="w-12 h-8" />
                  <MastercardIcon className="w-12 h-8" />
                  <CbIcon className="w-12 h-8" />
                  <PayPalIcon className="w-12 h-8" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── About / Actions ── */}
        <section className="bg-gray-50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-block text-primary font-semibold mb-3 tracking-widest uppercase text-sm">
                Qui sommes-nous ?
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Une association lyonnaise au service des chats —{" "}
                <br />et de ceux qui les aiment
              </h2>
              <p className="text-lg text-gray-700">
                Sans Croquettes Fixes est née à <strong>Lyon en 2015</strong>, autour d'une idée simple : personne ne devrait avoir à abandonner son animal faute de moyens.
                <br /><br />
                Depuis, on se bat chaque jour pour les chats en détresse et les humains qui font de leur mieux pour eux — en Auvergne-Rhône-Alpes et au-delà.
              </p>
              <p className="text-lg font-semibold mt-6">Voici un aperçu de nos actions :</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
              {ACTIONS.map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Adoption ── */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-block text-primary font-semibold mb-3 tracking-widest uppercase text-sm">
                Nos chats disponibles à l'adoption
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Adopter un chat à Lyon : ils n'attendent que vous
              </h2>
              <p className="text-lg text-gray-700">
                Adopter un chat à Lyon, c'est offrir une seconde chance à un animal qui a souvent tout perdu.
                Nos chats sont <strong>vaccinés, identifiés et stérilisés</strong> — et surtout, ils ont été aimés
                et suivis par nos bénévoles. On vous accompagne avant, pendant et après l'adoption.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Important :</strong> notre nouveau site internet étant encore en construction, toutes les fiches ne sont pas forcément à jour. Exceptionnellement, nous vous prions de bien vouloir vous tourner vers notre page Facebook{" "}
                <Link
                  href="https://www.facebook.com/sanscroquettesfixes"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  en cliquant ici
                </Link>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/25 relative">
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Adulte
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>Chat {i}</CardTitle>
                    <CardDescription>Description du chat à venir depuis Strapi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <HomeIcon className="w-4 h-4 text-primary" />
                        <span>Habitué à l'appartement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-primary" />
                        <span>Vacciné, stérilisé</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="text-base px-10">
                <Link href="/adopt-pet">Voir tous les chats à adopter</Link>
              </Button>
            </div>
          </div>
        </section>

        <WaveDivider from="white" to={DARK_BG} />

        {/* ── Les félins de l'ombre ── */}
        <section className="text-white py-20 md:py-28" style={{ background: DARK_BG }}>
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 flex items-center justify-center select-none">
                <div className="text-center">
                  <div className="text-[9rem] md:text-[12rem] font-extrabold text-white/[0.06] leading-none">
                    10
                  </div>
                  <div className="text-primary font-semibold uppercase tracking-widest text-sm -mt-6">
                    Ans d'existence
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-extrabold">
                  Les félins de l'ombre : un refuge pour ceux qu'on oublie trop souvent
                </h2>
                <div className="w-20 h-1 bg-primary" />
                <p className="text-lg leading-relaxed text-white/90">
                  En 2025, pour nos 10 ans, on se lance dans le projet le plus ambitieux de notre histoire : créer un vrai lieu de vie pour les chats qu'on ne peut ni adopter, ni laisser seuls dehors. Ceux qu'on appelle les invisibles. Ils méritent un chez-eux, eux aussi.
                </p>
                <p className="text-lg leading-relaxed text-white/90">
                  Pour plus d'informations sur le projet, nous vous invitons à vous rendre directement sur la page de notre levée de fonds{" "}
                  <Link
                    href="https://www.helloasso.com/associations/sans-croquettes-fixes/collectes/aidez-nous-a-batir-un-lieu-pour-des-chats-oublies"
                    target="_blank"
                    className="text-primary hover:underline font-semibold"
                  >
                    Soutenir le projet Les félins de l'ombre
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider from={DARK_BG} to={GRAY_50} invert />

        {/* ── Blog ── */}
        <section className="bg-gray-50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <span className="inline-block text-primary font-semibold mb-3 tracking-widest uppercase text-sm">
                  Découvrez notre blog pour plus d'actualités
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold">Nos dernières updates</h2>
              </div>
              <Link
                href="/news"
                className="mt-4 md:mt-0 text-primary font-semibold hover:underline text-sm"
              >
                Voir tout le blog →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <CardHeader>
                    <div className="text-sm text-gray-500 mb-2">juillet 25, 2025</div>
                    <CardTitle className="text-2xl">Titre de l'article {i}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      Extrait de l'article à venir depuis Strapi...
                    </CardDescription>
                    <Button variant="link" className="mt-4 p-0 text-primary">
                      Lire la suite →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider from={GRAY_50} to={DARK_BG} />

        {/* ── Stats ── */}
        <section className="text-white py-20 md:py-28" style={{ background: DARK_BG }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="inline-block text-primary font-semibold mb-3 tracking-widest uppercase text-sm">
                Comment vous remercier ?
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
                Ce que vous rendez possible, à Lyon et ailleurs
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto">
              {[
                { value: 10, suffix: "", decimals: 0, label: "Ans d'engagement" },
                { value: 5.6, suffix: "k", decimals: 1, label: "Animaux sauvés" },
                { value: 18, suffix: "k", decimals: 0, label: "Tonnes de croquettes" },
              ].map(({ value, suffix, decimals, label }) => (
                <div key={label} className="text-center">
                  <AnimatedCounter
                    value={value}
                    suffix={suffix}
                    decimals={decimals}
                    className="text-6xl md:text-8xl font-extrabold text-primary mb-3 block"
                  />
                  <div className="text-white/70 text-xs md:text-sm font-medium uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider from={DARK_BG} to={CREAM_BG} invert />

        {/* ── Story / Engagement ── */}
        <section className="py-20 md:py-28" style={{ background: CREAM_BG }}>
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 relative">
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -left-4 text-primary/15 text-[9rem] leading-none select-none pointer-events-none"
                >
                  "
                </div>
                <span className="inline-block text-primary font-semibold tracking-widest uppercase text-sm">
                  L'histoire de Sans Croquettes Fixes
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold">
                  L'abandon n'est pas une fatalité. On est là pour le prouver.
                </h3>
                <div className="w-20 h-1 bg-primary" />
                <p className="text-lg text-gray-700 leading-relaxed">
                  C'est autour de cette conviction que Sans Croquettes Fixes est née à Lyon en 2015. Au départ : quelques bénévoles et des sacs de croquettes distribués aux animaux des sans-abri. Aujourd'hui : des centaines de chats sauvés, des familles soutenues, et une communauté qui refuse de baisser les bras. Parce qu'on croit que l'amour qu'on donne aux animaux dit quelque chose de qui on est.
                </p>
                <p className="text-sm text-gray-500 italic">
                  — Anaïs Hillion, co-fondatrice de Sans Croquettes Fixes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    icon: Heart,
                    title: "Faire un don pour les chats",
                    desc: "Pour nous aider à financer les soins de nos animaux, nous avons besoin de dons.",
                  },
                  {
                    icon: Stethoscope,
                    title: "Accueillir un chat temporairement",
                    desc: "Chez Sans Croquettes Fixes, les chats sont placés temporairement dans des familles d'accueil.",
                  },
                  {
                    icon: Users,
                    title: "Rejoindre l'équipe bénévole à Lyon",
                    desc: "Toutes nos actions sont rendues possibles grâce à nos bénévoles.",
                    colSpan: true,
                  },
                ].map(({ icon: Icon, title, desc, colSpan }) => (
                  <Card
                    key={title}
                    className={`text-center border-t-4 border-primary ${colSpan ? "md:col-span-2" : ""}`}
                  >
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{desc}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}