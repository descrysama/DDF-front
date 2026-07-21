import { Mail } from 'lucide-react'

const DISTRIBUTION_EMAIL = 'distribution@sanscroquettesfixes.fr'

export function EligibilitySection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5">
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="text-sm text-coral font-semibold mb-2">
            À qui s&apos;adresse la distribution&nbsp;?
          </div>
          <h3 className="text-xl font-semibold tracking-[-0.015em] m-0 mb-3.5 text-ink">
            À toutes les personnes en situation de précarité.
          </h3>
          <div className="flex flex-col gap-3">
            <p className="text-sm leading-[1.6] text-ink-muted m-0">
              Contrairement à certaines idées reçues, elle ne s&apos;adresse pas uniquement aux
              personnes sans domicile. Avant un premier passage, merci de prendre contact avec
              nous par mail.
            </p>
            <p className="text-sm leading-[1.6] text-ink-muted m-0">
              Lors de votre premier passage, nos bénévoles feront le point sur vos animaux afin
              de définir vos besoins en termes de nourriture.
            </p>
            <p className="text-sm leading-[1.6] text-ink-muted m-0">
              À noter que, pour l&apos;heure, la distribution fournit uniquement des aliments pour
              chats et pour chiens. Il n&apos;est pas possible de choisir la marque de croquettes
              donnée.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-coral to-magenta text-white rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-sm text-pink font-semibold mb-2">
              Premier passage
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.015em] m-0 mb-3">
              Prenez contact avant de venir.
            </h3>
            <p className="text-sm leading-[1.55] m-0 mb-5 text-white/90">
              Écrivez-nous à l&apos;adresse ci-dessous, nous reviendrons vers vous rapidement.
            </p>
          </div>
          <a
            href={`mailto:${DISTRIBUTION_EMAIL}`}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-coral bg-white no-underline px-4 py-3 rounded-md"
          >
            <Mail size={16} strokeWidth={2} />
            {DISTRIBUTION_EMAIL}
          </a>
        </div>
      </div>
    </section>
  )
}
