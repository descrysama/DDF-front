import { STRAPI_URL, STRAPI_TOKEN } from './config'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnimalStatus = 'available' | 'in_foster' | 'reserved' | 'adopted'
export type AnimalGender = 'male' | 'female'
export type AnimalActivity = 'low' | 'medium' | 'high'

export type CatTag =
  | 'Chaton'
  | 'Adulte mâle'
  | 'Adulte femelle'
  | 'Senior'
  | 'Duo'
  | 'Cas particulier'

export const CAT_TINT: Record<CatTag, string> = {
  'Chaton':          '#FCE9D9',
  'Adulte mâle':     '#FEE6E5',
  'Adulte femelle':  '#FEE6E5',
  'Senior':          '#E8E5F4',
  'Duo':             '#E0F0E8',
  'Cas particulier': '#FDE2EC',
}

interface StrapiBreed {
  id: number
  documentId: string
  name: string
  species: string
}

export interface StrapiImageFile {
  id: number
  documentId: string
  url: string
  width: number | null
  height: number | null
  formats?: Record<string, { url: string; width: number; height: number }>
}

export interface StrapiMedia {
  id: number
  is_cover: boolean
  image: StrapiImageFile | null
}

export type MedicalEventType = 'vaccination' | 'sterilisation' | 'consultation' | 'traitement' | 'autre'

export interface StrapiMedicalEvent {
  id: number
  event_date: string
  event_type: MedicalEventType
  note: string | null
  veterinarian: string | null
}

interface StrapiAnimalRaw {
  id: number
  documentId: string
  name: string
  age: number
  gender: AnimalGender
  description: string | null
  status: AnimalStatus
  activity_level: AnimalActivity
  ok_with_children: boolean
  ok_with_dogs: boolean
  ok_with_cats: boolean
  indoor_only: boolean
  breed: StrapiBreed | null
  bonded_with: StrapiAnimalRaw | null
  medias?: StrapiMedia[]
  video_url?: string | null
  trap_date?: string | null
}

export interface CardAnimalMedia {
  url: string
  isCover: boolean
}

