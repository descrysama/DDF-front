'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { T } from '@/lib/design-tokens'


const AMOUNTS = [
  { value: 10,  label: '10€',  sub: null,              tint: T.peach },
  { value: 25,  label: '25€',  sub: 'Vaccin',          tint: T.lilac },
  { value: 50,  label: '50€',  sub: 'Stérilisation',   tint: T.pink  },
  { value: 100, label: '100€', sub: 'Prise en charge', tint: T.mint  },
]

const WHAT_IT_DOES = [
  { amt: '25 €',  desc: 'Un rappel vaccinal',             tint: T.peach },
  { amt: '50 €',  desc: 'Une stérilisation complète',     tint: T.pink  },
  { amt: '100 €', desc: 'Prise en charge vétérinaire',    tint: T.lilac },
  { amt: '250 €', desc: 'Sauve un chat sur trois mois',   tint: T.mint  },
]

const inputStyle: React.CSSProperties = {
  padding: '12px 14px', borderRadius: 8,
  border: `1px solid ${T.border}`, background: T.surface,
  fontSize: 13, fontFamily: 'inherit', color: T.ink,
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function DonateForm() {
  const [monthly, setMonthly] = useState(false)
  const [selected, setSelected] = useState(50)
  const [custom, setCustom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')

  return (
    <>
      {/* ── Header éditorial ─────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 32px' }}>
        <div style={{ fontSize: 12, color: T.inkMuted, marginBottom: 12 }}>
          <Link href="/" style={{ color: T.inkMuted, textDecoration: 'none' }}>Accueil</Link>
          <span style={{ margin: '0 8px', color: T.coral }}>—</span>
          <span style={{ color: T.ink }}>Faire un don</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 0.98,
          letterSpacing: '-0.035em', fontWeight: 600,
          margin: '0 0 16px', maxWidth: 860,
        }}>
          Votre don finance les{' '}
          <span style={{ color: T.coral }}>soins</span>,
          {' '}l&apos;<span style={{ color: T.magenta }}>alimentation</span>{' '}
          et l&apos;adoption.
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: T.inkMuted, margin: 0, maxWidth: 600 }}>
          Sans Croquettes Fixes est reconnue d&apos;intérêt général.
          66&nbsp;% de votre don est déductible des impôts.
        </p>
      </section>

      {/* ── Grille form + sidebar ────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 64px' }}>
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]" style={{ gap: 28 }}>

          {/* Formulaire */}
          <div style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: 28,
          }}>
            {/* Toggle ponctuel / mensuel */}
            <div style={{
              display: 'flex', gap: 4, background: T.surfaceAlt,
              padding: 3, borderRadius: 999, marginBottom: 22, width: 'fit-content',
            }}>
              {['Don ponctuel', 'Don mensuel'].map((label, i) => {
                const active = i === 0 ? !monthly : monthly
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setMonthly(i === 1)}
                    style={{
                      padding: '7px 16px', borderRadius: 999, border: 'none',
                      cursor: 'pointer', fontFamily: 'inherit',
                      background: active ? T.coral : 'transparent',
                      color: active ? '#fff' : T.inkMuted,
                      fontSize: 12, fontWeight: 600,
                    }}
                  >{label}</button>
                )
              })}
            </div>

            {/* Montants */}
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 10 }}>
              Choisissez un montant
            </div>
            <div className="grid grid-cols-4" style={{ gap: 8, marginBottom: 8 }}>
              {AMOUNTS.map(({ value, label, sub, tint }) => {
                const active = selected === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setSelected(value); setCustom('') }}
                    style={{
                      padding: '14px 12px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${active ? T.coral : 'transparent'}`,
                      background: tint, fontFamily: 'inherit', textAlign: 'left',
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      fontSize: 19, fontWeight: 600, letterSpacing: '-0.015em',
                      color: active ? T.coralInk : T.ink,
                    }}>{label}</div>
                    {sub && <div style={{ fontSize: 10, marginTop: 2, color: T.inkMuted }}>{sub}</div>}
                    {active && (
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 16, height: 16, borderRadius: '50%',
                        background: T.coral,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Montant libre */}
            <div style={{
              border: `1px solid ${T.border}`, borderRadius: 8,
              padding: '12px 14px', display: 'flex', alignItems: 'center',
              gap: 10, marginBottom: 20,
            }}>
              <span style={{ fontSize: 13, color: T.inkMuted }}>Autre montant</span>
              <input
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(0) }}
                placeholder="0"
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: 14, fontFamily: 'inherit', color: T.ink,
                  flex: 1, textAlign: 'right',
                }}
              />
              <span style={{ fontSize: 14, color: T.ink, fontWeight: 600 }}>€</span>
            </div>

            {/* Nom / email */}
            <div className="grid grid-cols-2" style={{ gap: 8, marginBottom: 8 }}>
              <input placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={inputStyle} />
              <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </div>

            {/* CTA */}
            <Link
              href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', width: '100%', justifyContent: 'center',
                alignItems: 'center', gap: 8,
                padding: '14px', borderRadius: 6,
                background: `linear-gradient(90deg, ${T.coral} 0%, ${T.magenta} 100%)`,
                color: '#fff', textDecoration: 'none',
                fontSize: 14, fontWeight: 600,
                boxSizing: 'border-box',
              }}
            >
              Continuer vers HelloAsso
              <ArrowRight size={14} />
            </Link>

            <div style={{ fontSize: 11, color: T.inkMuted, marginTop: 10, textAlign: 'center' }}>
              Paiement sécurisé · Reçu fiscal automatique
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ fontSize: 13, color: T.coral, fontWeight: 600, marginBottom: 8 }}>
              Côté terrain
            </div>
            <h3 style={{
              fontSize: 22, lineHeight: 1.1, letterSpacing: '-0.02em',
              fontWeight: 600, margin: '0 0 16px', color: T.ink,
            }}>
              À quoi sert votre don&nbsp;?
            </h3>
            <div style={{ display: 'grid', gap: 6 }}>
              {WHAT_IT_DOES.map(({ amt, desc, tint }) => (
                <div key={amt} style={{
                  display: 'flex', gap: 14, padding: '12px 16px',
                  background: tint, borderRadius: 8, alignItems: 'center',
                }}>
                  <div style={{ width: 56, fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: '-0.015em' }}>
                    {amt}
                  </div>
                  <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.4, flex: 1 }}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 16, padding: 18,
              background: `linear-gradient(135deg, ${T.coral} 0%, ${T.magenta} 100%)`,
              color: '#fff', borderRadius: 10,
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                <strong>Déduction fiscale.</strong> Pour 50€, vous payez réellement 17€ après déduction.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
