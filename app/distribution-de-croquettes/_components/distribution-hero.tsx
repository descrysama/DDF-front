import { Clock, MapPin } from 'lucide-react'

export function DistributionHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, var(--scf-peach) 0%, var(--scf-pink) 60%, var(--scf-bg) 100%)',
        }}
      />
      <div className="max-w-[1200px] mx-auto px-6 pt-[52px] pb-14 relative">
        <div className="text-sm text-coral font-semibold mb-3">
          Tous les vendredis
        </div>
        <h1 className="text-h1-md leading-[0.98] tracking-[-0.035em] font-semibold m-0 mb-[18px] text-ink max-w-[760px]">
          Distribution gratuite de croquettes
        </h1>
        <p className="text-lg leading-[1.55] text-ink-muted m-0 mb-[22px] max-w-[620px]">
          Chaque vendredi, les bénévoles de Sans Croquettes Fixes se réunissent pour
          distribuer gratuitement de la nourriture pour chiens et chats aux personnes
          en situation de précarité.
        </p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-surface rounded-lg px-3.5 py-2.5 border border-border">
            <Clock size={16} strokeWidth={1.8} className="text-coral" />
            <span className="text-sm font-semibold text-ink">17h30 – 19h</span>
          </div>
          <div className="flex items-center gap-2 bg-surface rounded-lg px-3.5 py-2.5 border border-border">
            <MapPin size={16} strokeWidth={1.8} className="text-coral" />
            <span className="text-sm font-semibold text-ink">Rue Desaix, Lyon 3e</span>
          </div>
        </div>
      </div>
    </section>
  )
}
