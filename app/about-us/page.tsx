import Link from "next/link"
import Image from "next/image"
import { Heart, Home as HomeIcon, Stethoscope, Users, Shield, CheckCircle, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { WaveDivider, WAVE_PATH_INV } from "@/components/wave-divider"
import { DARK_BG } from "@/lib/constants"
import { StatCard } from "./_components/stat-card"
import { FeatureOverlayCard } from "./_components/feature-overlay-card"
import { SavedCatCard } from "./_components/saved-cat-card"
import { AdoptionCatCard } from "./_components/adoption-cat-card"

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden h-[400px] md:h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=2000" 
              alt="Background cats" 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 text-center container px-4 pt-16">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-3 drop-shadow-md">
              Qui sommes-nous ?
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none drop-shadow-lg">
              À propos de nous
            </h1>
          </div>
          
          <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 z-10" style={{ lineHeight: 0 }}>
             <svg
                viewBox="0 0 1440 70"
                preserveAspectRatio="none"
                style={{ display: "block", width: "100%", height: 70 }}
              >
                <path d={WAVE_PATH_INV} fill="white" />
              </svg>
           </div>
        </section>

        {/* Section: Qui sommes-nous ? */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16">
              
              <div className="lg:w-1/3 space-y-4">
                <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase">
                  L&apos;association
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  Sans Croquettes Fixes
                </h2>
                <div className="w-20 h-1 bg-background" />
              </div>
              
              <div className="lg:w-2/3">
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                  Sans Croquettes Fixes est née d&apos;un constat simple : la détresse animale 
                  ne touche pas que les animaux abandonnés. Souvent, derrière un animal en difficulté, 
                  se trouve un humain qui l&apos;est tout autant. C&apos;est pourquoi nous mettons un point d&apos;honneur 
                  à accompagner à la fois l&apos;humain et l&apos;animal. Nous agissons au quotidien pour protéger, 
                  soigner, et offrir une seconde chance à ceux qui n&apos;ont plus d&apos;autres solutions.
                </p>
              </div>

            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-16">
              {[
                { icon: Shield, stat: "225", label: "Sauvetages", desc: "Animaux secourus et pris en charge." },
                { icon: Users, stat: "13", label: "Bénévoles", desc: "Qui s'investissent au quotidien." },
                { icon: HomeIcon, stat: "36", label: "Adoptions", desc: "Trouvés un foyer pour la vie." },
                { icon: HandHeart, stat: "7", label: "Accompagnements", desc: "Pour préserver le lien avec l'animal." },
                { icon: Stethoscope, stat: "60+", label: "Soins à l'année", desc: "Frais vétérinaires et interventions." },
              ].map((statData, i) => (
                <StatCard key={i} {...statData} />
              ))}
            </div>
          </div>
        </section>

        {/* Section: Que faisons-nous ? */}
        <section className="bg-gray-50 py-20 md:py-28 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
               <div className="space-y-6">
                 <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase">
                    Que faisons-nous ?
                 </span>
                 <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    À Lyon, nous venons en aide aux humains et à leurs animaux.
                 </h2>
                 <p className="text-lg text-gray-700 leading-relaxed">
                   La situation des animaux errants ou des animaux de compagnie en grande difficulté est l&apos;affaire de tous. 
                   C&apos;est avec la volonté d&apos;avoir un impact direct et local que notre association concentre la majorité de 
                   ses efforts sur la région lyonnaise. Qu&apos;il s&apos;agisse de pallier un manque financier pour nourrir un animal 
                   ou d&apos;assister physiquement des personnes dépassées, nous sommes sur le terrain.
                 </p>
                 <ul className="space-y-4 pt-4">
                   {[
                     "Soutien matériel et distributions alimentaires",
                     "Aide aux soins vétérinaires et à la stérilisation",
                     "Lutte contre les abandons par un accompagnement adapté"
                   ].map((item, idx) => (
                     <li key={idx} className="flex items-center gap-3">
                       <CheckCircle className="w-6 h-6 text-primary" />
                       <span className="text-gray-800 font-medium">{item}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               <div className="relative flex justify-end">
                 <div className="relative w-full max-w-md h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                   <Image 
                     src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800" 
                     alt="Chat aidé" 
                     fill 
                     className="object-cover"
                   />
                 </div>
                 
                 {/* overlay cards */}
                 <div className="absolute top-1/2 -translate-y-1/2 -left-8 lg:-left-16 hidden md:flex flex-col gap-4 w-64 md:w-72">
                   {[
                     { title: "Aide physique et matérielle", icon: HandHeart },
                     { title: "Soutien moral et conseils", icon: Heart },
                     { title: "Familles d'accueil et adoption", icon: HomeIcon },
                   ].map((item, i) => (
                     <FeatureOverlayCard key={i} {...item} />
                   ))}
                 </div>
               </div>
            </div>

          </div>
        </section>

        {/* Section: Notre récompense */}
        <section className="py-20 md:py-28">
           <div className="container mx-auto px-4">
              <div className="max-w-3xl text-center mx-auto mb-16 space-y-4">
                 <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase">
                    Notre récompense
                 </span>
                 <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Derrière chaque sauvetage, une rencontre inoubliable.
                 </h2>
                 <p className="text-lg text-gray-600">
                    Découvrez quelques visages familiers de nos actions. Leurs regards en disent long 
                    sur le chemin parcouru depuis leur prise en charge.
                 </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                 {[
                   { name: "Maoutz", img: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600", desc: "Récupéré errant et malade, il est maintenant un gros nounours dans sa famille." },
                   { name: "P'tit'ti", img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=600", desc: "Trouvé chaton derrière un moteur de voiture. Adoré par sa nouvelle humaine." },
                   { name: "Bilo", img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=600", desc: "Un caractère affirmé mais tellement d'amour à donner !" },
                   { name: "Kawaï", img: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=600", desc: "Une boule d'énergie inépuisable qui fait le bonheur de ses maîtres." }
                 ].map((cat, i) => (
                    <SavedCatCard key={i} {...cat} />
                 ))}
              </div>
           </div>
        </section>

        <WaveDivider from="white" to={DARK_BG} />

        {/* Section: Nos origines */}
        <section className="text-white py-20 md:py-28" style={{ background: DARK_BG }}>
           <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                 <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">
                    Nos origines
                 </span>
                 <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Les débuts de Sans Croquettes Fixes
                 </h2>
                 <div className="w-20 h-1 bg-primary mx-auto" />
                 
                 <div className="space-y-6 flex flex-col items-center">
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed text-left md:text-center max-w-3xl">
                      <strong>Tout a commencé par une maraude en 2014.</strong> Un soir d&apos;hiver, lors d&apos;une distribution de repas pour les sans-abri, la détresse animale nous a sauté aux yeux. Plusieurs personnes en grande difficulté partageaient le peu qu&apos;elles avaient avec leur précieux compagnon. C&apos;est en réalisant que la misère touche aussi nos amis à quatre pattes que Sans Croquettes Fixes a vu le jour.
                    </p>
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed text-left md:text-center max-w-3xl">
                      Aujourd&apos;hui, l&apos;équipe s&apos;est étoffée et nos actions se sont diversifiées : aides financières, stérilisations, accompagnements sociaux et adoptions. Mais notre cœur d&apos;action est resté le même : <strong>ne laisser aucune patte derrière nous.</strong>
                    </p>
                 </div>
              </div>
           </div>
        </section>

        <WaveDivider from={DARK_BG} to={"white"} invert />

        {/* Section: Un nouveau compagnon */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-block text-primary font-semibold mb-3 tracking-widest uppercase text-sm">
                Un nouveau compagnon ?
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Votre nouveau compagnon de vie ?
              </h2>
              <p className="text-lg text-gray-700">
                Adopter un chat est un acte responsable qui doit être mûrement réfléchi. Voici quelques pensionnaires qui n&apos;attendent plus que vous.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                 { name: "Chantilly", img: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400", desc: "Une minette douce et très câline qui a besoin de temps.", tags: ["Femelle", "Calme", "En appartement"] },
                 { name: "Gipsy", img: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=400", desc: "Joueuse et espiègle, elle adore les sessions de plumeau.", tags: ["Femelle", "Joueuse", "Maison avec jardin"] },
                 { name: "Oria", img: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400", desc: "Curieuse de nature, elle vous suivra partout dans la maison.", tags: ["Femelle", "Câline", "Ok chats"] }
              ].map((cat, i) => (
                <AdoptionCatCard key={i} {...cat} />
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="text-base px-10">
                <Link href="/adopt-pet">Voir tous les chats à l&apos;adoption</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
