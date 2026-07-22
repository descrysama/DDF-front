"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Heart, X, ArrowRight, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogPortal, DialogClose } from "@/components/ui/dialog"
import type { CardAnnouncement, StrapiAdopterProfileRaw } from "@/lib/strapi"
import { submitAdoptionRequest, type AdoptionFormData } from "@/lib/actions/adoption"
import { useUserStore } from "@/lib/stores/user-store"

// ── Prefill from adopter-profile ────────────────────────────────────────────

function mapHousingType(v: StrapiAdopterProfileRaw["housing_type"]): string | null {
  if (v === "house") return "Maison"
  if (v === "apartment") return "Appartement"
  return null
}

// ── Primitives ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 8

const STEP_META: { title: string; subtitle: (catName: string) => string; tint: string }[] = [
  { title: "Accord préalable",          subtitle: () => "Avant de commencer, une question importante.",                    tint: "bg-pink"  },
  { title: "Identité & contact",        subtitle: () => "Vos coordonnées pour qu'on puisse vous recontacter.",             tint: "bg-peach" },
  { title: "Votre foyer",               subtitle: (n) => `Composition et accord de votre foyer pour accueillir ${n}.`,     tint: "bg-lilac" },
  { title: "Activité professionnelle",  subtitle: () => "Pour évaluer le temps que l'animal passera seul.",                tint: "bg-mint"  },
  { title: "Votre logement",            subtitle: () => "Le cadre de vie qui attend votre futur compagnon.",               tint: "bg-pink"  },
  { title: "Extérieur",                 subtitle: () => "Jardin, balcon ou terrasse : les accès extérieurs du logement.",  tint: "bg-peach" },
  { title: "Autres animaux",            subtitle: () => "Les compagnons déjà présents chez vous.",                        tint: "bg-lilac" },
  { title: "Remarques & engagement",    subtitle: () => "Dernière étape avant l'envoi de votre demande.",                  tint: "bg-mint"  },
]

const inputBase = "w-full box-border px-3 py-2.5 rounded-lg border text-xs font-[inherit] text-ink outline-none bg-white transition-colors"
const inputOk   = "border-border focus:border-ink/40"
const inputErr  = "border-red-400 bg-red-50 focus:border-red-500"

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

// ── Form ─────────────────────────────────────────────────────────────────────

type Errors = Partial<Record<string, string>>