/** Shape consumed by UI components */
export interface CardAnimal {
  id: string          // = documentId, used for href routing
  documentId: string
  name: string
  age: string
  sex: string
  blurb: string
  tag: CatTag
  tagStyle: 'coral' | 'ink'
  tones: [string, string]
  status: AnimalStatus
  photoUrl: string | null
  medias: CardAnimalMedia[]
  videoUrl: string | null
  trapDate: string | null
  breed: string | null
  activityLevel: AnimalActivity | null
  okWithChildren: boolean
  okWithDogs: boolean
  okWithCats: boolean
  indoorOnly: boolean
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

const TONES: [string, string][] = [
  ['#E8C9B3', '#C99879'],
  ['#D9D3C5', '#9D9485'],
  ['#E0AC9C', '#A87968'],
  ['#F1D7C4', '#D3A88C'],
  ['#D9B898', '#A47A55'],
  ['#C6C8CB', '#7E8189'],
  ['#3C3F4E', '#1F2235'],
  ['#C0B095', '#876D52'],
]

function deriveTag(a: StrapiAnimalRaw): CatTag {
  if (a.bonded_with) return 'Duo'
  if (a.age >= 10) return 'Senior'
  if (a.age <= 1) return 'Chaton'
  return a.gender === 'male' ? 'Adulte mâle' : 'Adulte femelle'
}

function formatAge(years: number): string {
  if (years === 0) return '< 1 an'
  return years === 1 ? '1 an' : `${years} ans`
}

function formatSex(a: StrapiAnimalRaw): string {
  if (a.bonded_with) {
    if (a.gender === a.bonded_with.gender) {
      return a.gender === 'male' ? 'Mâles' : 'Femelles'
    }
    return 'Mâle & Femelle'
  }
  return a.gender === 'male' ? 'Mâle' : 'Femelle'
}

function mediaUrl(image: StrapiImageFile | null | undefined): string | null {
  const relPath = image?.formats?.medium?.url ?? image?.formats?.small?.url ?? image?.url ?? null
  return relPath ? `${STRAPI_URL}${relPath}` : null
}

function toCardAnimal(a: StrapiAnimalRaw): CardAnimal {
  const tag = deriveTag(a)
  const medias = (a.medias ?? [])
    .map((m) => ({ url: mediaUrl(m.image), isCover: m.is_cover }))
    .filter((m): m is CardAnimalMedia => Boolean(m.url))
  const cover = medias.find((m) => m.isCover) ?? medias[0] ?? null
  return {
    id: a.documentId,
    documentId: a.documentId,
    name: a.bonded_with ? `${a.name} & ${a.bonded_with.name}` : a.name,
    age: formatAge(a.age),
    sex: formatSex(a),
    blurb: a.description ?? '',
    tag,
    tagStyle: tag === 'Senior' || tag === 'Cas particulier' ? 'ink' : 'coral',
    tones: TONES[a.id % TONES.length],
    status: a.status,
    photoUrl: cover?.url ?? null,
    medias,
    videoUrl: a.video_url ? `${STRAPI_URL}${a.video_url}` : null,
    trapDate: a.trap_date ?? null,
    breed: a.breed?.name ?? null,
    activityLevel: a.activity_level ?? null,
    okWithChildren: a.ok_with_children,
    okWithDogs: a.ok_with_dogs,
    okWithCats: a.ok_with_cats,
    indoorOnly: a.indoor_only,
  }
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function strapiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${path}`)
  return res.json()
}

interface StrapiListResponse<T> {
  data: T[]
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } }
}

export async function fetchAnimals(opts?: {
  limit?: number
  excludeStatus?: AnimalStatus
}): Promise<{ animals: CardAnimal[]; total: number }> {
  const limit = opts?.limit ?? 25
  const exclude = opts?.excludeStatus
  const filter = exclude ? `&filters[status][$ne]=${exclude}` : ''

  const { data, meta } = await strapiGet<StrapiListResponse<StrapiAnimalRaw>>(
    `/api/animals?populate[0]=breed&populate[1]=bonded_with&populate[medias][populate]=image&pagination[pageSize]=${limit}${filter}`
  )
  return {
    animals: data.map(toCardAnimal),
    total: meta.pagination.total,
  }
}

export async function fetchAnimal(documentId: string): Promise<CardAnimal | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/animals/${documentId}?populate[0]=breed&populate[1]=bonded_with&populate[medias][populate]=image`,
    {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      next: { revalidate: 60 },
    }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Strapi ${res.status}: /api/animals/${documentId}`)

  const { data } = (await res.json()) as { data: StrapiAnimalRaw }
  return toCardAnimal(data)
}

// ─── Admin types ──────────────────────────────────────────────────────────────

export type AnnouncementStatus = 'open' | 'closed' | 'draft'
export type AdoptionRequestStatus = 'pending' | 'approved' | 'rejected'

export interface StrapiAnnouncementRaw {
  id: number
  documentId: string
  title: string
  description: string | null
  status: AnnouncementStatus
  animals?: StrapiAnimalRaw[]
  tags?: { id: number; name: string }[]
}

export interface StrapiFosterFamilyRaw {
  id: number
  documentId: string
  address: string
  has_children: boolean
  has_dogs: boolean
  has_cats: boolean
  max_capacity: number
  is_available: boolean
  user?: { username: string; email: string }
  foster_assignments?: { id: number; documentId: string }[]
}

export interface StrapiAdoptionRequestRaw {
  id: number
  documentId: string
  message: string | null
  status: AdoptionRequestStatus
  match_score: number | null
  request_date: string | null
  announcement?: { id: number; documentId: string; title: string }
  animal?: { id: number; documentId: string; name: string }
  adopter?: { username: string; email: string }
  referent?: { username: string }
}

// ─── Adopter profile ────────────────────────────────────────────────────────

export type AdopterHousingType = 'house' | 'apartment'
export type AdopterExperience = 'none' | 'some' | 'experienced'
export type AdopterAgePreference = 'chaton' | 'adulte' | 'senior' | 'peu_importe'

export interface StrapiAdopterProfileRaw {
  id: number
  documentId: string
  housing_type: AdopterHousingType | null
  has_garden: boolean
  has_children: boolean
  has_dogs: boolean
  has_cats: boolean
  experience_level: AdopterExperience
  age_preference: AdopterAgePreference
  motivation: string | null
}

export async function fetchAdopterProfile(userId: number): Promise<StrapiAdopterProfileRaw | null> {
  const { data } = await strapiGet<{ data: StrapiAdopterProfileRaw[] }>(
    `/api/adopter-profiles?filters[user][id][$eq]=${userId}`
  )
  return data[0] ?? null
}

// ─── Swipe / compatibility ("Tinder" discovery) ─────────────────────────────

export type SwipeDirection = 'like' | 'pass'

export interface DiscoverAnimal extends CardAnimal {
  compatibility: number | null
}

export async function fetchDiscoverAnimals(
  userId: number,
  opts?: { limit?: number }
): Promise<DiscoverAnimal[]> {
  const limit = opts?.limit ?? 30
  const res = await fetch(
    `${STRAPI_URL}/api/animal-discovery?limit=${limit}&user=${userId}`,
    { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }, cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`Strapi ${res.status}: /api/animal-discovery`)

  const { data } = (await res.json()) as {
    data: (StrapiAnimalRaw & { compatibility: number | null })[]
  }
  return data.map((a) => ({ ...toCardAnimal(a), compatibility: a.compatibility }))
}

export async function postSwipe(
  userId: number,
  animalDocumentId: string,
  direction: SwipeDirection
): Promise<void> {
  await strapiPost('/api/swipes', { user: userId, animal: animalDocumentId, direction })
}

export async function fetchCompatibility(animalDocumentId: string, userId: number): Promise<number | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/animals/${animalDocumentId}/compatibility?user=${userId}`,
    { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }, cache: 'no-store' }
  )
  if (!res.ok) return null
  const { data } = (await res.json()) as { data: { score: number | null } }
  return data.score
}

