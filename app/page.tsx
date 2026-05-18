import Link from "next/link"
import { Shield, Home as HomeIcon, Heart, Smile, PawPrint, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CatCard } from "@/components/cat-card"
import { PLACEHOLDER_CATS } from "@/lib/placeholder-cats"
import { T } from "@/lib/design-tokens"

// ─── HERO ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const featuredCat = PLACEHOLDER_CATS[0]

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: T.bg }}>
      {/* Right-side coral wash panel */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: '42%',
          background: `linear-gradient(135deg, ${T.pink} 0%, ${T.rose} 100%)`,
        }}
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{
          maxWidth: 1200, margin: '0 auto', padding: '52px 24px 64px',
          position: 'relative', gap: 48, alignItems: 'center',
        }}
      >
        {/* Left — copy */}
        <div>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 12px', borderRadius: 999,
            background: T.surface, border: `1px solid ${T.coral}40`,
            fontSize: 12, fontWeight: 500, color: T.coralInk,
            marginBottom: 22,
          }}>
            <span
              className="animate-scf-pulse"
              style={{ width: 6, height: 6, borderRadius: '50%', background: T.coral, display: 'inline-block' }}
            />
            {PLACEHOLDER_CATS.length} chats actuellement à l&apos;adoption
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 5vw, 60px)',
            lineHeight: 0.96,
            letterSpacing: '-0.035em',
            fontWeight: 600,
            margin: '0 0 18px',
            color: T.ink,
          }}>
            Un toit, des câlins,{' '}<br />
            <span style={{
              background: `linear-gradient(90deg, ${T.coral} 0%, ${T.magenta} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              une seconde chance.
            </span>
          </h1>

          <p style={{
            fontSize: 16, lineHeight: 1.55, color: T.inkMuted,
            margin: '0 0 26px', maxWidth: 480,
          }}>
            Sans Croquettes Fixes accompagne les chats les plus fragiles de la région lyonnaise
            vers une famille pour la vie.
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link
              href="/adopt-pet"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 18px', borderRadius: 6,
                background: T.coral, color: '#fff',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Adopter un chat
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about-us"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 18px', borderRadius: 6,
                background: T.ink, color: '#fff',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Découvrir l&apos;asso
            </Link>
          </div>
        </div>

        {/* Right — featured cat photo */}
        <div style={{ position: 'relative', aspectRatio: '5/4', borderRadius: 10, overflow: 'hidden', boxShadow: '0 18px 50px rgba(37,40,64,0.18)' }}>
          {/* Gradient placeholder */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${featuredCat.tones[0]} 0%, ${featuredCat.tones[1]} 100%)`,
          }} />
          {/* Stripe overlay */}
          <svg
            width="100%" height="100%"
            style={{ position: 'absolute', inset: 0, opacity: 0.12, mixBlendMode: 'overlay' }}
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="hero-stripe" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                <line x1="0" y1="0" x2="0" y2="14" stroke="#ffffff" strokeWidth="6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-stripe)" />
          </svg>

          {/* Top tag */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            padding: '4px 10px', borderRadius: 4,
            background: T.coral, color: '#fff',
            fontSize: 11, fontWeight: 600,
          }}>
            Nouvelle arrivée
          </div>

          {/* Bottom overlay — cat info */}
          <div style={{
            position: 'absolute', left: 14, bottom: 14, right: 14,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            color: '#fff',
          }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1 }}>{featuredCat.name}</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                {featuredCat.age} · {featuredCat.sex}
              </div>
            </div>
            <Link
              href={`/adopt-pet/${featuredCat.id}`}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', textDecoration: 'none',
              }}
            >
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── STATS STRIP ──────────────────────────────────────────────────────────────

function StatsStrip() {
  const stats = [
    { value: '11',   label: 'ans d\'activité' },
    { value: '350+', label: 'chats adoptés'   },
    { value: '100%', label: 'bénévole'         },
    { value: '52',   label: 'distributions / an' },
  ]

  return (
    <section style={{ background: T.coral, color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div
        className="flex flex-wrap"
        style={{
          maxWidth: 1200, margin: '0 auto', padding: '22px 24px',
          justifyContent: 'space-between', alignItems: 'center', gap: 20,
        }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ flex: 1, gap: 0 }}
        >
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 10,
                paddingLeft: i > 0 ? 20 : 0,
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.25)' : 'none',
                paddingTop: 4, paddingBottom: 4,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em' }}>{value}</span>
              <span style={{ fontSize: 12, opacity: 0.85 }}>{label}</span>
            </div>
          ))}
        </div>
        <Link
          href="/about-us"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 6,
            background: '#fff', color: T.coral,
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          Notre rapport 2025 <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  )
}

