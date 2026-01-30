import Link from "next/link"
import Image from "next/image"
import { Heart, Home as HomeIcon, Stethoscope, UserCheck, Users, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#393b4f] to-[#292930] py-20 md:py-32 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white">
                  OH ?!
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Prêt.e à embarquer dans une nouvelle aventure auprès des animaux ?
                </h2>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/about-us">DÉCOUVRIR L'ASSO</Link>
                  </Button>
                  <span className="hidden md:inline-flex items-center text-white/80">ou</span>
                  <Button asChild size="lg">
                    <Link href="/adopt-pet">ADOPTER UN CHAT</Link>
                  </Button>
                </div>
                {/* Decorative paw prints */}
                <div className="absolute right-10 top-10 opacity-10 rotate-[-25deg]">
                  <Image
                    src="/paw.png"
                    alt="Patte"
                    width={150}
                    height={150}
                  />
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-20">
                  <Image
                    src="/paw.png"
                    alt="Patte"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Banner */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg leading-relaxed text-gray-700">
                  Sans Croquettes, c'est <strong>une asso 100 % bénévole</strong> : ici, chaque don sert directement à soigner et protéger les chats les plus fragiles. Ce sont vos dons qui nous permettent de changer les choses. Même 1€, 5€ ou 10€, ça peut vraiment changer le quotidien de nos pensionnaires. ❤️
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Button asChild size="lg" className="w-full md:w-auto">
                  <Link href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1" target="_blank">
                    FAIRE UN DON
                  </Link>
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  66% de déduction fiscale
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h4 className="text-[hsl(var(--primary))] font-semibold mb-2">Qui sommes-nous ?</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                À propos de <br />Sans Croquettes Fixes
              </h2>
              <p className="text-lg text-gray-700">
                Sans Croquettes Fixes est <strong>une association basée à Lyon</strong>, active dans une grande partie de la région Auvergne-Rhône-Alpes (et parfois plus loin).
                <br />Notre objectif ? Aider les animaux en détresse et les humains qui en prennent soin : accompagnement des propriétaires d'animaux en difficulté, pris en charge de chats sans solution, campagnes de stérilisation et distribution gratuite de croquettes.
              </p>
              <p className="text-lg font-semibold mt-4">
                <strong>Voici un aperçu de nos actions :</strong>
              </p>
            </div>

            {/* Actions Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle className="text-xl">Prise en charge</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Chats malades, âgés ou abandonnés : Sans Croquettes Fixes prend en charge ceux qui n'ont plus d'autre solution, pour leur offrir soins, sécurité et, parfois, une seconde chance.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                    <HomeIcon className="w-8 h-8 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle className="text-xl">Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Tous les vendredis à Lyon (69), nous proposons une distribution gratuite de croquettes pour aider les familles en difficulté à nourrir leurs animaux et éviter les abandons pour des raisons financières.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                    <Stethoscope className="w-8 h-8 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle className="text-xl">Stérilisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Tout au long de l'année, nous menons des campagnes de stérilisation, notamment en partenariat avec les communes, pour limiter la prolifération des chats errants et améliorer leur qualité de vie.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                    <UserCheck className="w-8 h-8 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle className="text-xl">Accompagnement</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Nous accompagnons les particuliers confrontés à des difficultés avec leurs animaux en leur apportant écoute, conseils et solutions adaptées. L'objectif : éviter les abandons et ne recourir à une prise en charge qu'en dernier recours.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle className="text-xl">Sensibilisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Nous participons régulièrement à des événements pour sensibiliser le public à la cause animale, au respect du vivant et au bien-être des animaux, quels qu'ils soient.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Adoption Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h4 className="text-[hsl(var(--primary))] font-semibold mb-2">Nos chats disponibles à l'adoption</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Trouver votre nouveau compagnon pour la vie
              </h2>
              <p className="text-lg text-gray-700">
                Adopter un chat est un acte responsable qui doit être mûrement réfléchi : c'est un engagement sur le long terme, pour le bien-être de l'animal comme de sa future famille.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Important :</strong> notre nouveau site internet étant encore en construction, toutes les fiches ne sont pas forcément à jour. Exceptionnellement, nous vous prions de bien vouloir vous tourner vers notre page Facebook{" "}
                <Link href="https://www.facebook.com/sanscroquettesfixes" target="_blank" className="text-[hsl(var(--primary))] hover:underline">
                  en cliquant ici
                </Link>.
              </p>
            </div>

            {/* Cats Grid - Placeholder */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Les chats seront affichés ici depuis Strapi */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-64 bg-gray-200 relative">
                    <div className="absolute top-4 left-4 bg-[hsl(var(--primary))] text-white px-3 py-1 rounded-full text-sm">
                      Adulte
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>Chat {i}</CardTitle>
                    <CardDescription>
                      Description du chat à venir depuis Strapi
                    </CardDescription>
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
              <Button asChild size="lg">
                <Link href="/adopt-pet">Voir tous les chats</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Les félins de l'ombre Section */}
        <section className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                {/* Placeholder for image */}
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-4xl md:text-5xl font-extrabold">
                  Les félins de l'ombre
                </h2>
                <div className="w-20 h-1 bg-[hsl(var(--primary))]"></div>
                <p className="text-lg leading-relaxed">
                  En 2025, à l'occasion de nos 10 ans, nous nous lançons dans une toute nouvelle aventure : Les félins de l'ombre. Ce projet prend la forme d'un lieu de vie pour les chats trop souvent oubliés, qui n'ont malheureusement pas la possibilité d'être adoptés, mais qui ne sont pas en mesure de vivre en totale liberté.
                </p>
                <p className="text-lg leading-relaxed">
                  Pour plus d'informations sur le projet, nous vous invitons à vous rendre directement sur la page de notre levée de fonds{" "}
                  <Link href="https://www.helloasso.com/associations/sans-croquettes-fixes/collectes/aidez-nous-a-batir-un-lieu-pour-des-chats-oublies" target="_blank" className="text-[hsl(var(--primary))] hover:underline font-semibold">
                    en cliquant ici
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <h4 className="text-[hsl(var(--primary))] font-semibold mb-2">Découvrez notre blog pour plus d'actualités</h4>
                <h2 className="text-4xl md:text-5xl font-extrabold">
                  Nos dernières updates
                </h2>
              </div>
            </div>

            {/* Blog Grid - Placeholder */}
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-64 bg-gray-200"></div>
                  <CardHeader>
                    <div className="text-sm text-gray-500 mb-2">
                      <span>juillet 25, 2025</span>
                    </div>
                    <CardTitle className="text-2xl">Titre de l'article {i}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      Extrait de l'article à venir depuis Strapi...
                    </CardDescription>
                    <Button variant="link" className="mt-4 p-0">
                      Lire la suite →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                {/* Placeholder for image */}
              </div>
              <div className="order-1 md:order-2 space-y-8">
                <div>
                  <h4 className="text-[hsl(var(--primary))] font-semibold mb-2">Comment vous remercier ?</h4>
                  <h2 className="text-3xl md:text-4xl font-extrabold">
                    Grâce à votre aide, notre association a pu apporter une aide significative à des milliers d'animaux et leurs humains
                  </h2>
                </div>
                <div className="w-20 h-1 bg-[hsl(var(--primary))]"></div>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-[hsl(var(--primary))] mb-2">10</div>
                    <div className="text-sm text-gray-600">Years of Helping</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-[hsl(var(--primary))] mb-2">5.6k</div>
                    <div className="text-sm text-gray-600">animaux sauvés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-[hsl(var(--primary))] mb-2">18k</div>
                    <div className="text-sm text-gray-600">tonnes de croquettes distribuées</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h4 className="text-[hsl(var(--primary))] font-semibold">L'histoire de Sans Croquettes Fixes</h4>
                <h3 className="text-3xl md:text-4xl font-extrabold">
                  Parce que l'abandon ne devrait jamais être une solution
                </h3>
                <div className="w-20 h-1 bg-[hsl(var(--primary))]"></div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  C'est autour de cette conviction que Sans Croquettes Fixes est née. Au départ, c'était quelques mains tendues pour distribuer gratuitement de la nourriture aux animaux des sans-abri. Et puis, au fil des années, l'association est devenue un refuge au sens large : un lieu sûr pour les animaux qui n'avaient plus nulle part où aller, et un soutien pour ceux qui, malgré les difficultés, refusent de baisser les bras.
                </p>
                <div className="pt-4">
                  <div className="text-sm text-gray-600 italic">
                    Anaïs Hillion, co-fondatrice de Sans Croquettes Fixes
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-[hsl(var(--primary))]" />
                    </div>
                    <CardTitle className="text-lg">Faire un don</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Pour nous aider à financer les soins de nos animaux, nous avons besoin de dons.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                      <Stethoscope className="w-6 h-6 text-[hsl(var(--primary))]" />
                    </div>
                    <CardTitle className="text-lg">Devenir famille d'accueil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Chez Sans Croquettes Fixes, les chats sont placés temporairement dans des familles d'accueil.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-lg transition-shadow md:col-span-2">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-[hsl(var(--primary))]" />
                    </div>
                    <CardTitle className="text-lg">S'engager comme bénévole</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Toutes nos actions sont rendues possibles grâce à nos bénévoles.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
