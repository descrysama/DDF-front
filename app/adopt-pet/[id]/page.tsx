import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Heart } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CAT_TINT } from "@/lib/placeholder-cats"
import { fetchAnimal, fetchAnimals, type CardAnimal, type AnimalActivity } from "@/lib/strapi"
import { CatCard } from "@/components/cat-card"
import { AdoptModal } from "./_components/adopt-modal"

interface Props {
  params: Promise<{ id: string }>
}

const ADOPTION_STEPS = [
  { title: 'Formulaire de pré-adoption', desc: 'Vous remplissez un questionnaire en ligne (~10 min).', tintClass: 'bg-peach' },
  { title: 'Échange téléphonique', desc: 'On apprend à vous connaître et à confirmer l\'adéquation.', tintClass: 'bg-lilac' },
  { title: 'Visite & rencontre', desc: 'Vous rencontrez le chat chez sa famille d\'accueil à Lyon.', tintClass: 'bg-pink' },
  { title: 'Contrat & arrivée', desc: 'Signature, frais d\'adoption, et le grand jour !', tintClass: 'bg-mint' },
]

const ACTIVITY_LABEL: Record<AnimalActivity, string> = {
  low: 'Calme',
  medium: 'Modéré',
  high: 'Très actif',
}

function enteneLabel(cat: CardAnimal): string {
  const compat = [
    cat.okWithChildren && 'les enfants',
    cat.okWithDogs && 'les chiens',
    cat.okWithCats && 'les chats',
  ].filter((v): v is string => Boolean(v))
  if (compat.length === 0) return 'Préfère un foyer calme, sans autres animaux'
  return `S'entend bien avec ${compat.join(', ')}`
}

