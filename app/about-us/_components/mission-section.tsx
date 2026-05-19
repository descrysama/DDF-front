import { Shield, Heart, Home as HomeIcon } from "lucide-react"

const PILLARS = [
  { h: 'Sauver',   p: "Identifier les chats en détresse — abandonnés, errants ou maltraités — et leur offrir un refuge immédiat.",  tintClass: 'bg-pink',  iconBg: '#FFC8C5', Icon: Shield   },
  { h: 'Soigner',  p: 'Prise en charge vétérinaire complète : vaccins, stérilisation, traitement et identification.',                tintClass: 'bg-peach', iconBg: '#F5C9A1', Icon: Heart    },
  { h: 'Replacer', p: "Sélection rigoureuse des familles d'accueil et adoptantes pour un placement à vie réussi.",                  tintClass: 'bg-mint',  iconBg: '#B4D8C5', Icon: HomeIcon },
]

export function MissionSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-14 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10">
        <div>
          <div className="text-sm text-coral font-semibold mb-2">
            Notre mission
          </div>
          <h2 className="text-h2 leading-[1.05] tracking-tight font-semibold m-0 mb-3.5 text-ink">
            Soigner, accompagner, replacer.
          </h2>
          <p className="text-sm leading-[1.6] text-ink-muted m-0 max-w-[380px]">
            Trois piliers qui guident chaque décision et chaque euro de l&apos;association.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PILLARS.map(({ h, p, tintClass, iconBg, Icon }) => (
            <div key={h} className={`${tintClass} rounded-[10px] p-[22px]`}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3.5"
                style={{ background: iconBg }}
              >
                <Icon size={19} strokeWidth={1.6} className="text-ink" />
              </div>
              <div className="text-lg font-semibold mb-1 tracking-[-0.01em] text-ink">{h}</div>
              <div className="text-xs text-ink-muted leading-[1.5]">{p}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
