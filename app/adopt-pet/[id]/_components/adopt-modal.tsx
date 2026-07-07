"use client"

import { useRef, useState } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Heart, X, ArrowRight, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import type { CardAnimal } from "@/lib/strapi"
import { submitAdoptionRequest, type AdoptionFormData } from "@/lib/actions/adoption"

// ── Primitives ───────────────────────────────────────────────────────────────

const REQUIRED_COMMITMENTS = [0, 1, 3]

const inputBase = "w-full box-border px-3 py-2.5 rounded-lg border text-xs font-[inherit] text-ink outline-none bg-white transition-colors"
const inputOk   = "border-border focus:border-ink/40"
const inputErr  = "border-red-400 bg-red-50 focus:border-red-500"

function FField({
  id,
  label,
  optional,
  full,
  hint,
  errorMsg,
  children,
}: {
  id?: string
  label: string
  optional?: boolean
  full?: boolean
  hint?: string
  errorMsg?: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className={full ? "col-span-2" : ""}>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs font-semibold text-ink">{label}</span>
        {optional && <span className="text-[11px] text-ink-subtle">facultatif</span>}
      </div>
      {children}
      {hint && !errorMsg && (
        <div className="text-[11px] text-ink-muted mt-1 leading-[1.4]">{hint}</div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
          <AlertCircle size={11} className="shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  )
}

function ChipGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-[7px] rounded-full text-xs font-semibold cursor-pointer font-[inherit] border transition-colors ${
              active ? "border-coral bg-coral-soft text-coral-ink" : "border-border bg-white text-ink-muted"
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function FSectionHeader({ num, title, subtitle, tintClass }: { num: number; title: string; subtitle?: string; tintClass: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className={`w-[26px] h-[26px] rounded-full ${tintClass} text-ink inline-flex items-center justify-center text-xs font-bold shrink-0`}>
        {num}
      </span>
      <div>
        <div className="text-[14.5px] font-semibold tracking-[-0.01em] text-ink">{title}</div>
        {subtitle && <div className="text-xs text-ink-muted mt-0.5">{subtitle}</div>}
      </div>
    </div>
  )
}

const COMMITMENTS: { text: string; required: boolean }[] = [
  { text: "Je m'engage à offrir un foyer pour la vie.",                                                                    required: true  },
  { text: "Je comprends que les frais d'adoption (150 €) couvrent stérilisation, vaccins et identification.",              required: true  },
  { text: "J'accepte une visite de notre famille d'accueil avant la décision finale.",                                     required: false },
  { text: "Je consens à ce que mes données soient utilisées dans le cadre de cette demande d'adoption.",                   required: true  },
]

// ── Form ─────────────────────────────────────────────────────────────────────

type Errors = Partial<Record<string, string>>

function AdoptionFormInner({ cat, onClose }: { cat: CardAnimal; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [serverError, setServerError] = useState("")
  const [errors, setErrors]       = useState<Errors>({})

  // Section 1
  const [prenom,     setPrenom]     = useState("")
  const [nom,        setNom]        = useState("")
  const [email,      setEmail]      = useState("")
  const [telephone,  setTelephone]  = useState("")
  const [codePostal, setCodePostal] = useState("")
  const [ville,      setVille]      = useState("")
  const [age,        setAge]        = useState("")
  const [profession, setProfession] = useState("")

  // Section 2
  const [typeLogement,    setTypeLogement]    = useState("Appartement")
  const [surface,         setSurface]         = useState("")
  const [accesExterieur,  setAccesExterieur]  = useState("Aucun")
  const [compositionFoyer,setCompositionFoyer]= useState("Seul·e")
  const [autresAnimaux,   setAutresAnimaux]   = useState("Aucun")
  const [statutLogement,  setStatutLogement]  = useState("locataire")
  const [personnesFoyer,  setPersonnesFoyer]  = useState("")

  // Section 3
  const [experienceChat,  setExperienceChat]  = useState("Oui, plusieurs fois")
  const [pourquoiCeChat,  setPourquoiCeChat]  = useState("")
  const [veterinaire,     setVeterinaire]     = useState("")
  const [disponibilite,   setDisponibilite]   = useState("Cette semaine")

  // Section 4
  const [checked, setChecked] = useState([false, false, false, false])
  const toggleCheck = (i: number) => {
    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))
    if (errors["engagements"]) setErrors((e) => ({ ...e, engagements: undefined }))
  }

  function clearError(key: string) {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const allRequiredChecked = REQUIRED_COMMITMENTS.every((i) => checked[i])

    const newErrors: Errors = {}
    if (!prenom.trim())        newErrors["prenom"]        = "Champ requis"
    if (!nom.trim())           newErrors["nom"]           = "Champ requis"
    if (!email.trim())         newErrors["email"]         = "Champ requis"
    else if (!email.includes("@")) newErrors["email"]     = "Adresse email invalide"
    if (!telephone.trim())     newErrors["telephone"]     = "Champ requis"
    if (!pourquoiCeChat.trim()) newErrors["pourquoiCeChat"] = "Décrivez en quelques mots votre motivation"
    if (!allRequiredChecked)   newErrors["engagements"]   = "Vous devez cocher les engagements requis (*) pour continuer."

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      requestAnimationFrame(() => {
        const container = scrollRef.current
        if (!container) return
        const firstError = container.querySelector("[data-error='true']") as HTMLElement | null
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" })
      })
      return
    }

    setLoading(true)
    setServerError("")

    const data: AdoptionFormData = {
      catId: cat.id, catName: cat.name,
      prenom, nom, email, telephone, codePostal, ville, age, profession,
      typeLogement, surface, accesExterieur, compositionFoyer,
      autresAnimaux, statutLogement, personnesFoyer,
      experienceChat, pourquoiCeChat, veterinaire, disponibilite,
      engagements: checked,
    }

    const result = await submitAdoptionRequest(data)
    setLoading(false)

    if (result.success) {
      setSubmitted(true)
    } else {
      setServerError("Une erreur est survenue. Veuillez réessayer.")
      console.error(result.error)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center px-8 py-14">
        <CheckCircle2 size={52} className="text-coral mb-5" />
        <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink m-0 mb-3">
          Demande envoyée !
        </h2>
        <p className="text-sm leading-[1.6] text-ink-muted m-0 mb-7 max-w-[380px]">
          Merci pour votre intérêt pour {cat.name}. Notre équipe bénévole reviendra vers vous sous
          48h pour un premier échange.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-coral text-white text-sm font-semibold border-none cursor-pointer font-[inherit]"
        >
          Fermer <X size={14} />
        </button>
      </div>
    )
  }

  const inp = (hasErr: boolean) => `${inputBase} ${hasErr ? inputErr : inputOk}`

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 overflow-hidden min-h-0">
      {/* Scrollable body — seul scroll de la modal */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">

        {/* Section 1 — Vous */}
        <div className="px-7 py-[22px] border-b border-border">
          <FSectionHeader num={1} title="Faisons connaissance" subtitle="Vos coordonnées pour qu'on puisse vous recontacter." tintClass="bg-pink" />
          <div className="grid grid-cols-2 gap-3">
            <FField id="field-prenom" label="Prénom" errorMsg={errors["prenom"]}>
              <input
                data-error={errors["prenom"] ? "true" : undefined}
                placeholder="Élodie" value={prenom}
                onChange={(e) => { setPrenom(e.target.value); clearError("prenom") }}
                className={inp(!!errors["prenom"])}
              />
            </FField>
            <FField id="field-nom" label="Nom" errorMsg={errors["nom"]}>
              <input
                data-error={errors["nom"] ? "true" : undefined}
                placeholder="Mercier" value={nom}
                onChange={(e) => { setNom(e.target.value); clearError("nom") }}
                className={inp(!!errors["nom"])}
              />
            </FField>
            <FField id="field-email" label="Adresse email" errorMsg={errors["email"]}>
              <input
                data-error={errors["email"] ? "true" : undefined}
                type="email" placeholder="vous@exemple.fr" value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email") }}
                className={inp(!!errors["email"])}
              />
            </FField>
            <FField id="field-telephone" label="Téléphone" errorMsg={errors["telephone"]}>
              <input
                data-error={errors["telephone"] ? "true" : undefined}
                placeholder="06 12 34 56 78" value={telephone}
                onChange={(e) => { setTelephone(e.target.value); clearError("telephone") }}
                className={inp(!!errors["telephone"])}
              />
            </FField>
            <FField label="Code postal">
              <input placeholder="69007" value={codePostal} onChange={(e) => setCodePostal(e.target.value)} className={inp(false)} />
            </FField>
            <FField label="Ville">
              <input placeholder="Lyon 7e" value={ville} onChange={(e) => setVille(e.target.value)} className={inp(false)} />
            </FField>
            <FField label="Âge" optional>
              <input placeholder="34 ans" value={age} onChange={(e) => setAge(e.target.value)} className={inp(false)} />
            </FField>
            <FField label="Profession" optional>
              <input placeholder="Designer · télétravail 80%" value={profession} onChange={(e) => setProfession(e.target.value)} className={inp(false)} />
            </FField>
          </div>
        </div>

        {/* Section 2 — Foyer */}
        <div className="px-7 py-[22px] border-b border-border">
          <FSectionHeader num={2} title="Votre foyer" subtitle={`Pour s'assurer que l'environnement convient à ${cat.name}.`} tintClass="bg-peach" />
          <div className="grid grid-cols-2 gap-4">
            <FField label="Type de logement" full>
              <ChipGroup options={["Appartement", "Maison", "Studio", "Colocation"]} value={typeLogement} onChange={setTypeLogement} />
            </FField>
            <FField label="Surface">
              <input placeholder="60 m²" value={surface} onChange={(e) => setSurface(e.target.value)} className={inp(false)} />
            </FField>
            <FField label="Accès extérieur">
              <ChipGroup options={["Aucun", "Balcon sécurisé", "Jardin clos", "Jardin libre"]} value={accesExterieur} onChange={setAccesExterieur} />
            </FField>
            <FField label="Composition du foyer" full>
              <ChipGroup options={["Seul·e", "En couple", "Avec enfant(s)", "Colocation"]} value={compositionFoyer} onChange={setCompositionFoyer} />
            </FField>
            <FField label="Avez-vous d'autres animaux ?" full>
              <ChipGroup options={["Aucun", "Un chat", "Plusieurs chats", "Chien", "Autres"]} value={autresAnimaux} onChange={setAutresAnimaux} />
            </FField>
            <FField label="Statut du logement">
              <select value={statutLogement} onChange={(e) => setStatutLogement(e.target.value)} className={inp(false) + " appearance-none"}>
                <option value="proprietaire">Propriétaire</option>
                <option value="locataire">Locataire (animaux autorisés)</option>
                <option value="autre">Autre</option>
              </select>
            </FField>
            <FField label="Personnes au foyer">
              <input placeholder="1 adulte" value={personnesFoyer} onChange={(e) => setPersonnesFoyer(e.target.value)} className={inp(false)} />
            </FField>
          </div>
        </div>

        {/* Section 3 — Le chat */}
        <div className="px-7 py-[22px] border-b border-border">
          <FSectionHeader num={3} title={`Pourquoi ${cat.name} ?`} subtitle="Ce qui compte le plus pour nous." tintClass="bg-lilac" />
          <div className="grid gap-4">
            <FField label="Avez-vous déjà eu un chat ?">
              <ChipGroup options={["Oui, plusieurs fois", "Oui, une fois", "Jamais"]} value={experienceChat} onChange={setExperienceChat} />
            </FField>
            <FField
              id="field-pourquoiCeChat"
              label={`Pourquoi avoir choisi ${cat.name} ?`}
              hint="Quelques phrases suffisent. Pas besoin de bien écrire."
              errorMsg={errors["pourquoiCeChat"]}
            >
              <textarea
                data-error={errors["pourquoiCeChat"] ? "true" : undefined}
                rows={4}
                placeholder={`J'ai craqué pour ${cat.name} parce que…`}
                value={pourquoiCeChat}
                onChange={(e) => { setPourquoiCeChat(e.target.value); clearError("pourquoiCeChat") }}
                className={inp(!!errors["pourquoiCeChat"]) + " resize-y leading-[1.55]"}
              />
            </FField>
            <FField label="Vétérinaire de référence" optional hint="Si vous en avez déjà un, ça nous simplifie le suivi.">
              <input placeholder="Clinique vétérinaire des Brotteaux, Lyon 6e" value={veterinaire} onChange={(e) => setVeterinaire(e.target.value)} className={inp(false)} />
            </FField>
            <FField label="Quand seriez-vous disponible pour une rencontre ?">
              <ChipGroup options={["Cette semaine", "Le week-end", "Sous 2 semaines", "Plus tard"]} value={disponibilite} onChange={setDisponibilite} />
            </FField>
          </div>
        </div>

        {/* Section 4 — Engagements */}
        <div id="field-engagements" className="px-7 py-[22px]">
          <FSectionHeader num={4} title="Engagements" subtitle="L'adoption d'un chat est une responsabilité de 15-20 ans." tintClass="bg-mint" />

          {errors["engagements"] && (
            <div
              data-error="true"
              className="flex items-start gap-2 mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600"
            >
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              {errors["engagements"]}
            </div>
          )}

          <div className="grid gap-0">
            {COMMITMENTS.map(({ text, required }, i) => {
              const isChecked = checked[i]
              const isErrored = !!errors["engagements"] && required && !isChecked
              return (
                <label
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className="flex items-start gap-3 py-3 cursor-pointer group border-b border-border last:border-0"
                >
                  <span
                    className={`w-[18px] h-[18px] rounded-[5px] mt-0.5 border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? "bg-[#3FA66E] border-[#3FA66E]"
                        : isErrored
                        ? "bg-white border-red-400"
                        : "bg-white border-border-strong group-hover:border-ink/40"
                    }`}
                  >
                    {isChecked && (
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M2 5.5l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-xs leading-[1.55] flex-1 ${isChecked ? "text-ink" : "text-ink-muted"}`}>
                    {text}
                    {required && (
                      <span className={`ml-1.5 text-[10px] font-semibold ${isErrored ? "text-red-500" : "text-ink-subtle"}`}>
                        requis
                      </span>
                    )}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer — toujours visible, ne scroll pas */}
      <div className="shrink-0 border-t border-border bg-white">
        {serverError && (
          <div className="mx-7 mt-3 px-4 py-2.5 bg-rose rounded-lg text-xs text-ink border border-[#f5b7cc] flex items-center gap-2">
            <AlertCircle size={12} className="shrink-0" />
            {serverError}
          </div>
        )}
        <div className="px-7 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <Lock size={13} className="shrink-0" />
            <span>Vos réponses sont strictement confidentielles.</span>
          </div>
          <div className="flex gap-2 shrink-0">
            <DialogPrimitive.Close className="px-4 py-2.5 rounded-lg bg-white text-ink border border-border-strong text-xs font-semibold cursor-pointer font-[inherit]">
              Annuler
            </DialogPrimitive.Close>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-lg text-white text-xs font-semibold border-none cursor-pointer font-[inherit] disabled:opacity-60"
              style={{ background: "linear-gradient(90deg, #F76C70 0%, #E84A77 100%)" }}
            >
              {loading ? "Envoi…" : "Envoyer ma demande"}
              {!loading && <ArrowRight size={13} />}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

// ── Public component ─────────────────────────────────────────────────────────

export function AdoptModal({ cat }: { cat: CardAnimal }) {
  const [open, setOpen] = useState(false)

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger className="inline-flex items-center justify-center gap-2 w-full px-[18px] py-3 rounded-md bg-coral text-white text-sm font-semibold border-none cursor-pointer font-[inherit]">
        <Heart size={13} />
        Adopter {cat.name}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
          style={{ background: "rgba(20,22,38,0.55)", backdropFilter: "blur(6px)" }}
        />
        <DialogPrimitive.Popup className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <div
            className="relative w-full max-w-[720px] bg-white rounded-[14px] overflow-hidden shadow-[0_30px_80px_rgba(20,22,38,0.35)] border border-border flex flex-col"
            style={{ maxHeight: "calc(100dvh - 48px)" }}
          >

            {/* Header */}
            <div
              className="relative px-7 pt-5 pb-4 text-white overflow-hidden shrink-0"
              style={{ background: "linear-gradient(135deg, #F76C70 0%, #E84A77 100%)" }}
            >
              <DialogPrimitive.Close
                className="absolute top-4 right-[18px] w-[30px] h-[30px] rounded-full flex items-center justify-center border-none cursor-pointer text-white"
                style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.30)" }}
              >
                <X size={13} />
                <span className="sr-only">Fermer</span>
              </DialogPrimitive.Close>

              <div className="flex items-center gap-3.5 relative">
                <div
                  className="w-[52px] h-[52px] rounded-[10px] border-2 border-white/40 shrink-0"
                  style={{ background: `linear-gradient(135deg, ${cat.tones[0]} 0%, ${cat.tones[1]} 100%)` }}
                />
                <div>
                  <div className="text-xs text-white/85 font-semibold mb-0.5">Demande d&apos;adoption</div>
                  <DialogPrimitive.Title className="text-[22px] font-semibold tracking-[-0.02em] m-0 leading-[1.1] text-white">
                    Adopter {cat.name}
                  </DialogPrimitive.Title>
                  <div className="text-xs text-white/85 mt-0.5">{cat.age} · {cat.sex}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/85 mt-4">
                <span className="px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.30)" }}>
                  ~ 8 minutes
                </span>
                <span>·</span>
                <span>Vos réponses sont sauvegardées au fur et à mesure.</span>
              </div>
            </div>

            <AdoptionFormInner cat={cat} onClose={() => setOpen(false)} />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