function AdoptionFormInner({ cat, onClose }: { cat: CardAnnouncement; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [serverError, setServerError] = useState("")
  const [errors, setErrors]       = useState<Errors>({})
  const [step, setStep] = useState(1)

  // Étape 1 — Accord préalable
  const [agreement, setAgreement] = useState("")

  // Étape 2 — Identité & contact
  const [animalName, setAnimalName] = useState(cat.name)
  const [firstName,  setFirstName]  = useState("")
  const [lastName,   setLastName]   = useState("")
  const [birthDate,  setBirthDate]  = useState("")
  const [address,    setAddress]    = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [city,       setCity]       = useState("")
  const [phone,      setPhone]      = useState("")
  const [email,      setEmail]      = useState("")

  // Étape 3 — Votre foyer
  const [composition,      setComposition]      = useState("")
  const [roommatesCount,   setRoommatesCount]   = useState("")
  const [hasChildren,      setHasChildren]      = useState("")
  const [childrenCount,    setChildrenCount]    = useState("")
  const [childrenAges,     setChildrenAges]     = useState("")
  const [householdAgrees,  setHouseholdAgrees]  = useState("")
  const [disagreementWho,  setDisagreementWho]  = useState("")
  const [disagreementWhy,  setDisagreementWhy]  = useState("")

  // Étape 4 — Activité professionnelle
  const [employed,   setEmployed]   = useState("")
  const [profession, setProfession] = useState("")
  const [workHours,  setWorkHours]  = useState("")
  const [hoursAlone, setHoursAlone] = useState("")

  // Étape 5 — Votre logement
  const [housingType,          setHousingType]          = useState("")
  const [surfaceArea,          setSurfaceArea]          = useState("")
  const [animalEnvironment,    setAnimalEnvironment]    = useState("")
  const [areaType,             setAreaType]             = useState("")
  const [busyRoad,             setBusyRoad]             = useState("")
  const [outdoorAccessAllowed, setOutdoorAccessAllowed] = useState("")
  const [apartmentFloor,       setApartmentFloor]       = useState("")
  const [windowsSecured,       setWindowsSecured]       = useState("")
  const [plansToSecureWindows, setPlansToSecureWindows] = useState("")

  // Étape 6 — Extérieur
  const [hasGarden,       setHasGarden]       = useState("")
  const [gardenDescription, setGardenDescription] = useState("")
  const [gardenSurface,   setGardenSurface]   = useState("")
  const [gardenFenced,    setGardenFenced]    = useState("")
  const [fenceHeight,     setFenceHeight]     = useState("")
  const [hasBalcony,      setHasBalcony]      = useState("")
  const [balconySurface,  setBalconySurface]  = useState("")
  const [balconySecured,  setBalconySecured]  = useState("")

  // Étape 7 — Autres animaux
  const [hasOtherPets,        setHasOtherPets]        = useState("")
  const [otherPetsDetails,    setOtherPetsDetails]    = useState("")
  const [otherPetsSterilized, setOtherPetsSterilized] = useState("")
  const [otherPetsSince,      setOtherPetsSince]      = useState("")

  // Étape 8 — Remarques & engagement
  const [remarks, setRemarks] = useState("")
  const [responsibilityAgreement, setResponsibilityAgreement] = useState(false)

  // Préremplissage depuis le profil adoptant existant (/profile), une fois au montage
  const user = useUserStore((s) => s.user)
  useEffect(() => {
    if (user?.email) setEmail((prev) => prev || user.email)

    fetch("/api/adopter-profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { profile: StrapiAdopterProfileRaw | null } | null) => {
        const profile = body?.profile
        if (!profile) return

        const housing = mapHousingType(profile.housing_type)
        if (housing) setHousingType(housing)

        if (profile.has_garden) setHasGarden("Oui")
        if (profile.has_children) setHasChildren("Oui")
        if (profile.has_dogs || profile.has_cats) setHasOtherPets("Oui")
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function clearError(key: string) {
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validateStep(n: number): Errors {
    const e: Errors = {}
    const required = "Champ requis"
    const pick = "Merci de répondre à cette question."

    if (n === 1) {
      if (!agreement) e.agreement = pick
    }

    if (n === 2) {
      if (!animalName.trim()) e.animalName = required
      if (!firstName.trim())  e.firstName  = required
      if (!lastName.trim())   e.lastName   = required
      if (!birthDate)         e.birthDate  = required
      if (!address.trim())    e.address    = required
      if (!postalCode.trim()) e.postalCode = required
      if (!city.trim())       e.city       = required
      if (!phone.trim())      e.phone      = required
      if (!email.trim())      e.email      = required
      else if (!email.includes("@")) e.email = "Adresse email invalide"
    }

    if (n === 3) {
      if (!composition) e.composition = pick
      if (composition === "Colocation" && !roommatesCount.trim()) e.roommatesCount = required
      if (!hasChildren) e.hasChildren = pick
      else if (hasChildren === "Oui") {
        if (!childrenCount.trim()) e.childrenCount = required
        if (!childrenAges.trim())  e.childrenAges  = required
      }
      if (!householdAgrees) e.householdAgrees = pick
      else if (householdAgrees === "Non") {
        if (!disagreementWho.trim()) e.disagreementWho = required
        if (!disagreementWhy.trim()) e.disagreementWhy = required
      }
    }

    if (n === 4) {
      if (!employed) e.employed = pick
      else if (employed === "Oui") {
        if (!profession.trim()) e.profession = required
        if (!workHours.trim())  e.workHours  = required
      }
      if (!hoursAlone.trim()) e.hoursAlone = required
    }

    if (n === 5) {
      if (!housingType)          e.housingType          = pick
      if (!surfaceArea.trim())   e.surfaceArea          = required
      if (!animalEnvironment)    e.animalEnvironment    = pick
      if (!areaType)             e.areaType             = pick
      if (!busyRoad)             e.busyRoad             = pick
      if (!outdoorAccessAllowed) e.outdoorAccessAllowed = pick
      if (housingType === "Appartement") {
        if (!apartmentFloor.trim()) e.apartmentFloor = required
        if (!windowsSecured)        e.windowsSecured = pick
      }
    }

    if (n === 6) {
      if (!hasGarden) e.hasGarden = pick
      else if (hasGarden !== "Non") {
        if (!gardenDescription.trim()) e.gardenDescription = required
        if (!gardenSurface.trim())     e.gardenSurface     = required
        if (!gardenFenced) e.gardenFenced = pick
        else if (gardenFenced === "Oui" && !fenceHeight.trim()) e.fenceHeight = required
      }
      if (!hasBalcony) e.hasBalcony = pick
      else if (hasBalcony !== "Non") {
        if (!balconySurface.trim()) e.balconySurface = required
        if (!balconySecured)        e.balconySecured = pick
      }
    }

    if (n === 7) {
      if (!hasOtherPets) e.hasOtherPets = pick
      else if (hasOtherPets === "Oui") {
        if (!otherPetsDetails.trim())    e.otherPetsDetails    = required
        if (!otherPetsSterilized)        e.otherPetsSterilized = pick
        if (!otherPetsSince.trim())      e.otherPetsSince      = required
      }
    }

    if (n === 8) {
      if (!responsibilityAgreement) e.responsibilityAgreement = "Vous devez accepter cette mention pour valider votre demande."
    }

    return e
  }

  function scrollToFirstError() {
    requestAnimationFrame(() => {
      const container = scrollRef.current
      if (!container) return
      const firstError = container.querySelector("[data-error='true']") as HTMLElement | null
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" })
    })
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(1, s - 1))
    scrollRef.current?.scrollTo({ top: 0 })
  }

  async function handleNext() {
    const stepErrors = validateStep(step)
    setErrors(stepErrors)

    if (Object.keys(stepErrors).length > 0) {
      scrollToFirstError()
      return
    }

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
      scrollRef.current?.scrollTo({ top: 0 })
      return
    }

    await handleSubmit()
  }

  async function handleSubmit() {
    setLoading(true)
    setServerError("")

    const data: AdoptionFormData = {
      announcementId: cat.id,
      adoption_process_agreement: agreement === "Oui",
      applicant: {
        animal_name: animalName,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        address,
        postal_code: postalCode,
        city,
        phone,
        email,
      },
      household: {
        composition,
        ...(composition === "Colocation" ? { roommates_count: roommatesCount } : {}),
        has_children: hasChildren === "Oui",
        ...(hasChildren === "Oui" ? { children_count: childrenCount, children_ages: childrenAges } : {}),
        household_agrees: householdAgrees === "Oui",
        ...(householdAgrees === "Non" ? { disagreement_who: disagreementWho, disagreement_why: disagreementWhy } : {}),
      },
      employment: {
        employed: employed === "Oui",
        ...(employed === "Oui" ? { profession, work_hours: workHours } : {}),
        hours_alone_per_day: hoursAlone,
      },
      housing: {
        type: housingType,
        surface_area: surfaceArea,
        animal_environment: animalEnvironment,
        area_type: areaType,
        busy_road_nearby: busyRoad,
        outdoor_access_allowed: outdoorAccessAllowed,
        apartment:
          housingType === "Appartement"
            ? { floor: apartmentFloor, windows_secured: windowsSecured, plans_to_secure_windows: plansToSecureWindows }
            : null,
      },
      outdoor: {
        garden: {
          has_garden: hasGarden === "Oui" || hasGarden === "Autre",
          ...(hasGarden !== "Non"
            ? {
                description: gardenDescription,
                surface_area: gardenSurface,
                fenced: gardenFenced === "Oui",
                ...(gardenFenced === "Oui" ? { fence_height: fenceHeight } : {}),
              }
            : {}),
        },
        balcony: {
          has_balcony: hasBalcony === "Oui" || hasBalcony === "Autre",
          ...(hasBalcony !== "Non" ? { surface_area: balconySurface, secured: balconySecured } : {}),
        },
      },
      other_pets: {
        has_other_pets: hasOtherPets === "Oui",
        ...(hasOtherPets === "Oui"
          ? { details: otherPetsDetails, sterilized: otherPetsSterilized, owned_since: otherPetsSince }
          : {}),
      },
      remarks,
      responsibility_agreement: responsibilityAgreement,
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
        <Button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-coral text-white text-sm font-semibold border-none cursor-pointer font-[inherit] hover:bg-coral/90"
        >
          Fermer <X size={14} />
        </Button>
      </div>
    )
  }

  const inp = (hasErr: boolean) => `${inputBase} ${hasErr ? inputErr : inputOk}`
  const meta = STEP_META[step - 1]
  const isBlocked = step === 1 && agreement === "Non"

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
      {/* Barre de progression */}
      <div className="shrink-0">
        <div className="px-7 pt-3 pb-2 text-[11px] font-semibold text-ink-muted">
          Étape {step} / {TOTAL_STEPS}
        </div>
        <div className="h-1 bg-border">
          <div
            className="h-full bg-coral transition-[width]"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* Scrollable body — seul scroll de la modal */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        <div className="px-7 py-[22px]">
          <FSectionHeader num={step} title={meta.title} subtitle={meta.subtitle(cat.name)} tintClass={meta.tint} />

          {/* Étape 1 — Accord préalable */}
          {step === 1 && (
            <div className="grid gap-4">
              <Field data-error={errors["agreement"] ? "true" : undefined}>
                <FieldLabel>Êtes-vous d&apos;accord avec la démarche d&apos;adoption ?</FieldLabel>
                <ChipGroup
                  options={["Oui", "Non"]}
                  value={agreement}
                  onChange={(v) => { setAgreement(v); clearError("agreement") }}
                />
                <FieldError>{errors["agreement"]}</FieldError>
              </Field>
              {isBlocked && (
                <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  Nous ne pouvons malheureusement pas donner suite à une demande d&apos;adoption sans cet accord.
                </div>
              )}
            </div>
          )}

          {/* Étape 2 — Identité & contact */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              <Field className="col-span-2" data-error={errors["animalName"] ? "true" : undefined}>
                <FieldLabel>Nom de l&apos;animal</FieldLabel>
                <Input value={animalName} onChange={(e) => { setAnimalName(e.target.value); clearError("animalName") }} className={inp(!!errors["animalName"])} />
                <FieldDescription>En cas de duo, merci de préciser les deux noms.</FieldDescription>
                <FieldError>{errors["animalName"]}</FieldError>
              </Field>
              <Field data-error={errors["firstName"] ? "true" : undefined}>
                <FieldLabel>Votre prénom</FieldLabel>
                <Input placeholder="Élodie" value={firstName} onChange={(e) => { setFirstName(e.target.value); clearError("firstName") }} className={inp(!!errors["firstName"])} />
                <FieldError>{errors["firstName"]}</FieldError>
              </Field>
              <Field data-error={errors["lastName"] ? "true" : undefined}>
                <FieldLabel>Votre nom</FieldLabel>
                <Input placeholder="Mercier" value={lastName} onChange={(e) => { setLastName(e.target.value); clearError("lastName") }} className={inp(!!errors["lastName"])} />
                <FieldError>{errors["lastName"]}</FieldError>
              </Field>
              <Field data-error={errors["birthDate"] ? "true" : undefined}>
                <FieldLabel>Votre date de naissance</FieldLabel>
                <Input type="date" value={birthDate} onChange={(e) => { setBirthDate(e.target.value); clearError("birthDate") }} className={inp(!!errors["birthDate"])} />
                <FieldError>{errors["birthDate"]}</FieldError>
              </Field>
              <Field className="col-span-2" data-error={errors["address"] ? "true" : undefined}>
                <FieldLabel>Votre adresse postale complète</FieldLabel>
                <Input placeholder="12 rue de la République" value={address} onChange={(e) => { setAddress(e.target.value); clearError("address") }} className={inp(!!errors["address"])} />
                <FieldError>{errors["address"]}</FieldError>
              </Field>
              <Field data-error={errors["postalCode"] ? "true" : undefined}>
                <FieldLabel>Code postal</FieldLabel>
                <Input placeholder="69007" value={postalCode} onChange={(e) => { setPostalCode(e.target.value); clearError("postalCode") }} className={inp(!!errors["postalCode"])} />
                <FieldError>{errors["postalCode"]}</FieldError>
              </Field>
              <Field data-error={errors["city"] ? "true" : undefined}>
                <FieldLabel>Ville</FieldLabel>
                <Input placeholder="Lyon 7e" value={city} onChange={(e) => { setCity(e.target.value); clearError("city") }} className={inp(!!errors["city"])} />
                <FieldError>{errors["city"]}</FieldError>
              </Field>
              <Field data-error={errors["phone"] ? "true" : undefined}>
                <FieldLabel>Votre numéro de téléphone</FieldLabel>
                <Input placeholder="06 12 34 56 78" value={phone} onChange={(e) => { setPhone(e.target.value); clearError("phone") }} className={inp(!!errors["phone"])} />
                <FieldError>{errors["phone"]}</FieldError>
              </Field>
              <Field data-error={errors["email"] ? "true" : undefined}>
                <FieldLabel>Votre adresse email</FieldLabel>
                <Input type="email" placeholder="vous@exemple.fr" value={email} onChange={(e) => { setEmail(e.target.value); clearError("email") }} className={inp(!!errors["email"])} />
                <FieldError>{errors["email"]}</FieldError>
              </Field>
            </div>
          )}

          {/* Étape 3 — Votre foyer */}
          {step === 3 && (
            <div className="grid gap-4">
              <Field data-error={errors["composition"] ? "true" : undefined}>
                <FieldLabel>Composition du foyer</FieldLabel>
                <ChipGroup options={["Seul·e", "En couple", "Colocation", "Autre"]} value={composition} onChange={(v) => { setComposition(v); clearError("composition") }} />
                <FieldError>{errors["composition"]}</FieldError>
              </Field>
              {composition === "Colocation" && (
                <Field data-error={errors["roommatesCount"] ? "true" : undefined}>
                  <FieldLabel>Combien de colocataires ?</FieldLabel>
                  <Input placeholder="2" value={roommatesCount} onChange={(e) => { setRoommatesCount(e.target.value); clearError("roommatesCount") }} className={inp(!!errors["roommatesCount"])} />
                  <FieldError>{errors["roommatesCount"]}</FieldError>
                </Field>
              )}
              <Field data-error={errors["hasChildren"] ? "true" : undefined}>
                <FieldLabel>Avez-vous des enfants ?</FieldLabel>
                <ChipGroup options={["Oui", "Non"]} value={hasChildren} onChange={(v) => { setHasChildren(v); clearError("hasChildren") }} />
                <FieldError>{errors["hasChildren"]}</FieldError>
              </Field>
              {hasChildren === "Oui" && (
                <>
                  <Field data-error={errors["childrenCount"] ? "true" : undefined}>
                    <FieldLabel>Combien d&apos;enfants ?</FieldLabel>
                    <Input placeholder="2" value={childrenCount} onChange={(e) => { setChildrenCount(e.target.value); clearError("childrenCount") }} className={inp(!!errors["childrenCount"])} />
                    <FieldError>{errors["childrenCount"]}</FieldError>
                  </Field>
                  <Field data-error={errors["childrenAges"] ? "true" : undefined}>
                    <FieldLabel>Quel âge ont-ils ?</FieldLabel>
                    <Input placeholder="4 et 8 ans" value={childrenAges} onChange={(e) => { setChildrenAges(e.target.value); clearError("childrenAges") }} className={inp(!!errors["childrenAges"])} />
                    <FieldError>{errors["childrenAges"]}</FieldError>
                  </Field>
                </>
              )}
              <Field data-error={errors["householdAgrees"] ? "true" : undefined}>
                <FieldLabel>Toutes les personnes vivant au foyer sont-elles d&apos;accord avec cette demande d&apos;adoption ?</FieldLabel>
                <ChipGroup options={["Oui", "Non"]} value={householdAgrees} onChange={(v) => { setHouseholdAgrees(v); clearError("householdAgrees") }} />
                <FieldError>{errors["householdAgrees"]}</FieldError>
              </Field>
              {householdAgrees === "Non" && (
                <>
                  <Field data-error={errors["disagreementWho"] ? "true" : undefined}>
                    <FieldLabel>Qui n&apos;est pas d&apos;accord ?</FieldLabel>
                    <Input value={disagreementWho} onChange={(e) => { setDisagreementWho(e.target.value); clearError("disagreementWho") }} className={inp(!!errors["disagreementWho"])} />
                    <FieldError>{errors["disagreementWho"]}</FieldError>
                  </Field>
                  <Field data-error={errors["disagreementWhy"] ? "true" : undefined}>
                    <FieldLabel>Pourquoi ?</FieldLabel>
                    <Textarea rows={3} value={disagreementWhy} onChange={(e) => { setDisagreementWhy(e.target.value); clearError("disagreementWhy") }} className={inp(!!errors["disagreementWhy"]) + " resize-y leading-[1.55]"} />
                    <FieldError>{errors["disagreementWhy"]}</FieldError>
                  </Field>
                </>
              )}
            </div>
          )}

          {/* Étape 4 — Activité professionnelle */}
          {step === 4 && (
            <div className="grid gap-4">
              <Field data-error={errors["employed"] ? "true" : undefined}>
                <FieldLabel>Travaillez-vous ?</FieldLabel>
                <ChipGroup options={["Oui", "Non"]} value={employed} onChange={(v) => { setEmployed(v); clearError("employed") }} />
                <FieldError>{errors["employed"]}</FieldError>
              </Field>
              {employed === "Oui" && (
                <>
                  <Field data-error={errors["profession"] ? "true" : undefined}>
                    <FieldLabel>Quelle est votre profession ?</FieldLabel>
                    <Input placeholder="Designer" value={profession} onChange={(e) => { setProfession(e.target.value); clearError("profession") }} className={inp(!!errors["profession"])} />
                    <FieldError>{errors["profession"]}</FieldError>
                  </Field>
                  <Field data-error={errors["workHours"] ? "true" : undefined}>
                    <FieldLabel>Quels sont vos horaires de travail ?</FieldLabel>
                    <Input placeholder="9h-17h, télétravail 2j/semaine" value={workHours} onChange={(e) => { setWorkHours(e.target.value); clearError("workHours") }} className={inp(!!errors["workHours"])} />
                    <FieldError>{errors["workHours"]}</FieldError>
                  </Field>
                </>
              )}
              <Field data-error={errors["hoursAlone"] ? "true" : undefined}>
                <FieldLabel>Combien de temps l&apos;animal restera-t-il seul chez vous dans la journée ?</FieldLabel>
                <Input placeholder="4 heures" value={hoursAlone} onChange={(e) => { setHoursAlone(e.target.value); clearError("hoursAlone") }} className={inp(!!errors["hoursAlone"])} />
                <FieldError>{errors["hoursAlone"]}</FieldError>
              </Field>
            </div>
          )}

          {/* Étape 5 — Votre logement */}
          {step === 5 && (
            <div className="grid gap-4">
              <Field data-error={errors["housingType"] ? "true" : undefined}>
                <FieldLabel>Vous vivez ?</FieldLabel>
                <ChipGroup options={["Appartement", "Maison", "Autre"]} value={housingType} onChange={(v) => { setHousingType(v); clearError("housingType") }} />
                <FieldError>{errors["housingType"]}</FieldError>
              </Field>
              <Field data-error={errors["surfaceArea"] ? "true" : undefined}>
                <FieldLabel>Superficie du logement ?</FieldLabel>
                <Input placeholder="60 m²" value={surfaceArea} onChange={(e) => { setSurfaceArea(e.target.value); clearError("surfaceArea") }} className={inp(!!errors["surfaceArea"])} />
                <FieldError>{errors["surfaceArea"]}</FieldError>
              </Field>
              <Field data-error={errors["animalEnvironment"] ? "true" : undefined}>
                <FieldLabel>L&apos;animal vivra-t-il ?</FieldLabel>
                <ChipGroup options={["Intérieur", "Extérieur", "Les deux", "Autre"]} value={animalEnvironment} onChange={(v) => { setAnimalEnvironment(v); clearError("animalEnvironment") }} />
                <FieldError>{errors["animalEnvironment"]}</FieldError>
              </Field>
              <Field data-error={errors["areaType"] ? "true" : undefined}>
                <FieldLabel>Habitez-vous ?</FieldLabel>
                <ChipGroup options={["Ville", "Campagne", "Lotissement", "Autre"]} value={areaType} onChange={(v) => { setAreaType(v); clearError("areaType") }} />
                <FieldError>{errors["areaType"]}</FieldError>
              </Field>
              <Field data-error={errors["busyRoad"] ? "true" : undefined}>
                <FieldLabel>Habitez-vous à proximité d&apos;une route passante ?</FieldLabel>
                <ChipGroup options={["Oui", "Non", "Autre"]} value={busyRoad} onChange={(v) => { setBusyRoad(v); clearError("busyRoad") }} />
                <FieldError>{errors["busyRoad"]}</FieldError>
              </Field>
              <Field data-error={errors["outdoorAccessAllowed"] ? "true" : undefined}>
                <FieldLabel>L&apos;animal aura-t-il le droit/la possibilité de sortir ?</FieldLabel>
                <ChipGroup options={["Oui", "Non", "Autre"]} value={outdoorAccessAllowed} onChange={(v) => { setOutdoorAccessAllowed(v); clearError("outdoorAccessAllowed") }} />
                <FieldError>{errors["outdoorAccessAllowed"]}</FieldError>
              </Field>
              {housingType === "Appartement" && (
                <>
                  <Field data-error={errors["apartmentFloor"] ? "true" : undefined}>
                    <FieldLabel>À quel étage êtes-vous ?</FieldLabel>
                    <Input placeholder="3e étage" value={apartmentFloor} onChange={(e) => { setApartmentFloor(e.target.value); clearError("apartmentFloor") }} className={inp(!!errors["apartmentFloor"])} />
                    <FieldError>{errors["apartmentFloor"]}</FieldError>
                  </Field>
                  <Field data-error={errors["windowsSecured"] ? "true" : undefined}>
                    <FieldLabel>Vos fenêtres sont-elles sécurisées ?</FieldLabel>
                    <ChipGroup options={["Oui", "Non", "Autre"]} value={windowsSecured} onChange={(v) => { setWindowsSecured(v); clearError("windowsSecured") }} />
                    <FieldError>{errors["windowsSecured"]}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>Envisagez-vous de sécuriser vos fenêtres ?</FieldLabel>
                    <Input value={plansToSecureWindows} onChange={(e) => setPlansToSecureWindows(e.target.value)} className={inp(false)} />
                    <FieldDescription>Facultatif</FieldDescription>
                  </Field>
                </>
              )}
            </div>
          )}

          {/* Étape 6 — Extérieur */}
          {step === 6 && (
            <div className="grid gap-4">
              <Field data-error={errors["hasGarden"] ? "true" : undefined}>
                <FieldLabel>Avez-vous un jardin ?</FieldLabel>
                <ChipGroup options={["Oui", "Non", "Autre"]} value={hasGarden} onChange={(v) => { setHasGarden(v); clearError("hasGarden") }} />
                <FieldError>{errors["hasGarden"]}</FieldError>
              </Field>
              {hasGarden !== "" && hasGarden !== "Non" && (
                <>
                  <Field data-error={errors["gardenDescription"] ? "true" : undefined}>
                    <FieldLabel>Précisez votre lieu de vie</FieldLabel>
                    <Input placeholder="Maison mitoyenne avec jardin clos" value={gardenDescription} onChange={(e) => { setGardenDescription(e.target.value); clearError("gardenDescription") }} className={inp(!!errors["gardenDescription"])} />
                    <FieldError>{errors["gardenDescription"]}</FieldError>
                  </Field>
                  <Field data-error={errors["gardenSurface"] ? "true" : undefined}>
                    <FieldLabel>Quelle est la superficie de votre jardin ?</FieldLabel>
                    <Input placeholder="200 m²" value={gardenSurface} onChange={(e) => { setGardenSurface(e.target.value); clearError("gardenSurface") }} className={inp(!!errors["gardenSurface"])} />
                    <FieldError>{errors["gardenSurface"]}</FieldError>
                  </Field>
                  <Field data-error={errors["gardenFenced"] ? "true" : undefined}>
                    <FieldLabel>Est-il grillagé ?</FieldLabel>
                    <ChipGroup options={["Oui", "Non"]} value={gardenFenced} onChange={(v) => { setGardenFenced(v); clearError("gardenFenced") }} />
                    <FieldError>{errors["gardenFenced"]}</FieldError>
                  </Field>
                  {gardenFenced === "Oui" && (
                    <Field data-error={errors["fenceHeight"] ? "true" : undefined}>
                      <FieldLabel>Précisez la hauteur du grillage</FieldLabel>
                      <Input placeholder="1,80 m" value={fenceHeight} onChange={(e) => { setFenceHeight(e.target.value); clearError("fenceHeight") }} className={inp(!!errors["fenceHeight"])} />
                      <FieldError>{errors["fenceHeight"]}</FieldError>
                    </Field>
                  )}
                </>
              )}
              <Field data-error={errors["hasBalcony"] ? "true" : undefined}>
                <FieldLabel>Avez-vous un balcon ou une terrasse ?</FieldLabel>
                <ChipGroup options={["Oui", "Non", "Autre"]} value={hasBalcony} onChange={(v) => { setHasBalcony(v); clearError("hasBalcony") }} />
                <FieldError>{errors["hasBalcony"]}</FieldError>
              </Field>
              {hasBalcony !== "" && hasBalcony !== "Non" && (
                <>
                  <Field data-error={errors["balconySurface"] ? "true" : undefined}>
                    <FieldLabel>Quelle est sa superficie ?</FieldLabel>
                    <Input placeholder="6 m²" value={balconySurface} onChange={(e) => { setBalconySurface(e.target.value); clearError("balconySurface") }} className={inp(!!errors["balconySurface"])} />
                    <FieldError>{errors["balconySurface"]}</FieldError>
                  </Field>
                  <Field data-error={errors["balconySecured"] ? "true" : undefined}>
                    <FieldLabel>Le balcon est-il sécurisé (filet de protection ou autre) ?</FieldLabel>
                    <ChipGroup options={["Oui", "Non", "Autre"]} value={balconySecured} onChange={(v) => { setBalconySecured(v); clearError("balconySecured") }} />
                    <FieldError>{errors["balconySecured"]}</FieldError>
                  </Field>
                </>
              )}
            </div>
          )}

          {/* Étape 7 — Autres animaux */}
          {step === 7 && (
            <div className="grid gap-4">
              <Field data-error={errors["hasOtherPets"] ? "true" : undefined}>
                <FieldLabel>Avez-vous d&apos;autres animaux ?</FieldLabel>
                <ChipGroup options={["Oui", "Non"]} value={hasOtherPets} onChange={(v) => { setHasOtherPets(v); clearError("hasOtherPets") }} />
                <FieldError>{errors["hasOtherPets"]}</FieldError>
              </Field>
              {hasOtherPets === "Oui" && (
                <>
                  <Field data-error={errors["otherPetsDetails"] ? "true" : undefined}>
                    <FieldLabel>Quels animaux avez-vous ?</FieldLabel>
                    <Textarea rows={3} placeholder="Nombre / espèce / race / sexe et âge" value={otherPetsDetails} onChange={(e) => { setOtherPetsDetails(e.target.value); clearError("otherPetsDetails") }} className={inp(!!errors["otherPetsDetails"]) + " resize-y leading-[1.55]"} />
                    <FieldError>{errors["otherPetsDetails"]}</FieldError>
                  </Field>
                  <Field data-error={errors["otherPetsSterilized"] ? "true" : undefined}>
                    <FieldLabel>Sont-ils stérilisés ?</FieldLabel>
                    <ChipGroup options={["Oui", "Non"]} value={otherPetsSterilized} onChange={(v) => { setOtherPetsSterilized(v); clearError("otherPetsSterilized") }} />
                    <FieldError>{errors["otherPetsSterilized"]}</FieldError>
                  </Field>
                  <Field data-error={errors["otherPetsSince"] ? "true" : undefined}>
                    <FieldLabel>Depuis combien de temps les avez-vous ?</FieldLabel>
                    <Input placeholder="3 ans" value={otherPetsSince} onChange={(e) => { setOtherPetsSince(e.target.value); clearError("otherPetsSince") }} className={inp(!!errors["otherPetsSince"])} />
                    <FieldError>{errors["otherPetsSince"]}</FieldError>
                  </Field>
                </>
              )}
            </div>
          )}

          {/* Étape 8 — Remarques & engagement */}
          {step === 8 && (
            <div className="grid gap-4">
              <Field>
                <FieldLabel>Avez-vous des remarques à nous partager ou quelque chose que vous souhaitez ajouter ?</FieldLabel>
                <Textarea rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} className={inp(false) + " resize-y leading-[1.55]"} />
                <FieldDescription>Facultatif</FieldDescription>
              </Field>

              {errors["responsibilityAgreement"] && (
                <div data-error="true" className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  {errors["responsibilityAgreement"]}
                </div>
              )}

              <label
                onClick={() => { setResponsibilityAgreement((v) => !v); clearError("responsibilityAgreement") }}
                className="flex items-start gap-3 py-1 cursor-pointer group"
              >
                <span
                  className={`w-[18px] h-[18px] rounded-[5px] mt-0.5 border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
                    responsibilityAgreement
                      ? "bg-[#3FA66E] border-[#3FA66E]"
                      : errors["responsibilityAgreement"]
                      ? "bg-white border-red-400"
                      : "bg-white border-border-strong group-hover:border-ink/40"
                  }`}
                >
                  {responsibilityAgreement && (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                      <path d="M2 5.5l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={`text-xs leading-[1.55] flex-1 ${responsibilityAgreement ? "text-ink" : "text-ink-muted"}`}>
                  En validant ce formulaire, vous vous engagez à accepter l&apos;entière responsabilité de l&apos;entretien de l&apos;animal, ce qui inclut les frais vétérinaires (vaccination annuelle, déparasitage, vermifugation, maladie…), la nourriture, les accessoires et autres frais, ainsi que les conséquences juridiques et pécuniaires liées à la responsabilité de tout possesseur de ce type d&apos;animal.
                </span>
              </label>
            </div>
          )}
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
            {isBlocked ? (
              <DialogClose
                render={
                  <Button
                    variant="outline"
                    className="px-4 py-2.5 rounded-lg bg-white text-ink border border-border-strong text-xs font-semibold cursor-pointer font-[inherit] h-auto"
                  />
                }
              >
                Fermer
              </DialogClose>
            ) : (
              <>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="px-4 py-2.5 rounded-lg bg-white text-ink border border-border-strong text-xs font-semibold cursor-pointer font-[inherit] h-auto"
                  >
                    Précédent
                  </Button>
                )}
                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-lg text-white text-xs font-semibold border-none cursor-pointer font-[inherit] disabled:opacity-60 h-auto"
                  style={{ background: "linear-gradient(90deg, #F76C70 0%, #E84A77 100%)" }}
                >
                  {step < TOTAL_STEPS ? "Suivant" : loading ? "Envoi…" : "Envoyer ma demande"}
                  {!loading && <ArrowRight size={13} />}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Public component ─────────────────────────────────────────────────────────

export function AdoptModal({ cat, defaultOpen = false }: { cat: CardAnnouncement; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 w-full px-[18px] py-3 rounded-md bg-coral text-white text-sm font-semibold border-none cursor-pointer font-[inherit]">
        <Heart size={13} />
        Adopter {cat.name}
      </DialogTrigger>

      <DialogPortal>
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
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-4 right-[18px] z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center border-none cursor-pointer text-white hover:bg-white/25 hover:text-white"
                    style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.30)" }}
                  />
                }
              >
                <X size={13} />
                <span className="sr-only">Fermer</span>
              </DialogClose>

              <div className="flex items-center gap-3.5">
                <div
                  className="relative w-[52px] h-[52px] rounded-[10px] border-2 border-white/40 shrink-0 overflow-hidden"
                  style={cat.photoUrl ? undefined : { background: `linear-gradient(135deg, ${cat.tones[0]} 0%, ${cat.tones[1]} 100%)` }}
                >
                  {cat.photoUrl && (
                    <Image src={cat.photoUrl} alt={cat.name} fill unoptimized sizes="52px" style={{ objectFit: "cover" }} />
                  )}
                </div>
                <div>
                  <div className="text-xs text-white/85 font-semibold mb-0.5">Demande d&apos;adoption</div>
                  <DialogPrimitive.Title className="text-[22px] font-semibold tracking-[-0.02em] m-0 leading-[1.1] text-white">
                    Adopter {cat.name}
                  </DialogPrimitive.Title>
                  <div className="text-xs text-white/85 mt-0.5">{cat.age} · {cat.sex}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/85 mt-4">
                <Badge className="bg-white/[0.18] border border-white/30 text-white/85 h-auto px-2.5 py-1 rounded-full font-semibold text-xs">
                  {TOTAL_STEPS} étapes
                </Badge>
                <span>·</span>
                <span>Vos réponses sont sauvegardées au fur et à mesure.</span>
              </div>
            </div>

            <AdoptionFormInner cat={cat} onClose={() => setOpen(false)} />
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
