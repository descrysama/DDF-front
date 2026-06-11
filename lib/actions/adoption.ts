"use server"

const STRAPI_URL   = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? ''

export interface AdoptionFormData {
  catId: string
  catName: string
  // Section 1 — Vous
  prenom: string
  nom: string
  email: string
  telephone: string
  codePostal: string
  ville: string
  age?: string
  profession?: string
  // Section 2 — Foyer
  typeLogement: string
  surface: string
  accesExterieur: string
  compositionFoyer: string
  autresAnimaux: string
  statutLogement: string
  personnesFoyer: string
  // Section 3 — Le chat
  experienceChat: string
  pourquoiCeChat: string
  veterinaire?: string
  disponibilite: string
  // Section 4 — Engagements
  engagements: boolean[]
}

export type AdoptionResult = { success: true } | { success: false; error: string }

export async function submitAdoptionRequest(data: AdoptionFormData): Promise<AdoptionResult> {
  const message = JSON.stringify({
    cat: { id: data.catId, name: data.catName },
    candidat: {
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      telephone: data.telephone,
      codePostal: data.codePostal,
      ville: data.ville,
      age: data.age,
      profession: data.profession,
    },
    foyer: {
      typeLogement: data.typeLogement,
      surface: data.surface,
      accesExterieur: data.accesExterieur,
      compositionFoyer: data.compositionFoyer,
      autresAnimaux: data.autresAnimaux,
      statutLogement: data.statutLogement,
      personnesFoyer: data.personnesFoyer,
    },
    chat: {
      experienceChat: data.experienceChat,
      pourquoiCeChat: data.pourquoiCeChat,
      veterinaire: data.veterinaire,
      disponibilite: data.disponibilite,
    },
    engagements: data.engagements,
  }, null, 2)

  const res = await fetch(`${STRAPI_URL}/api/adoption-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
    },
    body: JSON.stringify({
      data: {
        message,
        request_date: new Date().toISOString().split('T')[0],
        status: 'pending',
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { success: false, error: `Strapi ${res.status}: ${text.slice(0, 200)}` }
  }

  return { success: true }
}
