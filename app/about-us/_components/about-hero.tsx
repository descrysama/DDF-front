export function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, var(--scf-pink) 0%, var(--scf-peach) 60%, var(--scf-bg) 100%)',
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] max-w-[1200px] mx-auto px-6 pt-[52px] pb-14 relative gap-10 items-center">
        <div>
          <div className="text-sm text-coral font-semibold mb-3">
            Qui sommes-nous&nbsp;?
          </div>
          <h1 className="text-h1-md leading-[0.98] tracking-[-0.035em] font-semibold m-0 mb-[18px] text-ink">
            Une équipe bénévole, des chats sauvés, depuis{' '}
            <span className="text-coral">2015</span>.
          </h1>
          <p className="text-lg leading-[1.55] text-ink-muted m-0 mb-[22px] max-w-[540px]">
            Sans Croquettes Fixes est née d&apos;une conviction simple&nbsp;: aucun chat ne devrait
            dormir dehors faute de moyens. Onze ans plus tard, nous restons une asso 100&nbsp;%
            bénévole, ancrée à Lyon.
          </p>
          <div className="flex gap-3 flex-wrap">
            {[
              ['11 ans', "d'engagement"],
              ['350+',   'chats sauvés'],
              ['18',     'bénévoles actifs'],
              ['52',     'distributions / an'],
            ].map(([n, l]) => (
              <div key={l} className="bg-surface rounded-lg px-3.5 py-2.5 border border-border">
                <div className="text-[18px] font-semibold tracking-[-0.015em] text-ink">{n}</div>
                <div className="text-2xs text-ink-muted mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[5/4] rounded-xl overflow-hidden shadow-photo">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #3C3F4E 0%, #1F2235 100%)' }}
          />
          <div
            className="absolute bottom-3.5 left-3.5 right-3.5 px-3.5 py-2.5 rounded-lg text-xs text-ink leading-[1.5]"
            style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
          >
            <strong>Pilgrim, 13 ans.</strong> Recueilli en 2024 après l&apos;hospitalisation de son humaine. Il vit désormais en famille d&apos;accueil.
          </div>
        </div>
      </div>
    </section>
  )
}
