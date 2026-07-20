import { Clock, MapPin, AlertTriangle } from 'lucide-react'

const MAPS_EMBED_SRC = 'https://www.google.com/maps?q=Rue+Desaix,+69003+Lyon&output=embed'

const INFO_CARDS = [
  {
    tintClass: 'bg-pink',
    iconBg: '#FFC8C5',
    Icon: Clock,
    title: 'Tous les vendredis',
    desc: 'Nos bénévoles sont présents de 17h30 à 19h.',
  },
  {
    tintClass: 'bg-peach',
    iconBg: '#F5C9A1',
    Icon: MapPin,
    title: 'Rue Desaix, Lyon 3e',
    desc: "Au niveau de l'emplacement Vélov', à côté du Shawerman.",
  },
]

export function PracticalInfoSection() {
  return (
    <section className="bg-surface-alt py-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-9">
          <div className="text-sm text-coral font-semibold mb-2">
            Informations pratiques
          </div>
          <h2 className="text-h2 leading-[1.05] tracking-tight font-semibold m-0 text-ink">
            Aller à la distribution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5">
          <div className="flex flex-col gap-3.5">
            {INFO_CARDS.map(({ tintClass, iconBg, Icon, title, desc }) => (
              <div key={title} className={`${tintClass} rounded-[10px] p-[22px]`}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-3.5"
                  style={{ background: iconBg }}
                >
                  <Icon size={19} strokeWidth={1.6} className="text-ink" />
                </div>
                <div className="text-lg font-semibold mb-1 tracking-[-0.01em] text-ink">
                  {title}
                </div>
                <p className="text-xs text-ink-muted leading-[1.5] m-0">
                  {desc}
                </p>
              </div>
            ))}

            <div className="bg-surface border border-border-strong rounded-[10px] p-[18px] flex gap-3 items-start">
              <AlertTriangle size={18} strokeWidth={1.8} className="text-coral-ink shrink-0 mt-0.5" />
              <p className="text-xs text-ink-muted leading-[1.5] m-0">
                Attention, la distribution a récemment changé d&apos;adresse.
              </p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-photo border border-border min-h-[320px]">
            <iframe
              title="Localisation de la distribution de croquettes — Rue Desaix, Lyon 3e"
              src={MAPS_EMBED_SRC}
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
