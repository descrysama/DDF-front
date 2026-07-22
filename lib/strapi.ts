import { STRAPI_URL, STRAPI_TOKEN, strapiAuthHeaders } from './config'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnimalStatus = 'available' | 'in_foster' | 'reserved' | 'adopted'
export type AnimalGender = 'male' | 'female'
export type AnimalActivity = 'low' | 'medium' | 'high'

export const ACTIVITY_LABEL: Record<AnimalActivity, string> = {
  low: 'Calme',
  medium: 'Modéré',
  high: 'Très actif',
}

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

export interface StrapiBreed {
  id: number
  documentId: string
  name: string
  species: string
}

export interface StrapiCharacter {
  id: number
  documentId: string
  name: string
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
  vaccinated: boolean
  sterilized: boolean
  identified: boolean
  dewormed: boolean
  breed: StrapiBreed | null
  characters: StrapiCharacter[]
  bonded_with: StrapiAnimalRaw | null
  medias?: StrapiMedia[]
  video_url?: string | null
  trap_date?: string | null
  medical_history?: StrapiMedicalEvent[]
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
  characters: string[]
  activityLevel: AnimalActivity | null
  okWithChildren: boolean
  okWithDogs: boolean
  okWithCats: boolean
  indoorOnly: boolean
  vaccinated: boolean
  sterilized: boolean
  identified: boolean
  dewormed: boolean
  medicalHistory: StrapiMedicalEvent[]
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
    characters: (a.characters ?? []).map((c) => c.name),
    activityLevel: a.activity_level ?? null,
    okWithChildren: a.ok_with_children,
    okWithDogs: a.ok_with_dogs,
    okWithCats: a.ok_with_cats,
    indoorOnly: a.indoor_only,
    vaccinated: a.vaccinated,
    sterilized: a.sterilized,
    identified: a.identified,
    dewormed: a.dewormed,
    medicalHistory: [...(a.medical_history ?? [])].sort((x, y) => y.event_date.localeCompare(x.event_date)),
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

export type AnimalCategoryFilter = 'Chaton' | 'Adulte' | 'Senior' | 'Duo'

// Mirrors deriveTag()'s precedence (bonded_with > senior > kitten > adult) as
// Strapi filters, so admin's "Catégorie" filter matches the same raw fields
// the table's own "Catégorie" column is computed from.
function categoryFilterQuery(category?: AnimalCategoryFilter): string {
  switch (category) {
    case 'Duo':
      return '&filters[bonded_with][id][$notNull]=true'
    case 'Senior':
      return '&filters[bonded_with][id][$null]=true&filters[age][$gte]=10'
    case 'Chaton':
      return '&filters[bonded_with][id][$null]=true&filters[age][$lte]=1'
    case 'Adulte':
      return '&filters[bonded_with][id][$null]=true&filters[age][$gt]=1&filters[age][$lt]=10'
    default:
      return ''
  }
}

export async function fetchAnimals(opts?: {
  limit?: number
  excludeStatus?: AnimalStatus
  search?: string
  page?: number
  status?: AnimalStatus
  category?: AnimalCategoryFilter
}): Promise<{ animals: CardAnimal[]; total: number; page: number; pageCount: number }> {
  const limit = opts?.limit ?? 25
  const page = opts?.page && opts.page > 0 ? opts.page : 1
  const exclude = opts?.excludeStatus
  const search = opts?.search?.trim()
  const filter = exclude ? `&filters[status][$ne]=${exclude}` : ''
  const searchFilter = search ? `&filters[name][$containsi]=${encodeURIComponent(search)}` : ''
  const statusFilter = opts?.status ? `&filters[status][$eq]=${opts.status}` : ''
  const categoryFilter = categoryFilterQuery(opts?.category)

  const { data, meta } = await strapiGet<StrapiListResponse<StrapiAnimalRaw>>(
    `/api/animals?populate[breed]=true&populate[bonded_with]=true&populate[characters]=true&populate[medias][populate]=image&pagination[pageSize]=${limit}&pagination[page]=${page}${filter}${searchFilter}${statusFilter}${categoryFilter}`
  )
  return {
    animals: data.map(toCardAnimal),
    total: meta.pagination.total,
    page: meta.pagination.page,
    pageCount: meta.pagination.pageCount,
  }
}

// Animals with no referent yet — surfaced to bénévoles so they can self-assign
// instead of waiting on an admin to hand them one.
export async function fetchUnassignedAnimals(opts?: {
  limit?: number
}): Promise<{ animals: CardAnimal[]; total: number }> {
  const limit = opts?.limit ?? 100
  const { data, meta } = await strapiGet<StrapiListResponse<StrapiAnimalRaw>>(
    `/api/animals?populate[0]=breed&populate[1]=bonded_with&populate[medias][populate]=image&filters[referent][id][$null]=true&pagination[pageSize]=${limit}`
  )
  return {
    animals: data.map(toCardAnimal),
    total: meta.pagination.total,
  }
}

export interface MyAnimalAssignment extends CardAnimal {
  role: 'referent' | 'co-referent'
}

// Animals a given user is responsible for, as referent or backup referent —
// backs the "Mes chats" bénévole panel.
export async function fetchMyAnimals(userId: number): Promise<{ animals: MyAnimalAssignment[]; total: number }> {
  const params = new URLSearchParams({
    'populate[breed]': 'true',
    'populate[bonded_with]': 'true',
    'populate[medias][populate]': 'image',
    'populate[referent]': 'true',
    'populate[backup_referents]': 'true',
    'pagination[pageSize]': '100',
  })
  params.set('filters[$or][0][referent][id][$eq]', String(userId))
  params.set('filters[$or][1][backup_referents][id][$eq]', String(userId))

  const { data, meta } = await strapiGet<
    StrapiListResponse<
      StrapiAnimalRaw & { referent?: { id: number } | null; backup_referents?: { id: number }[] }
    >
  >(`/api/animals?${params.toString()}`)

  const animals = data.map((a) => ({
    ...toCardAnimal(a),
    role: (a.referent?.id === userId ? 'referent' : 'co-referent') as 'referent' | 'co-referent',
  }))
  return { animals, total: meta.pagination.total }
}

export async function fetchAnimal(documentId: string): Promise<CardAnimal | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/animals/${documentId}?populate[breed]=true&populate[bonded_with]=true&populate[characters]=true&populate[medias][populate]=image&populate[medical_history]=true`,
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

// ─── Blog types ──────────────────────────────────────────────────────────

export interface StrapiBlogPostRaw {
  id: number
  documentId: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  author_name: string | null
  published_date: string | null
  cover: StrapiImageFile | null
  tags?: { id: number; name: string }[]
}

export interface BlogPostCard {
  documentId: string
  title: string
  slug: string
  excerpt: string | null
  authorName: string
  publishedDate: string | null
  coverUrl: string | null
  tags: string[]
}

export interface BlogPostFull extends BlogPostCard {
  content: string
}

function toBlogPostCard(raw: StrapiBlogPostRaw): BlogPostCard {
  return {
    documentId: raw.documentId,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    authorName: raw.author_name ?? 'Sans Croquettes Fixes',
    publishedDate: raw.published_date,
    coverUrl: mediaUrl(raw.cover),
    tags: (raw.tags ?? []).map((t) => t.name),
  }
}

function toBlogPostFull(raw: StrapiBlogPostRaw): BlogPostFull {
  return {
    ...toBlogPostCard(raw),
    content: raw.content,
  }
}

export async function fetchBlogPosts(opts?: {
  limit?: number
}): Promise<{ posts: BlogPostCard[]; total: number }> {
  const limit = opts?.limit ?? 25
  const { data, meta } = await strapiGet<StrapiListResponse<StrapiBlogPostRaw>>(
    `/api/blog-posts?populate=cover&populate=tags&sort=published_date:desc&pagination[pageSize]=${limit}`
  )
  return {
    posts: data.map(toBlogPostCard),
    total: meta.pagination.total,
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  const { data } = await strapiGet<StrapiListResponse<StrapiBlogPostRaw>>(
    `/api/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=cover&populate=tags`
  )
  if (data.length === 0) return null
  return toBlogPostFull(data[0])
}

export async function fetchBlogPostsAdmin(opts?: {
  limit?: number
}): Promise<{ posts: BlogPostCard[]; total: number }> {
  const limit = opts?.limit ?? 100
  const { data, meta } = await strapiGet<StrapiListResponse<StrapiBlogPostRaw>>(
    `/api/blog-posts?populate=cover&populate=tags&sort=published_date:desc&pagination[pageSize]=${limit}&status=draft`
  )
  const { data: pubData, meta: pubMeta } = await strapiGet<StrapiListResponse<StrapiBlogPostRaw>>(
    `/api/blog-posts?populate=cover&populate=tags&sort=published_date:desc&pagination[pageSize]=${limit}`
  )
  const allMap = new Map<string, StrapiBlogPostRaw>()
  for (const p of [...pubData, ...data]) allMap.set(p.documentId, p)
  const all = Array.from(allMap.values())
  return {
    posts: all.map(toBlogPostCard),
    total: all.length,
  }
}

export async function fetchBlogPostAdmin(documentId: string): Promise<StrapiBlogPostRaw | null> {
  try {
    const { data } = await strapiGet<{ data: StrapiBlogPostRaw }>(
      `/api/blog-posts/${documentId}?populate=cover&populate=tags&status=draft`
    )
    return data
  } catch {
    try {
      const { data } = await strapiGet<{ data: StrapiBlogPostRaw }>(
        `/api/blog-posts/${documentId}?populate=cover&populate=tags`
      )
      return data
    } catch {
      return null
    }
  }
}

// ─── About page ───────────────────────────────────────────────────────────────

interface StrapiAboutPageRaw {
  id: number
  hero_photo: StrapiImageFile | null
  hero_caption: string | null
}

export interface AboutPageContent {
  heroPhotoUrl: string | null
  heroCaption: string | null
}

export async function fetchAboutPage(): Promise<AboutPageContent> {
  const { data } = await strapiGet<{ data: StrapiAboutPageRaw | null }>(
    '/api/about-page?populate=hero_photo'
  )
  return {
    heroPhotoUrl: mediaUrl(data?.hero_photo),
    heroCaption: data?.hero_caption ?? null,
  }
}

interface StrapiTeamMemberRaw {
  id: number
  documentId: string
  name: string
  role: string
  photo: StrapiImageFile | null
}

export interface TeamMember {
  id: string
  name: string
  role: string
  photoUrl: string | null
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data } = await strapiGet<StrapiListResponse<StrapiTeamMemberRaw>>(
    '/api/team-members?populate=photo&sort=order:asc'
  )
  return data.map((m) => ({
    id: m.documentId,
    name: m.name,
    role: m.role,
    photoUrl: mediaUrl(m.photo),
  }))
}

interface StrapiPartnerRaw {
  id: number
  documentId: string
  name: string
  logo: StrapiImageFile | null
}

export interface Partner {
  id: string
  name: string
  logoUrl: string | null
}

export async function fetchPartners(): Promise<Partner[]> {
  const { data } = await strapiGet<StrapiListResponse<StrapiPartnerRaw>>(
    '/api/partners?populate=logo&sort=order:asc'
  )
  return data.map((p) => ({
    id: p.documentId,
    name: p.name,
    logoUrl: mediaUrl(p.logo),
  }))
}

interface StrapiSocialLinkRaw {
  id: number
  documentId: string
  label: string
  url: string
  icon: StrapiImageFile | null
}

export interface SocialLink {
  id: string
  label: string
  url: string
  iconUrl: string | null
}

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const { data } = await strapiGet<StrapiListResponse<StrapiSocialLinkRaw>>(
    '/api/social-links?populate=icon&sort=order:asc'
  )
  return data.map((s) => ({
    id: s.documentId,
    label: s.label,
    url: s.url,
    iconUrl: mediaUrl(s.icon),
  }))
}

// ─── Admin types ──────────────────────────────────────────────────────────────

export type AnnouncementStatus = 'open' | 'closed' | 'draft'
export type AdoptionRequestStatus = 'pending' | 'in_progress' | 'approved' | 'rejected'

export interface StrapiAnnouncementRaw {
  id: number
  documentId: string
  title: string
  description: string | null
  status: AnnouncementStatus
  animals?: StrapiAnimalRaw[]
  tags?: { id: number; name: string }[]
}

export interface StrapiFosterAssignmentRaw {
  id: number
  documentId: string
  status: 'active' | 'completed'
  start_date: string | null
  end_date: string | null
  animal: { id: number; documentId: string; name: string; status: AnimalStatus } | null
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
  user?: { id: number; username: string; email: string }
  foster_assignments?: StrapiFosterAssignmentRaw[]
}

export interface AdoptionApplicant {
  animal_name?: string
  first_name?: string
  last_name?: string
  birth_date?: string
  address?: string
  postal_code?: string
  city?: string
  phone?: string
  email?: string
}

export interface AdoptionHousehold {
  composition?: string
  roommates_count?: string
  has_children?: boolean
  children_count?: string
  children_ages?: string
  household_agrees?: boolean
  disagreement_who?: string
  disagreement_why?: string
}

export interface AdoptionEmployment {
  employed?: boolean
  profession?: string
  work_hours?: string
  hours_alone_per_day?: string
}

export interface AdoptionApartment {
  floor?: string
  windows_secured?: string
  plans_to_secure_windows?: string
}

export interface AdoptionHousing {
  type?: string
  surface_area?: string
  animal_environment?: string
  area_type?: string
  busy_road_nearby?: string
  outdoor_access_allowed?: string
  apartment?: AdoptionApartment | null
}

export interface AdoptionGarden {
  has_garden?: boolean
  description?: string
  surface_area?: string
  fenced?: boolean
  fence_height?: string
}

export interface AdoptionBalcony {
  has_balcony?: boolean
  surface_area?: string
  secured?: string
}

export interface AdoptionOutdoor {
  garden?: AdoptionGarden | null
  balcony?: AdoptionBalcony | null
}

export interface AdoptionOtherPets {
  has_other_pets?: boolean
  details?: string
  sterilized?: string
  owned_since?: string
}

export interface StrapiAdoptionRequestRaw {
  id: number
  documentId: string
  message: string | null
  status: AdoptionRequestStatus
  match_score: number | null
  request_date: string | null
  adoption_process_agreement: boolean | null
  applicant: AdoptionApplicant | null
  household: AdoptionHousehold | null
  employment: AdoptionEmployment | null
  housing: AdoptionHousing | null
  outdoor: AdoptionOutdoor | null
  other_pets: AdoptionOtherPets | null
  remarks: string | null
  responsibility_agreement: boolean | null
  announcement?: { id: number; documentId: string; title: string }
  animal?: {
    id: number
    documentId: string
    name: string
    referent?: { id: number; username: string } | null
    backup_referents?: { id: number; username: string }[]
  }
  adopter?: { username: string; email: string }
  referent?: { username: string }
}

// ─── Adopter profile ────────────────────────────────────────────────────────

export type AdopterHousingType = 'house' | 'apartment'
export type AdopterExperience = 'none' | 'some' | 'experienced'
export type AdopterAgePreference = 'chaton' | 'adulte' | 'senior' | 'peu_importe'
export type AdopterActivityPreference = AnimalActivity | 'peu_importe'

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
  activity_level_preference: AdopterActivityPreference
  motivation: string | null
}

export interface MyAdoptionRequest {
  documentId: string
  status: AdoptionRequestStatus
  requestDate: string | null
  matchScore: number | null
  animal: CardAnimal | null
}

// The public-facing counterpart to the admin fetchAdoptionRequests: what a
// logged-in adoptant sees of their own requests on "Mes demandes" / /profile.
export async function fetchMyAdoptionRequests(userId: number): Promise<MyAdoptionRequest[]> {
  const params = new URLSearchParams({
    'filters[adopter][id][$eq]': String(userId),
    'populate[animal][populate][breed]': 'true',
    'populate[animal][populate][bonded_with]': 'true',
    'populate[animal][populate][medias][populate]': 'image',
    sort: 'createdAt:desc',
    'pagination[pageSize]': '100',
  })
  const { data } = await strapiGet<
    StrapiListResponse<{
      documentId: string
      status: AdoptionRequestStatus
      request_date: string | null
      match_score: number | null
      animal: StrapiAnimalRaw | null
    }>
  >(`/api/adoption-requests?${params.toString()}`)

  return data.map((r) => ({
    documentId: r.documentId,
    status: r.status,
    requestDate: r.request_date,
    matchScore: r.match_score,
    animal: r.animal ? toCardAnimal(r.animal) : null,
  }))
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
  token: string,
  opts?: { limit?: number }
): Promise<DiscoverAnimal[]> {
  const limit = opts?.limit ?? 30
  const res = await fetch(
    `${STRAPI_URL}/api/animal-discovery?limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`Strapi ${res.status}: /api/animal-discovery`)

  const { data } = (await res.json()) as {
    data: (StrapiAnimalRaw & { compatibility: number | null })[]
  }
  return data.map((a) => ({ ...toCardAnimal(a), compatibility: a.compatibility }))
}

