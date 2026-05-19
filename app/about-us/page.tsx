import Link from 'next/link'
import { Shield, Heart, Home as HomeIcon, ArrowRight } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { T } from '@/lib/design-tokens'

export const metadata = {
  title: 'À propos – Sans Croquettes Fixes',
  description: "Découvrez l'association Sans Croquettes Fixes : notre histoire, notre mission et notre équipe de bénévoles à Lyon.",
}

const TEAM = [
  { name: 'Clara',   role: 'Présidente, fondatrice', tone: ['#E0AC9C', '#A87968'] },
  { name: 'Léo',     role: 'Trésorier',              tone: ['#C6C8CB', '#7E8189'] },
  { name: 'Margaux', role: 'Coordination FA',         tone: ['#E8C9B3', '#C99879'] },
  { name: 'Yannis',  role: 'Distributions',           tone: ['#D9B898', '#A47A55'] },
  { name: 'Aïda',    role: 'Réseaux sociaux',         tone: ['#D9D3C5', '#9D9485'] },
  { name: 'Hugo',    role: 'Vétérinaire bénévole',    tone: ['#F1D7C4', '#D3A88C'] },
]

const TIMELINE = [
  { year: '2015', short: '15', title: 'Création',         desc: "Clara et 3 amies lancent l'association après le sauvetage de leur premier chat errant." },
  { year: '2018', short: '18', title: 'Premier local',    desc: "Ouverture d'un local mutualisé pour stocker la nourriture et accueillir les distributions." },
  { year: '2020', short: '20', title: 'Pendant le covid', desc: "Les distributions s'intensifient — 1 200 familles aidées en deux mois." },
  { year: '2023', short: '23', title: 'Réseau FA',        desc: "Mise en place d'un réseau de 30 familles d'accueil dans toute la métropole." },
  { year: '2026', short: '26', title: "Aujourd'hui",      desc: "350+ chats adoptés, 18 bénévoles actifs, et toujours 100% bénévole." },
]

const PARTNERS = [
  'Ville de Lyon', 'Métropole 69', 'Cabinet Vét. Charpennes', 'Croix-Rousse Vet',
  'Maxi Zoo Part-Dieu', 'Royal Canin', "30 Millions d'Amis", 'Fondation B. Bardot',
]

const PARTNER_TINTS = [T.peach, T.lilac, T.mint, T.pink]

const FUNDING = [
  { label: 'Dons particuliers', pct: '62%', width: 62 },
  { label: 'Subventions',       pct: '24%', width: 24 },
  { label: 'Évènements',        pct: '9%',  width: 9  },
  { label: 'Adoptions',         pct: '5%',  width: 5  },
]

