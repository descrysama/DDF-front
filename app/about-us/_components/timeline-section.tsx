const TIMELINE = [
  { year: '2015', short: '15', title: 'Création',         desc: "Clara et 3 amies lancent l'association après le sauvetage de leur premier chat errant." },
  { year: '2018', short: '18', title: 'Premier local',    desc: "Ouverture d'un local mutualisé pour stocker la nourriture et accueillir les distributions." },
  { year: '2020', short: '20', title: 'Pendant le covid', desc: "Les distributions s'intensifient — 1 200 familles aidées en deux mois." },
  { year: '2023', short: '23', title: 'Réseau FA',        desc: "Mise en place d'un réseau de 30 familles d'accueil dans toute la métropole." },
  { year: '2026', short: '26', title: "Aujourd'hui",      desc: "350+ chats adoptés, 18 bénévoles actifs, et toujours 100% bénévole." },
]

export function TimelineSection() {
  return (
    <section className="bg-surface-alt py-14 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-7">
          <div className="text-sm text-coral font-semibold mb-2">
            Notre histoire
          </div>
          <h2 className="text-h2 leading-[1.05] tracking-tight font-semibold m-0 text-ink">
            Onze ans, étape par étape.
          </h2>
        </div>
        <div className="relative">
          <div
            className="absolute top-[18px] left-4 right-4 h-0.5 opacity-40"
            style={{ background: 'linear-gradient(90deg, var(--scf-coral) 0%, var(--scf-magenta) 100%)' }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
            {TIMELINE.map(({ year, short, title, desc }, i) => (
              <div key={year}>
                <div
                  className={`w-9 h-9 rounded-full border-2 border-coral flex items-center justify-center text-[11px] font-bold mb-3.5 relative z-10 ${i === TIMELINE.length - 1 ? 'bg-coral text-white' : 'bg-surface text-coral'}`}
                >
                  {short}
                </div>
                <div className="text-2xs text-coral font-semibold mb-0.5">{year}</div>
                <div className="text-sm font-semibold tracking-[-0.01em] mb-1.5 text-ink">{title}</div>
                <div className="text-xs text-ink-muted leading-[1.5]">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
