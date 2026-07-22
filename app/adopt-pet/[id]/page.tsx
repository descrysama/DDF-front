import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CAT_TINT } from "@/lib/placeholder-cats"
import { fetchAnnouncement, fetchAnnouncements, fetchCompatibility, compatibilityTone, ACTIVITY_LABEL, type CardAnimal } from "@/lib/strapi"
import { getCurrentUser, getAuthToken } from "@/lib/auth"
import { CatCard } from "@/components/cat-card"
import { AdoptModal } from "./_components/adopt-modal"
import { MediaViewer } from "./_components/media-viewer"

interface Props {
  params: Promise<{ id: string }>
}

const ADOPTION_STEPS = [
  { title: 'Formulaire de pré-adoption', desc: 'Vous remplissez un questionnaire en ligne (~10 min).', tintClass: 'bg-peach' },
  { title: 'Échange téléphonique', desc: 'On apprend à vous connaître et à confirmer l\'adéquation.', tintClass: 'bg-lilac' },
  { title: 'Visite & rencontre', desc: 'Vous rencontrez le chat chez sa famille d\'accueil à Lyon.', tintClass: 'bg-pink' },
  { title: 'Contrat & arrivée', desc: 'Signature, frais d\'adoption, et le grand jour !', tintClass: 'bg-mint' },
]

const MEDICAL_EVENT_LABEL: Record<string, string> = {
  vaccination: 'Vaccination',
  sterilisation: 'Stérilisation',
  consultation: 'Consultation',
  traitement: 'Traitement',
  autre: 'Suivi',
}

function enteneLabel(cat: { okWithChildren: boolean; okWithDogs: boolean; okWithCats: boolean }): string {
  const compat = [
    cat.okWithChildren && 'les enfants',
    cat.okWithDogs && 'les chiens',
    cat.okWithCats && 'les chats',
  ].filter((v): v is string => Boolean(v))
  if (compat.length === 0) return 'Préfère un foyer calme, sans autres animaux'
  return `S'entend bien avec ${compat.join(', ')}`
}

/**
 * One cat's own panel within a duo card — photo, name, blurb, entente, and a
 * single row of compact fact/health pills (not a repeated fact table, which
 * doubled up into a heavy admin-form look when shown twice side by side).
 */