export function compatibilityTone(score: number): 'bg-mint' | 'bg-peach' | 'bg-rose' {
  if (score >= 75) return 'bg-mint'
  if (score >= 50) return 'bg-peach'
  return 'bg-rose'
}

// ─── Admin mutation helpers ───────────────────────────────────────────────────

async function strapiMutate<T>(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<T> {
  const opts: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
  }
  if (body !== undefined) opts.body = JSON.stringify({ data: body })

  const res = await fetch(`${STRAPI_URL}${path}`, opts)
  if (!res.ok) throw new Error(`Strapi ${res.status} ${method}: ${path}`)
  if (method === 'DELETE') return undefined as T
  return res.json()
}

export async function strapiPost<T>(path: string, body: unknown): Promise<T> {
  return strapiMutate<T>(path, 'POST', body)
}

export async function strapiPut<T>(path: string, body: unknown): Promise<T> {
  return strapiMutate<T>(path, 'PUT', body)
}

export async function strapiDelete(path: string): Promise<void> {
  return strapiMutate<void>(path, 'DELETE')
}

export async function fetchResource<T>(path: string): Promise<{ data: T }> {
  return strapiGet<{ data: T }>(path)
}

// ─── Admin fetch helpers ──────────────────────────────────────────────────────

export async function fetchAnnouncements(opts?: {
  limit?: number
}): Promise<{ announcements: StrapiAnnouncementRaw[]; total: number }> {
  const limit = opts?.limit ?? 100
  const { data, meta } = await strapiGet<StrapiListResponse<StrapiAnnouncementRaw>>(
    `/api/announcements?pagination[pageSize]=${limit}`
  )
  return { announcements: data, total: meta.pagination.total }
}

export async function fetchFosterFamilies(opts?: {
  limit?: number
}): Promise<{ fosterFamilies: StrapiFosterFamilyRaw[]; total: number }> {
  const limit = opts?.limit ?? 100
  const { data, meta } = await strapiGet<StrapiListResponse<StrapiFosterFamilyRaw>>(
    `/api/foster-families?populate[0]=user&populate[1]=foster_assignments&pagination[pageSize]=${limit}`
  )
  return { fosterFamilies: data, total: meta.pagination.total }
}

export async function fetchAdoptionRequests(opts?: {
  limit?: number
}): Promise<{ adoptionRequests: StrapiAdoptionRequestRaw[]; total: number }> {
  const limit = opts?.limit ?? 100
  const { data, meta } = await strapiGet<StrapiListResponse<StrapiAdoptionRequestRaw>>(
    `/api/adoption-requests?populate[0]=announcement&populate[1]=adopter&populate[2]=referent&pagination[pageSize]=${limit}`
  )
  return { adoptionRequests: data, total: meta.pagination.total }
}

export interface StrapiUser {
  id: number
  username: string
  email: string
}

export async function fetchUsers(): Promise<StrapiUser[]> {
  return strapiGet<StrapiUser[]>('/api/users')
}
