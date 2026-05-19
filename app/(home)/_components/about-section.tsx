import { Shield, Home as HomeIcon, Heart, Smile, PawPrint } from "lucide-react"

const ACTIONS = [
  {
    icon: Shield,
    label: 'Prise en charge',
    desc: 'Chats malades, âgés ou abandonnés — on trouve une solution.',
    tintClass: 'bg-pink',
    iconBg: '#FFC8C5',
  },
  {
    icon: HomeIcon,
    label: 'Distribution',
    desc: 'Tous les vendredis à Lyon, alimentation aux familles fragiles.',
    tintClass: 'bg-lilac',
    iconBg: '#CBC5E3',
  },
  {
    icon: Heart,
    label: 'Stérilisation',
    desc: 'Vaccins, stérilisation, soins — casser le cycle des abandons.',
    tintClass: 'bg-peach',
    iconBg: '#F5C9A1',
  },
  {
    icon: Smile,
    label: 'Accompagnement',
    desc: 'Soutien des particuliers en difficulté pour garder leurs chats.',
    tintClass: 'bg-mint',
    iconBg: '#B4D8C5',
  },
  {
    icon: PawPrint,
    label: 'Sensibilisation',
    desc: 'Auprès du public et des familles, informer change tout.',
    tintClass: 'bg-rose',
    iconBg: '#F5B7CC',
  },
]

export function AboutSection() {
  return (
    <section className="bg-surface-alt py-16 px-6 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative">
        <div className="text-center mb-9">
          <div className="text-sm text-coral font-semibold mb-2">
            Qui sommes-nous ?
          </div>
          <h2 className="text-h2 leading-[1.05] tracking-tight font-semibold m-0 mb-3 text-ink">
            À propos de Sans Croquettes Fixes
          </h2>
          <p className="text-base leading-[1.6] text-ink-muted m-0 mx-auto max-w-[560px]">
            Une équipe entièrement bénévole, basée à Lyon depuis 2015. Voici un aperçu de nos actions sur le terrain.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {ACTIONS.map(({ icon: Icon, label, desc, tintClass, iconBg }) => (
            <div key={label} className={`${tintClass} rounded-[10px] p-[18px]`}>
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center mb-3.5"
                style={{ background: iconBg }}
              >
                <Icon size={18} strokeWidth={1.6} className="text-ink" />
              </div>
              <div className="text-sm font-semibold mb-1 tracking-[-0.01em] text-ink">
                {label}
              </div>
              <p className="text-xs text-ink-muted leading-[1.45] m-0">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