function AnimalCard({ animal, compatibility }: { animal: CardAnimal; compatibility: number | null }) {
  const tagClass = animal.tagStyle === 'coral' ? 'bg-coral' : 'bg-ink'
  const facts = [
    animal.breed,
    animal.activityLevel ? ACTIVITY_LABEL[animal.activityLevel] : null,
    animal.indoorOnly ? 'Intérieur strict' : 'Accès extérieur possible',
  ].filter((v): v is string => Boolean(v))
  const health: [string, boolean][] = [
    ['Vacciné', animal.vaccinated],
    ['Stérilisé', animal.sterilized],
    ['Identifié', animal.identified],
    ['Déparasité', animal.dewormed],
  ]

  return (
    <div className="bg-white/70 rounded-lg p-3.5 flex flex-col h-full">
      <MediaViewer
        name={animal.name}
        tones={animal.tones}
        tag={animal.tag}
        tagClass={tagClass}
        medias={animal.medias}
        videoUrl={animal.videoUrl}
      />

      <div className="pt-3.5 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <h2 className="text-[19px] font-semibold tracking-[-0.02em] m-0 leading-none text-ink">
            {animal.name}
          </h2>
          <span className="text-xs text-ink-muted shrink-0">{animal.age} · {animal.sex}</span>
        </div>

        {compatibility !== null && (
          <span className={`inline-flex items-center gap-1 w-fit mb-2 ${compatibilityTone(compatibility)} text-ink px-2 py-0.5 rounded-full text-[11px] font-semibold`}>
            <Sparkles size={10} />
            {compatibility}% compatible
          </span>
        )}

        <p className="text-xs leading-[1.5] text-ink m-0 mb-2">{animal.blurb}</p>
        <p className="text-xs leading-[1.5] text-ink-muted m-0 mb-3">{enteneLabel(animal)}</p>

        {animal.characters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {animal.characters.map((c) => (
              <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-ink/[0.06] text-ink">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-ink/10 flex flex-wrap gap-1.5">
          {facts.map((f) => (
            <span key={f} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-ink/[0.06] text-ink">
              {f}
            </span>
          ))}
          {health.map(([label, active]) => (
            <span
              key={label}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                active ? 'bg-green-100 text-green-700' : 'bg-black/5 text-ink-subtle'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function CatPage({ params }: Props) {
  const { id } = await params
  const cat = await fetchAnnouncement(id)
  if (!cat) notFound()

  const isDuo = cat.animals.length > 1

  const user = await getCurrentUser()
  const token = user ? await getAuthToken() : null
  const compatibilityByAnimal: Record<string, number | null> = {}
  if (user && token) {
    await Promise.all(
      cat.animals.map(async (animal) => {
        compatibilityByAnimal[animal.documentId] = await fetchCompatibility(animal.documentId, token)
      })
    )
  }
  const primaryCompatibility = cat.animals[0] ? compatibilityByAnimal[cat.animals[0].documentId] ?? null : null

  const { announcements } = await fetchAnnouncements({ limit: 8 })
  const others = announcements.filter((c) => c.documentId !== cat.documentId).slice(0, 4)
  const tintClass = CAT_TINT[cat.tag]
  const tagClass = cat.tagStyle === 'coral' ? 'bg-coral' : 'bg-ink'
  const storyParagraphs = cat.blurb.split('\n').map((p) => p.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        {/* Hero — photo + identity card(s) */}
        <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-10">
          {/* Breadcrumb */}
          <div className="text-xs text-ink-muted mb-4">
            <Link href="/" className="text-ink-muted no-underline">Accueil</Link>
            <span className="mx-2 text-coral">—</span>
            <Link href="/adopt-pet" className="text-ink-muted no-underline">À l&apos;adoption</Link>
            <span className="mx-2 text-coral">—</span>
            <span className="text-ink">{cat.name}</span>
          </div>

          {isDuo ? (
            <div className={`${tintClass} rounded-xl p-6`}>
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <h1 className="text-[28px] font-semibold tracking-[-0.03em] m-0 leading-none text-ink">
                  {cat.name}
                </h1>
                <span className={`${tagClass} text-white px-2.5 py-1 rounded text-[11px] font-semibold`}>Duo</span>
              </div>
              <p className="text-sm text-ink-muted m-0 mb-4">Inséparables — à adopter ensemble.</p>

              {cat.constraints.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cat.constraints.map((c) => (
                    <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/70 text-ink">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch mb-5">
                {cat.animals.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} compatibility={compatibilityByAnimal[animal.documentId] ?? null} />
                ))}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white items-center justify-center text-sm font-bold text-ink shadow-[0_2px_10px_rgba(20,22,38,0.18)] z-10">
                  &amp;
                </div>
              </div>

              {/* Shared CTA */}
              <div className="bg-white/70 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-xs text-ink m-0">
                  <strong>Frais d&apos;adoption : 150 € par chat</strong> — couvrent stérilisation, vaccins, identification et tests sanitaires.
                </p>
                <AdoptModal cat={cat} />
              </div>
            </div>
          ) : (
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
                  {primaryCompatibility !== null && (
                    <span className={`inline-flex items-center gap-1 ${compatibilityTone(primaryCompatibility)} text-ink px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
                      <Sparkles size={11} />
                      {primaryCompatibility}% compatible
                    </span>
                  )}
                </div>

                <p className="text-sm leading-[1.55] text-ink m-0 mb-5">
                  {cat.blurb}
                </p>

                {cat.constraints.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cat.constraints.map((c) => (
                      <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose text-ink">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {cat.characters.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cat.characters.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/60 text-ink"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

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
                    .map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between items-start gap-4 py-2.5 text-xs border-b border-ink/10"
                      >
                        <span className="text-ink-muted shrink-0">{k}</span>
                        <span className="text-ink font-medium text-right">{v}</span>
                      </div>
                    ))}
                  {(
                    [
                      ['Vacciné', cat.vaccinated],
                      ['Stérilisé/castré', cat.sterilized],
                      ['Identifié', cat.identified],
                      ['Déparasité', cat.dewormed],
                    ] as [string, boolean][]
                  ).map(([k, active], i, arr) => (
                    <div
                      key={k}
                      className={`flex justify-between items-center gap-4 py-2.5 text-xs ${i < arr.length - 1 ? 'border-b border-ink/10' : ''}`}
                    >
                      <span className="text-ink-muted shrink-0">{k}</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {active ? 'Oui' : 'Non'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2">
                  <AdoptModal cat={cat} />
                </div>

                {/* Adoption fee note */}
                <div className="mt-3.5 p-3 bg-white/60 rounded-lg text-xs text-ink-muted leading-[1.5]">
                  <strong className="text-ink">Frais d&apos;adoption : 150 €</strong> — couvrent stérilisation, vaccins, identification et tests sanitaires.
                </div>
              </div>
            </div>
          )}
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
