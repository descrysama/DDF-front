import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CAT_TINT } from "@/lib/placeholder-cats"
import { fetchAnimal, fetchAnimals, fetchCompatibility, compatibilityTone, type CardAnimal, type AnimalActivity } from "@/lib/strapi"
import { getCurrentUser } from "@/lib/auth"
import { CatCard } from "@/components/cat-card"
import { AdoptModal } from "./_components/adopt-modal"
import { MediaViewer } from "./_components/media-viewer"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ adopt?: string }>
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

const MEDICAL_EVENT_LABEL: Record<string, string> = {
  vaccination: 'Vaccination',
  sterilisation: 'Stérilisation',
  consultation: 'Consultation',
  traitement: 'Traitement',
  autre: 'Suivi',
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

export default async function CatPage({ params, searchParams }: Props) {
  const { id } = await params
  const { adopt } = await searchParams
  const cat = await fetchAnimal(id)
  if (!cat) notFound()

  const user = await getCurrentUser()
  const compatibility = user ? await fetchCompatibility(cat.documentId, user.id) : null

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
              <MediaViewer
                name={cat.name}
                tones={cat.tones}
                tag={cat.tag}
                tagClass={tagClass}
                medias={cat.medias}
                videoUrl={cat.videoUrl}
              />
            </div>

            {/* Identity card */}
            <div className={`${tintClass} rounded-xl p-6 md:sticky md:top-20`}>
              <h1 className="text-[38px] font-semibold tracking-[-0.03em] m-0 mb-1 leading-none text-ink">
                {cat.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-ink-muted mb-[18px]">
                <span>{cat.age} · {cat.sex}</span>
                {compatibility !== null && (
                  <span className={`inline-flex items-center gap-1 ${compatibilityTone(compatibility)} text-ink px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
                    <Sparkles size={11} />
                    {compatibility}% compatible
                  </span>
                )}
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
                  ['En refuge depuis', cat.trapDate ? new Date(cat.trapDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : null],
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
                <AdoptModal cat={cat} defaultOpen={adopt === "1"} />
                <Button
                  variant="outline"
                  className="w-full h-auto gap-2 px-[18px] py-3 rounded-md bg-white hover:bg-white shadow-none text-ink border border-border-strong text-sm font-semibold"
                >
                  Famille d&apos;accueil
                </Button>
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

        {/* Suivi médical */}
        {cat.medicalHistory.length > 0 && (
          <section className="max-w-[1200px] mx-auto px-6 pb-14">
            <div className="text-sm text-coral font-semibold mb-2">Transparence</div>
            <h2 className="text-[26px] font-semibold tracking-[-0.02em] m-0 mb-4 leading-[1.1] text-ink">
              Suivi médical de {cat.name}
            </h2>
            <div className="bg-surface border border-border rounded-xl p-[22px] grid gap-3">
              {cat.medicalHistory.map((event) => (
                <div key={event.id} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {MEDICAL_EVENT_LABEL[event.event_type] ?? event.event_type}
                    </div>
                    {event.veterinarian && (
                      <div className="text-xs text-ink-muted mt-0.5">{event.veterinarian}</div>
                    )}
                    {event.note && (
                      <div className="text-xs text-ink-muted mt-0.5">{event.note}</div>
                    )}
                  </div>
                  <div className="text-xs text-ink-muted shrink-0">
                    {new Date(event.event_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
