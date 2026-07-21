'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const AMOUNTS = [
  { value: 10,  label: '10€',  sub: null,              tintClass: 'bg-peach' },
  { value: 25,  label: '25€',  sub: 'Vaccin',          tintClass: 'bg-lilac' },
  { value: 50,  label: '50€',  sub: 'Stérilisation',   tintClass: 'bg-pink'  },
  { value: 100, label: '100€', sub: 'Prise en charge', tintClass: 'bg-mint'  },
]

const WHAT_IT_DOES = [
  { amt: '25 €',  desc: 'Un rappel vaccinal',          tintClass: 'bg-peach' },
  { amt: '50 €',  desc: 'Une stérilisation complète',  tintClass: 'bg-pink'  },
  { amt: '100 €', desc: 'Prise en charge vétérinaire', tintClass: 'bg-lilac' },
  { amt: '250 €', desc: 'Sauve un chat sur trois mois', tintClass: 'bg-mint' },
]

const inputClass = "h-auto px-3.5 py-3 rounded-lg border border-border bg-surface text-sm font-[inherit] text-ink outline-none w-full shadow-none"

export default function DonateForm() {
  const [monthly, setMonthly] = useState(false)
  const [selected, setSelected] = useState(50)
  const [custom, setCustom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')

  return (
    <>
      {/* Header éditorial */}
      <section className="max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <div className="text-xs text-ink-muted mb-3">
          <Link href="/" className="text-ink-muted no-underline">Accueil</Link>
          <span className="mx-2 text-coral">—</span>
          <span className="text-ink">Faire un don</span>
        </div>
        <h1 className="text-h1-sm leading-[0.98] tracking-[-0.035em] font-semibold m-0 mb-4 max-w-[860px] text-ink">
          Votre don finance les{' '}
          <span className="text-coral">soins</span>,
          {' '}l&apos;<span className="text-magenta">alimentation</span>{' '}
          et l&apos;adoption.
        </h1>
        <p className="text-md leading-[1.55] text-ink-muted m-0 max-w-[600px]">
          Sans Croquettes Fixes est reconnue d&apos;intérêt général.
          66&nbsp;% de votre don est déductible des impôts.
        </p>
      </section>

      {/* Grille form + sidebar */}
      <section className="max-w-[1200px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-7">

          {/* Formulaire */}
          <div className="bg-surface border border-border rounded-[10px] p-7">
            {/* Toggle ponctuel / mensuel */}
            <div className="flex gap-1 bg-surface-alt p-0.5 rounded-full mb-[22px] w-fit">
              {['Don ponctuel', 'Don mensuel'].map((label, i) => {
                const active = i === 0 ? !monthly : monthly
                return (
                  <Button
                    key={label}
                    type="button"
                    onClick={() => setMonthly(i === 1)}
                    className={`h-auto whitespace-normal px-4 py-[7px] rounded-full border-none cursor-pointer font-[inherit] text-xs font-semibold ${active ? 'bg-coral text-white' : 'bg-transparent text-ink-muted'}`}
                  >
                    {label}
                  </Button>
                )
              })}
            </div>

            {/* Montants */}
            <div className="text-sm font-semibold text-ink mb-2.5">
              Choisissez un montant
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {AMOUNTS.map(({ value, label, sub, tintClass }) => {
                const active = selected === value
                return (
                  <Button
                    key={value}
                    type="button"
                    onClick={() => { setSelected(value); setCustom('') }}
                    className={`block h-auto whitespace-normal px-3 py-3.5 rounded-lg cursor-pointer border-[1.5px] font-[inherit] text-left relative ${tintClass} ${active ? 'border-coral' : 'border-transparent'}`}
                  >
                    <div className={`text-[19px] font-semibold tracking-[-0.015em] ${active ? 'text-coral-ink' : 'text-ink'}`}>
                      {label}
                    </div>
                    {sub && <div className="text-[10px] mt-0.5 text-ink-muted">{sub}</div>}
                    {active && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-coral flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </Button>
                )
              })}
            </div>

            {/* Montant libre */}
            <div className="border border-border rounded-lg px-3.5 py-3 flex items-center gap-2.5 mb-5">
              <span className="text-sm text-ink-muted">Autre montant</span>
              <Input
                type="number"
                min="1"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(0) }}
                placeholder="0"
                aria-label="Montant personnalisé"
                className="h-auto border-none outline-none bg-transparent text-sm font-[inherit] text-ink flex-1 text-right shadow-none"
              />
              <span className="text-sm text-ink font-semibold">€</span>
            </div>

            {/* Nom / email */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className={inputClass} />
              <Input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className={inputClass} />
            </div>
            <div className="mb-[18px]">
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>

            {/* CTA */}
            <Link
              href="https://www.helloasso.com/associations/sans-croquettes-fixes/formulaires/1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full justify-center items-center gap-2 py-3.5 rounded-md bg-gradient-to-r from-coral to-magenta text-white no-underline text-sm font-semibold"
            >
              Continuer vers HelloAsso
              <ArrowRight size={14} />
            </Link>

            <div className="text-2xs text-ink-muted mt-2.5 text-center">
              Paiement sécurisé · Reçu fiscal automatique
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="text-sm text-coral font-semibold mb-2">
              Côté terrain
            </div>
            <h3 className="text-[22px] leading-[1.1] tracking-[-0.02em] font-semibold m-0 mb-4 text-ink">
              À quoi sert votre don&nbsp;?
            </h3>
            <div className="grid gap-1.5">
              {WHAT_IT_DOES.map(({ amt, desc, tintClass }) => (
                <div key={amt} className={`flex gap-3.5 px-4 py-3 ${tintClass} rounded-lg items-center`}>
                  <div className="w-14 text-[18px] font-semibold text-ink tracking-[-0.015em]">
                    {amt}
                  </div>
                  <div className="text-sm text-ink leading-[1.4] flex-1">{desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-[18px] bg-gradient-to-br from-coral to-magenta text-white rounded-[10px]">
              <div className="text-sm leading-[1.5]">
                <strong>Déduction fiscale.</strong> Pour 50€, vous payez réellement 17€ après déduction.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
