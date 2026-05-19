const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_TOKEN ?? ''

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

function toCardAnimal(a: StrapiAnimalRaw): CardAnimal {
  const tag = deriveTag(a)
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
    `/api/animals?populate[0]=breed&populate[1]=bonded_with&pagination[pageSize]=${limit}${filter}`
  )
  return {
    animals: data.map(toCardAnimal),
    total: meta.pagination.total,
  }
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
  adopter?: { username: string; email: string }
  referent?: { username: string }
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