export default async function CatPage({ params }: Props) {
  const { id } = await params
  const cat = await fetchAnimal(id)
  if (!cat) notFound()

  const { animals } = await fetchAnimals({ limit: 8 })
  const others = animals.filter((c) => c.documentId !== cat.documentId).slice(0, 4)
  const tintClass = CAT_TINT[cat.tag]
  const tagClass = cat.tagStyle === 'coral' ? 'bg-coral' : 'bg-ink'
  const storyParagraphs = cat.blurb.split('\n').map((p) => p.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        {/* Hero — photo + identity card */}
        <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-10">
          {/* Breadcrumb */}
          <div className="text-xs text-ink-muted mb-4">
            <Link href="/" className="text-ink-muted no-underline">Accueil</Link>
            <span className="mx-2 text-coral">—</span>
            <Link href="/adopt-pet" className="text-ink-muted no-underline">À l&apos;adoption</Link>
            <span className="mx-2 text-coral">—</span>
            <span className="text-ink">{cat.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-7 items-start">
            {/* Photo column */}
            <div>
              {/* Main photo placeholder */}
              <div className="relative rounded-xl overflow-hidden mb-2.5 aspect-[5/4]">
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${cat.tones[0]} 0%, ${cat.tones[1]} 100%)` }}
                />
                <svg
                  width="100%" height="100%"
                  className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern id={`detail-stripe-${cat.id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                      <line x1="0" y1="0" x2="0" y2="14" stroke="#ffffff" strokeWidth="6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#detail-stripe-${cat.id})`} />
                </svg>

                <div className={`absolute top-3.5 left-3.5 ${tagClass} text-white px-3 py-[5px] rounded text-xs font-semibold`}>
                  {cat.tag}
                </div>
                <button
                  className="absolute top-3.5 right-3.5 w-[38px] h-[38px] rounded-full bg-white/95 border-none cursor-pointer flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.10)]"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart size={16} className="text-coral" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white/90">
                  <span className="text-2xs font-medium">Photo · {cat.name}</span>
                </div>
              </div>

              {/* Thumbnail strip (placeholder) */}
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`rounded-md overflow-hidden aspect-square border-2 cursor-pointer ${i === 0 ? 'border-coral' : 'border-transparent'}`}
                    style={{ background: `linear-gradient(135deg, ${cat.tones[0]} 0%, ${cat.tones[1]} 100%)`, opacity: i === 0 ? 1 : 0.6 }}
                  />
                ))}
              </div>
            </div>

            {/* Identity card */}
            <div className={`${tintClass} rounded-xl p-6 md:sticky md:top-20`}>
              <h1 className="text-[38px] font-semibold tracking-[-0.03em] m-0 mb-1 leading-none text-ink">
                {cat.name}
              </h1>
              <div className="text-sm text-ink-muted mb-[18px]">
                {cat.age} · {cat.sex}
              </div>

              <p className="text-sm leading-[1.55] text-ink m-0 mb-5">
                {cat.blurb}
              </p>

              {/* Key facts */}
              <div className="bg-white/60 rounded-lg px-3 mb-[18px]">
                {[
                  ['Race', cat.breed],
                  ['Niveau d\'énergie', cat.activityLevel ? ACTIVITY_LABEL[cat.activityLevel] : null],
                  ['Mode de vie', cat.indoorOnly ? 'Intérieur strict' : 'Accès extérieur possible'],
                  ['Entente', enteneLabel(cat)],
                ]
                  .filter(([, v]) => Boolean(v))
                  .map(([k, v], i, arr) => (
                    <div
                      key={k}
                      className={`flex justify-between items-start gap-4 py-2.5 text-xs ${i < arr.length - 1 ? 'border-b border-ink/10' : ''}`}
                    >
                      <span className="text-ink-muted shrink-0">{k}</span>
                      <span className="text-ink font-medium text-right">{v}</span>
                    </div>
                  ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2">
                <AdoptModal cat={cat} />
                <button className="inline-flex items-center justify-center gap-2 px-[18px] py-3 rounded-md bg-white text-ink border border-border-strong text-sm font-semibold cursor-pointer font-[inherit] w-full">
                  Famille d&apos;accueil
                </button>
              </div>

              {/* Adoption fee note */}
              <div className="mt-3.5 p-3 bg-white/60 rounded-lg text-xs text-ink-muted leading-[1.5]">
                <strong className="text-ink">Frais d&apos;adoption : 150 €</strong> — couvrent stérilisation, vaccins, identification et tests sanitaires.
              </div>
            </div>
          </div>
        </section>

        {/* Story + adoption steps */}
        <section className="max-w-[1200px] mx-auto px-6 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-7">
            {/* Story */}
            <div>
              <div className="text-sm text-coral font-semibold mb-2">Son histoire</div>
              <h2 className="text-[26px] font-semibold tracking-[-0.02em] m-0 mb-3.5 leading-[1.1] text-ink">
                Faire connaissance avec {cat.name}.
              </h2>
              <div className="text-sm leading-[1.65] text-ink grid gap-3">
                {storyParagraphs.map((para, i) => (
                  <p key={i} className="m-0">{para}</p>
                ))}
              </div>
            </div>

            {/* Adoption steps */}
            <div className="bg-surface border border-border rounded-xl p-[22px]">
              <div className="text-sm text-coral font-semibold mb-1.5">Le parcours</div>
              <h3 className="text-[18px] font-semibold tracking-[-0.015em] m-0 mb-4 text-ink">
                Adopter en 4 étapes
              </h3>
              <div className="grid gap-3">
                {ADOPTION_STEPS.map(({ title, desc, tintClass: stepTint }, i) => (
                  <div key={title} className="flex gap-3 items-start">
                    <div
                      className={`w-7 h-7 rounded-full ${stepTint} text-ink flex items-center justify-center text-xs font-bold shrink-0`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-0.5 text-ink">{title}</div>
                      <div className="text-xs text-ink-muted leading-[1.45]">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Other cats */}
        {others.length > 0 && (
          <section className="bg-surface-alt py-12">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="flex justify-between items-end mb-5 flex-wrap gap-4">
                <div>
                  <div className="text-sm text-coral font-semibold mb-1.5">
                    Eux aussi cherchent une famille
                  </div>
                  <h3 className="text-h3 font-semibold tracking-[-0.02em] m-0 text-ink">
                    D&apos;autres chats à découvrir
                  </h3>
                </div>
                <Link
                  href="/adopt-pet"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-border-strong bg-surface text-sm font-semibold text-ink no-underline"
                >
                  Voir tous les chats <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                {others.map((c) => (
                  <CatCard key={c.id} cat={c} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