export async function postSwipe(
  token: string,
  animalDocumentId: string,
  direction: SwipeDirection
): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/swipes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { animal: animalDocumentId, direction } }),
  })
  if (!res.ok) throw new Error(`Strapi ${res.status}: /api/swipes`)
}

export async function fetchCompatibility(animalDocumentId: string, token: string): Promise<number | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/animals/${animalDocumentId}/compatibility`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
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

export interface FosterPickerAnimal {
  id: number
  documentId: string
  name: string
  status: AnimalStatus
}

export async function fetchAnimalsForFosterPicker(
  excludeFamilyDocumentId?: string
): Promise<FosterPickerAnimal[]> {
  const { data: animals } = await strapiGet<{ data: FosterPickerAnimal[] }>(
    '/api/animals?filters[status][$in][0]=available&filters[status][$in][1]=in_foster' +
      '&fields[0]=name&fields[1]=status&pagination[pageSize]=200'
  )

  const { data: activeAssignments } = await strapiGet<{
    data: { animal: { id: number } | null; foster_family: { documentId: string } | null }[]
  }>(
    '/api/foster-assignments?filters[status][$eq]=active' +
      '&populate[0]=animal&populate[1]=foster_family&pagination[pageSize]=200'
  )

  const hostedElsewhere = new Set(
    activeAssignments
      .filter((a) => a.animal && a.foster_family && a.foster_family.documentId !== excludeFamilyDocumentId)
      .map((a) => a.animal!.id)
  )

  return animals.filter((a) => !hostedElsewhere.has(a.id))
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
  // Scopes results to requests whose animal has this user as referent or
  // backup referent — used for the "Membre" (bénévole) restricted view.
  referentUserId?: number
  // Narrows further to a single animal (e.g. "Voir ses demandes" from Mes chats).
  animalDocumentId?: string
}): Promise<{ adoptionRequests: StrapiAdoptionRequestRaw[]; total: number }> {
  const limit = opts?.limit ?? 100
  const params = new URLSearchParams({
    'populate[announcement]': 'true',
    'populate[adopter]': 'true',
    'populate[referent]': 'true',
    'populate[animal][populate][referent]': 'true',
    'populate[animal][populate][backup_referents]': 'true',
    'pagination[pageSize]': String(limit),
  })
  if (opts?.referentUserId) {
    params.set('filters[$or][0][animal][referent][id][$eq]', String(opts.referentUserId))
    params.set('filters[$or][1][animal][backup_referents][id][$eq]', String(opts.referentUserId))
  }
  if (opts?.animalDocumentId) {
    params.set('filters[animal][documentId][$eq]', opts.animalDocumentId)
  }
  const { data, meta } = await strapiGet<StrapiListResponse<StrapiAdoptionRequestRaw>>(
    `/api/adoption-requests?${params.toString()}`
  )
  return { adoptionRequests: data, total: meta.pagination.total }
}

export interface StrapiRole {
  id: number
  name: string
  type: string
}

export interface StrapiUser {
  id: number
  username: string
  email: string
  createdAt?: string
  role?: StrapiRole
}

// NB: /api/users is the users-permissions controller, not the content API. It
// ignores `pagination[pageSize]` and honours `start`/`limit` instead — verified
// against the running Strapi. Using the wrong param silently caps the list at 25.
export async function fetchUsers(): Promise<StrapiUser[]> {
  return strapiGet<StrapiUser[]>('/api/users?populate=role&sort=createdAt:desc&limit=200')
}

export async function fetchRoles(): Promise<StrapiRole[]> {
  const { roles } = await strapiGet<{ roles: StrapiRole[] }>('/api/users-permissions/roles')
  return roles
}

// Hits the custom /role endpoint from the backend's users-permissions extension,
// not the stock PUT /api/users/:id — that one is deliberately scoped to "your own
// account only", so an admin editing someone else gets a 403. The custom route
// writes the role relation and nothing else. Flat body: this is a plugin route,
// so no { data } envelope (which is also why strapiPut can't be reused here).
export async function updateUserRole(userId: number, roleId: number): Promise<void> {
  const res = await fetch(`${STRAPI_URL}/api/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      ...strapiAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: roleId }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Strapi ${res.status} PUT /api/users/${userId}/role: ${detail}`)
  }
}

// `foster-family.user` is a oneToOne relation: a user already linked to another
// family must not show up as pickable, or saving would silently steal the link.
export async function fetchUsersForFosterPicker(excludeFamilyDocumentId?: string): Promise<StrapiUser[]> {
  const [users, { data: families }] = await Promise.all([
    strapiGet<StrapiUser[]>('/api/users'),
    strapiGet<{ data: { documentId: string; user: { id: number } | null }[] }>(
      '/api/foster-families?populate[0]=user&pagination[pageSize]=200'
    ),
  ])

  const linkedElsewhere = new Set(
    families
      .filter((f) => f.user && f.documentId !== excludeFamilyDocumentId)
      .map((f) => f.user!.id)
  )

  return users.filter((u) => !linkedElsewhere.has(u.id))
}

export async function fetchBreeds(): Promise<StrapiBreed[]> {
  const { data } = await strapiGet<{ data: StrapiBreed[] }>('/api/breeds?pagination[pageSize]=200')
  return data
}

export async function fetchCharacters(): Promise<StrapiCharacter[]> {
  const { data } = await strapiGet<{ data: StrapiCharacter[] }>('/api/characters?pagination[pageSize]=200')
  return data
}

// ─── Distributions ────────────────────────────────────────────────────────────

export type DistributionStatus = 'planned' | 'completed' | 'cancelled'

export interface StrapiDistributionRaw {
  id: number
  documentId: string
  date: string
  location: string
  status: DistributionStatus
  notes: string | null
  volunteers?: StrapiUser[]
}

export async function fetchDistributions(opts?: {
  limit?: number
}): Promise<{ distributions: StrapiDistributionRaw[]; total: number }> {
  const limit = opts?.limit ?? 100
  const { data, meta } = await strapiGet<StrapiListResponse<StrapiDistributionRaw>>(
    `/api/distributions?populate[0]=volunteers&sort=date:desc&pagination[pageSize]=${limit}`
  )
  return { distributions: data, total: meta.pagination.total }
}

export async function fetchNextDistribution(): Promise<StrapiDistributionRaw | null> {
  // UTC date, not local — near midnight in France this can be off by one day.
  // Acceptable for a "what's next" sidebar widget at this app's scale.
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await strapiGet<StrapiListResponse<StrapiDistributionRaw>>(
    `/api/distributions?filters[status][$eq]=planned&filters[date][$gte]=${today}&sort=date:asc&populate[0]=volunteers&pagination[pageSize]=1`
  )
  return data[0] ?? null
}