export default function AboutUsPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <Header />
      <main>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(160deg, ${T.pink} 0%, ${T.peach} 60%, ${T.bg} 100%)`,
          }} />
          <div
            className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]"
            style={{
              maxWidth: 1200, margin: '0 auto',
              padding: '52px 24px 56px',
              position: 'relative', gap: 40, alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: T.coral, fontWeight: 600, marginBottom: 12 }}>
                Qui sommes-nous&nbsp;?
              </div>
              <h1 style={{
                fontSize: 'clamp(36px, 4.5vw, 54px)', lineHeight: 0.98,
                letterSpacing: '-0.035em', fontWeight: 600,
                margin: '0 0 18px', color: T.ink,
              }}>
                Une équipe bénévole, des chats sauvés, depuis{' '}
                <span style={{ color: T.coral }}>2015</span>.
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.55, color: T.inkMuted, margin: '0 0 22px', maxWidth: 540 }}>
                Sans Croquettes Fixes est née d&apos;une conviction simple&nbsp;: aucun chat ne devrait
                dormir dehors faute de moyens. Onze ans plus tard, nous restons une asso 100&nbsp;%
                bénévole, ancrée à Lyon.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  ['11 ans', "d'engagement"],
                  ['350+',   'chats sauvés'],
                  ['18',     'bénévoles actifs'],
                  ['52',     'distributions / an'],
                ].map(([n, l]) => (
                  <div key={l} style={{
                    background: T.surface, borderRadius: 8,
                    padding: '10px 14px', border: `1px solid ${T.border}`,
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', color: T.ink }}>{n}</div>
                    <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo placeholder — Pilgrim */}
            <div style={{ position: 'relative', aspectRatio: '5/4', borderRadius: 12, overflow: 'hidden', boxShadow: '0 18px 50px rgba(37,40,64,0.16)' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #3C3F4E 0%, #1F2235 100%)',
              }} />
              <div style={{
                position: 'absolute', bottom: 14, left: 14, right: 14,
                padding: '10px 14px', borderRadius: 8,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                fontSize: 12, color: T.ink, lineHeight: 1.5,
              }}>
                <strong>Pilgrim, 13 ans.</strong> Recueilli en 2024 après l&apos;hospitalisation de son humaine. Il vit désormais en famille d&apos;accueil.
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission ───────────────────────────────────────────── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 48px' }}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr]" style={{ gap: 40 }}>
            <div>
              <div style={{ fontSize: 13, color: T.coral, fontWeight: 600, marginBottom: 8 }}>
                Notre mission
              </div>
              <h2 style={{
                fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.05,
                letterSpacing: '-0.025em', fontWeight: 600,
                margin: '0 0 14px', color: T.ink,
              }}>
                Soigner, accompagner, replacer.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: T.inkMuted, margin: 0, maxWidth: 380 }}>
                Trois piliers qui guident chaque décision et chaque euro de l&apos;association.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 12 }}>
              {[
                { h: 'Sauver',   p: "Identifier les chats en détresse — abandonnés, errants ou maltraités — et leur offrir un refuge immédiat.",   tint: T.pink,  iconBg: '#FFC8C5', Icon: Shield   },
                { h: 'Soigner',  p: 'Prise en charge vétérinaire complète : vaccins, stérilisation, traitement et identification.',                 tint: T.peach, iconBg: '#F5C9A1', Icon: Heart    },
                { h: 'Replacer', p: "Sélection rigoureuse des familles d'accueil et adoptantes pour un placement à vie réussi.",                   tint: T.mint,  iconBg: '#B4D8C5', Icon: HomeIcon },
              ].map(({ h, p, tint, iconBg, Icon }) => (
                <div key={h} style={{ background: tint, borderRadius: 10, padding: 22 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                  }}>
                    <Icon size={19} strokeWidth={1.6} style={{ color: T.ink }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, letterSpacing: '-0.01em', color: T.ink }}>{h}</div>
                  <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.5 }}>{p}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ──────────────────────────────────────────── */}
        <section style={{ background: T.surfaceAlt, padding: '56px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: T.coral, fontWeight: 600, marginBottom: 8 }}>
                Notre histoire
              </div>
              <h2 style={{
                fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.05,
                letterSpacing: '-0.025em', fontWeight: 600, margin: 0, color: T.ink,
              }}>
                Onze ans, étape par étape.
              </h2>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 18, left: 16, right: 16, height: 2,
                background: `linear-gradient(90deg, ${T.coral} 0%, ${T.magenta} 100%)`,
                opacity: 0.4,
              }} />
              <div className="grid grid-cols-2 sm:grid-cols-5" style={{ gap: 16, position: 'relative' }}>
                {TIMELINE.map(({ year, short, title, desc }, i) => (
                  <div key={year}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: i === TIMELINE.length - 1 ? T.coral : T.surface,
                      border: `2px solid ${T.coral}`,
                      color: i === TIMELINE.length - 1 ? '#fff' : T.coral,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, marginBottom: 14,
                      position: 'relative', zIndex: 1,
                    }}>{short}</div>
                    <div style={{ fontSize: 11, color: T.coral, fontWeight: 600, marginBottom: 2 }}>{year}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 6, color: T.ink }}>{title}</div>
                    <div style={{ fontSize: 12, color: T.inkMuted, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Équipe ────────────────────────────────────────────── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: T.coral, fontWeight: 600, marginBottom: 8 }}>
                L&apos;équipe
              </div>
              <h2 style={{
                fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.05,
                letterSpacing: '-0.025em', fontWeight: 600, margin: 0, color: T.ink,
              }}>
                18 bénévoles, un seul cap.
              </h2>
            </div>
            <Link
              href="/about-us#benevoles"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 6,
                border: `1px solid ${T.borderStrong}`, background: T.surface,
                fontSize: 13, fontWeight: 600, color: T.ink, textDecoration: 'none',
              }}
            >
              Devenir bénévole <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6" style={{ gap: 12 }}>
            {TEAM.map(({ name, role, tone }) => (
              <div key={name}>
                <div style={{
                  aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden', marginBottom: 8,
                  background: `linear-gradient(135deg, ${tone[0]} 0%, ${tone[1]} 100%)`,
                }} />
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: T.ink }}>{name}</div>
                <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 1 }}>{role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Partenaires + Transparence ────────────────────────── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 56px' }}>
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]" style={{ gap: 20 }}>

            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: 24,
            }}>
              <div style={{ fontSize: 13, color: T.coral, fontWeight: 600, marginBottom: 8 }}>
                Nos partenaires
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em', margin: '0 0 18px', color: T.ink }}>
                Ils nous soutiennent au quotidien.
              </h3>
              <div className="grid grid-cols-4" style={{ gap: 10 }}>
                {PARTNERS.map((name, i) => (
                  <div key={name} style={{
                    background: PARTNER_TINTS[i % 4],
                    borderRadius: 8, padding: '14px 12px',
                    fontSize: 12, fontWeight: 600, color: T.ink,
                    textAlign: 'center', lineHeight: 1.3,
                  }}>{name}</div>
                ))}
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${T.coral} 0%, ${T.magenta} 100%)`,
              color: '#fff', borderRadius: 12, padding: 24,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ fontSize: 13, color: T.pink, fontWeight: 600, marginBottom: 8 }}>
                Transparence
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em', margin: '0 0 16px' }}>
                D&apos;où vient l&apos;argent&nbsp;?
              </h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {FUNDING.map(({ label, pct, width }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{pct}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${width}%`, height: '100%', background: '#fff' }} />
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="/about-us#rapport"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  marginTop: 16, fontSize: 12, fontWeight: 600, color: '#fff',
                  textDecoration: 'none', padding: '8px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.30)',
                }}
              >
                Rapport financier 2025 <ArrowRight size={11} />
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