// ─── CATS PREVIEW ─────────────────────────────────────────────────────────────

function CatsPreview() {
  const featured = PLACEHOLDER_CATS.slice(0, 4)

  return (
    <section style={{ background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 56px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 13, color: T.coral, fontWeight: 600, marginBottom: 8 }}>
              Nos chats disponibles
            </div>
            <h2 style={{
              fontSize: 'clamp(24px, 3.5vw, 34px)',
              lineHeight: 1.05, letterSpacing: '-0.025em',
              fontWeight: 600, margin: 0, maxWidth: 520,
            }}>
              Trouvez votre nouveau compagnon pour la vie.
            </h2>
          </div>
          <Link
            href="/adopt-pet"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 6,
              border: `1px solid ${T.borderStrong}`,
              background: T.surface,
              fontSize: 13, fontWeight: 600, color: T.ink, textDecoration: 'none',
            }}
          >
            Voir les {PLACEHOLDER_CATS.length} chats <ArrowRight size={12} />
          </Link>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: 14 }}
        >
          {featured.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT / MISSION ──────────────────────────────────────────────────────────

const ACTIONS = [
  {
    icon: Shield,
    label: 'Prise en charge',
    desc: 'Chats malades, âgés ou abandonnés — on trouve une solution.',
    tint: T.pink,
    iconBg: '#FFC8C5',
  },
  {
    icon: HomeIcon,
    label: 'Distribution',
    desc: 'Tous les vendredis à Lyon, alimentation aux familles fragiles.',
    tint: T.lilac,
    iconBg: '#CBC5E3',
  },
  {
    icon: Heart,
    label: 'Stérilisation',
    desc: 'Vaccins, stérilisation, soins — casser le cycle des abandons.',
    tint: T.peach,
    iconBg: '#F5C9A1',
  },
  {
    icon: Smile,
    label: 'Accompagnement',
    desc: 'Soutien des particuliers en difficulté pour garder leurs chats.',
    tint: T.mint,
    iconBg: '#B4D8C5',
  },
  {
    icon: PawPrint,
    label: 'Sensibilisation',
    desc: 'Auprès du public et des familles, informer change tout.',
    tint: T.rose,
    iconBg: '#F5B7CC',
  },
]

function AboutSection() {
  return (
    <section style={{ background: T.surfaceAlt, padding: '64px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 13, color: T.coral, fontWeight: 600, marginBottom: 8 }}>
            Qui sommes-nous ?
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            lineHeight: 1.05, letterSpacing: '-0.025em',
            fontWeight: 600, margin: '0 0 12px', color: T.ink,
          }}>
            À propos de Sans Croquettes Fixes
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: T.inkMuted, margin: '0 auto', maxWidth: 560 }}>
            Une équipe entièrement bénévole, basée à Lyon depuis 2015. Voici un aperçu de nos actions sur le terrain.
          </p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-5"
          style={{ gap: 12 }}
        >
          {ACTIONS.map(({ icon: Icon, label, desc, tint, iconBg }) => (
            <div
              key={label}
              style={{ background: tint, borderRadius: 10, padding: 18 }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                <Icon size={18} strokeWidth={1.6} style={{ color: T.ink }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, letterSpacing: '-0.01em', color: T.ink }}>
                {label}
              </div>
              <p style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.45, margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA PANEL ────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section style={{ padding: '64px 24px', background: T.bg }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        background: `linear-gradient(135deg, ${T.coral} 0%, ${T.magenta} 100%)`,
        color: '#fff',
        borderRadius: 12, padding: '44px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 48, alignItems: 'center' }}
        >
          {/* Copy */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 12, color: T.pink, fontWeight: 600, marginBottom: 8 }}>
              Comment vous remercier ?
            </div>
            <h2 style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              lineHeight: 1.05, letterSpacing: '-0.02em',
              fontWeight: 600, margin: '0 0 12px', color: '#fff',
            }}>
              Grâce à votre aide, des milliers d&apos;animaux ont une seconde chance.
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.88)', margin: 0, maxWidth: 460 }}>
              Frais vétérinaires, matériel, transports — votre don sert directement nos pensionnaires.
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', zIndex: 1 }}>
            <Link
              href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderRadius: 6,
                background: '#fff', color: T.ink,
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}
            >
              <span>Faire un don</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about-us#benevoles"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderRadius: 6,
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.30)',
                fontSize: 14, fontWeight: 500, textDecoration: 'none',
              }}
            >
              <span>Devenir famille d&apos;accueil</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Header />
      <main>
        <HeroSection />
        <StatsStrip />
        <CatsPreview />
        <AboutSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}