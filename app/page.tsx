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
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden"
          style={{ background: `linear-gradient(to right, ${DARK_BG}, #292930)` }}
        >
          <div className="container mx-auto px-4 pt-20 pb-32 md:pt-32 md:pb-40">
            <div className="max-w-2xl space-y-6">
              <span className="inline-block text-[hsl(var(--primary))] font-semibold text-sm tracking-widest uppercase">
                Association basée à Lyon
              </span>
              <h1 className="text-7xl md:text-9xl font-extrabold text-white leading-none">
                OH ?!
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 leading-snug">
                Prêt.e à embarquer dans une nouvelle aventure auprès des animaux ?
              </h2>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="text-base px-8">
                  <Link href="/about-us">Découvrir l'asso</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-base px-8 bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/adopt-pet">Adopter un chat</Link>
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
              <div className="border-l-4 border-[hsl(var(--primary))] pl-6">
                <p className="text-lg leading-relaxed text-gray-700">
                  Sans Croquettes, c'est <strong>une asso 100 % bénévole</strong> : ici, chaque don sert directement à soigner et protéger les chats les plus fragiles. Ce sont vos dons qui nous permettent de changer les choses. Même 1€, 5€ ou 10€, ça peut vraiment changer le quotidien de nos pensionnaires.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Button asChild size="lg" className="w-full md:w-auto text-base px-10">
                  <Link
                    href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
                    target="_blank"
                  >
                    Faire un don
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
              <span className="inline-block text-[hsl(var(--primary))] font-semibold mb-3 tracking-widest uppercase text-sm">
                Qui sommes-nous ?
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                À propos de <br />Sans Croquettes Fixes
              </h2>
              <p className="text-lg text-gray-700">
                Sans Croquettes Fixes est <strong>une association basée à Lyon</strong>, active dans une grande partie de la région Auvergne-Rhône-Alpes (et parfois plus loin).
                <br /><br />
                Notre objectif ? Aider les animaux en détresse et les humains qui en prennent soin : accompagnement des propriétaires d'animaux en difficulté, pris en charge de chats sans solution, campagnes de stérilisation et distribution gratuite de croquettes.
              </p>
              <p className="text-lg font-semibold mt-6">Voici un aperçu de nos actions :</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
              {ACTIONS.map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-[hsl(var(--primary))]" />
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
              <span className="inline-block text-[hsl(var(--primary))] font-semibold mb-3 tracking-widest uppercase text-sm">
                Nos chats disponibles à l'adoption
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Trouver votre nouveau compagnon pour la vie
              </h2>
              <p className="text-lg text-gray-700">
                Adopter un chat est un acte responsable qui doit être mûrement réfléchi : c'est un engagement sur le long terme, pour le bien-être de l'animal comme de sa future famille.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Important :</strong> notre nouveau site internet étant encore en construction, toutes les fiches ne sont pas forcément à jour. Exceptionnellement, nous vous prions de bien vouloir vous tourner vers notre page Facebook{" "}
                <Link
                  href="https://www.facebook.com/sanscroquettesfixes"
                  target="_blank"
                  className="text-[hsl(var(--primary))] hover:underline"
                >
                  en cliquant ici
                </Link>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/25 relative">
                    <div className="absolute top-4 left-4 bg-[hsl(var(--primary))] text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                        <HomeIcon className="w-4 h-4 text-[hsl(var(--primary))]" />
                        <span>Habitué à l'appartement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-[hsl(var(--primary))]" />
                        <span>Vacciné, stérilisé</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="text-base px-10">
                <Link href="/adopt-pet">Voir tous les chats</Link>
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
                  <div className="text-[hsl(var(--primary))] font-semibold uppercase tracking-widest text-sm -mt-6">
                    Ans d'existence
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-extrabold">Les félins de l'ombre</h2>
                <div className="w-20 h-1 bg-[hsl(var(--primary))]" />
                <p className="text-lg leading-relaxed text-white/90">
                  En 2025, à l'occasion de nos 10 ans, nous nous lançons dans une toute nouvelle aventure : Les félins de l'ombre. Ce projet prend la forme d'un lieu de vie pour les chats trop souvent oubliés, qui n'ont malheureusement pas la possibilité d'être adoptés, mais qui ne sont pas en mesure de vivre en totale liberté.
                </p>
                <p className="text-lg leading-relaxed text-white/90">
                  Pour plus d'informations sur le projet, nous vous invitons à vous rendre directement sur la page de notre levée de fonds{" "}
                  <Link
                    href="https://www.helloasso.com/associations/sans-croquettes-fixes/collectes/aidez-nous-a-batir-un-lieu-pour-des-chats-oublies"
                    target="_blank"
                    className="text-[hsl(var(--primary))] hover:underline font-semibold"
                  >
                    en cliquant ici
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
                <span className="inline-block text-[hsl(var(--primary))] font-semibold mb-3 tracking-widest uppercase text-sm">
                  Découvrez notre blog pour plus d'actualités
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold">Nos dernières updates</h2>
              </div>
              <Link
                href="/news"
                className="mt-4 md:mt-0 text-[hsl(var(--primary))] font-semibold hover:underline text-sm"
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
                    <Button variant="link" className="mt-4 p-0 text-[hsl(var(--primary))]">
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
              <span className="inline-block text-[hsl(var(--primary))] font-semibold mb-3 tracking-widest uppercase text-sm">
                Comment vous remercier ?
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
                Grâce à votre aide, nous avons pu apporter une aide significative à des milliers d'animaux et leurs humains
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
                    className="text-6xl md:text-8xl font-extrabold text-[hsl(var(--primary))] mb-3 block"
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
                  className="absolute -top-8 -left-4 text-[hsl(var(--primary))]/15 text-[9rem] leading-none select-none pointer-events-none"
                >
                  "
                </div>
                <span className="inline-block text-[hsl(var(--primary))] font-semibold tracking-widest uppercase text-sm">
                  L'histoire de Sans Croquettes Fixes
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold">
                  Parce que l'abandon ne devrait jamais être une solution
                </h3>
                <div className="w-20 h-1 bg-[hsl(var(--primary))]" />
                <p className="text-lg text-gray-700 leading-relaxed">
                  C'est autour de cette conviction que Sans Croquettes Fixes est née. Au départ, c'était quelques mains tendues pour distribuer gratuitement de la nourriture aux animaux des sans-abri. Et puis, au fil des années, l'association est devenue un refuge au sens large : un lieu sûr pour les animaux qui n'avaient plus nulle part où aller, et un soutien pour ceux qui, malgré les difficultés, refusent de baisser les bras.
                </p>
                <p className="text-sm text-gray-500 italic">
                  — Anaïs Hillion, co-fondatrice de Sans Croquettes Fixes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    icon: Heart,
                    title: "Faire un don",
                    desc: "Pour nous aider à financer les soins de nos animaux, nous avons besoin de dons.",
                  },
                  {
                    icon: Stethoscope,
                    title: "Devenir famille d'accueil",
                    desc: "Chez Sans Croquettes Fixes, les chats sont placés temporairement dans des familles d'accueil.",
                  },
                  {
                    icon: Users,
                    title: "S'engager comme bénévole",
                    desc: "Toutes nos actions sont rendues possibles grâce à nos bénévoles.",
                    colSpan: true,
                  },
                ].map(({ icon: Icon, title, desc, colSpan }) => (
                  <Card
                    key={title}
                    className={`text-center border-t-4 border-[hsl(var(--primary))] ${colSpan ? "md:col-span-2" : ""}`}
                  >
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-[hsl(var(--primary))]" />
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
