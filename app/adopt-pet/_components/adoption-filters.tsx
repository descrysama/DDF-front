"use client"

import { useState, useMemo } from "react"
import { CatCard } from "@/components/cat-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ACTIVITY_LABEL, type CardAnnouncement, type CatTag, type AnimalStatus, type AnimalActivity } from "@/lib/strapi"

type FilterKey = 'Tous' | 'Chaton' | 'Adulte' | 'Senior' | 'Duo' | 'Cas particulier'

const FILTER_TINT: Record<FilterKey, string> = {
  'Tous':             'bg-surface-alt text-ink',
  'Chaton':           'bg-peach text-ink',
  'Adulte':           'bg-pink text-ink',
  'Senior':           'bg-lilac text-ink',
  'Duo':              'bg-mint text-ink',
  'Cas particulier':  'bg-rose text-ink',
}

const STATUS_LABEL: Record<AnimalStatus, string> = {
  available: 'Disponible',
  in_foster: "En famille d'accueil",
  reserved: 'Réservé',
  adopted: 'Adopté',
}

const ALL_BREEDS = 'all-breeds'
const ALL_STATUSES = 'all-statuses'
const ALL_ENERGY = 'all-energy'

function tagMatchesFilter(tag: CatTag, filter: FilterKey): boolean {
  if (filter === 'Tous') return true
  if (filter === 'Adulte') return tag === 'Adulte mâle' || tag === 'Adulte femelle'
  return tag === filter
}

interface Props {
  cats: CardAnnouncement[]
}

export function AdoptionFilters({ cats }: Props) {
  const [active, setActive] = useState<FilterKey>('Tous')
  const [query, setQuery] = useState('')
  const [breed, setBreed] = useState<string>(ALL_BREEDS)
  const [status, setStatus] = useState<AnimalStatus | typeof ALL_STATUSES>(ALL_STATUSES)
  const [energy, setEnergy] = useState<AnimalActivity | typeof ALL_ENERGY>(ALL_ENERGY)

  const filters: { label: FilterKey; count: number }[] = useMemo(() => {
    const all: { label: FilterKey; count: number }[] = [
      { label: 'Tous', count: cats.length },
      { label: 'Chaton', count: cats.filter((c) => c.tag === 'Chaton').length },
      { label: 'Adulte', count: cats.filter((c) => c.tag === 'Adulte mâle' || c.tag === 'Adulte femelle').length },
      { label: 'Senior', count: cats.filter((c) => c.tag === 'Senior').length },
      { label: 'Duo', count: cats.filter((c) => c.tag === 'Duo').length },
      { label: 'Cas particulier', count: cats.filter((c) => c.tag === 'Cas particulier').length },
    ]
    return all.filter((f) => f.count > 0 || f.label === 'Tous')
  }, [cats])

  const breeds = useMemo(() => {
    const names = cats.map((c) => c.breed).filter((b): b is string => Boolean(b))
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b))
  }, [cats])

  const breedItems = useMemo(() => {
    const items: Record<string, string> = { [ALL_BREEDS]: 'Toutes les races' }
    breeds.forEach((b) => { items[b] = b })
    return items
  }, [breeds])

  const statusItems = useMemo(() => ({
    [ALL_STATUSES]: 'Tous les statuts',
    ...STATUS_LABEL,
  }), [])

  const energyItems = useMemo(() => ({
    [ALL_ENERGY]: 'Tous niveaux',
    ...ACTIVITY_LABEL,
  }), [])

  const visible = useMemo(() => {
    return cats.filter((c) => {
      const matchFilter = tagMatchesFilter(c.tag, active)
      const matchSearch = query.trim() === '' || c.name.toLowerCase().includes(query.toLowerCase())
      const matchBreed = breed === ALL_BREEDS || c.breed === breed
      const matchStatus = status === ALL_STATUSES || c.status === status
      const matchEnergy = energy === ALL_ENERGY || c.activityLevel === energy
      return matchFilter && matchSearch && matchBreed && matchStatus && matchEnergy
    })
  }, [cats, active, query, breed, status, energy])

  return (
    <>
      {/* Filter + search bar */}
      <section className="max-w-[1200px] mx-auto px-6 pt-4 pb-7">
        <div className="flex justify-between items-center gap-4 pb-[18px] border-b border-border flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {filters.map((f) => {
              const isActive = f.label === active
              const tintClass = isActive ? 'bg-ink text-white border-ink' : FILTER_TINT[f.label] + ' border-transparent'
              return (
                <Button
                  key={f.label}
                  onClick={() => setActive(f.label)}
                  variant="ghost"
                  className={`h-auto items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold cursor-pointer font-[inherit] ${tintClass}`}
                >
                  {f.label}
                  <Badge
                    variant="ghost"
                    className={`h-auto text-[10px] font-medium px-1.5 py-px rounded-full ${isActive ? 'bg-white/15' : 'bg-ink/10'}`}
                  >
                    {f.count}
                  </Badge>
                </Button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={breed} onValueChange={(v) => v && setBreed(v)} items={breedItems}>
              <SelectTrigger className="h-auto py-1.5 text-xs w-auto"><SelectValue placeholder="Race" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_BREEDS}>Toutes les races</SelectItem>
                {breeds.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(v) => v && setStatus(v as AnimalStatus | typeof ALL_STATUSES)} items={statusItems}>
              <SelectTrigger className="h-auto py-1.5 text-xs w-auto"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>Tous les statuts</SelectItem>
                {(Object.keys(STATUS_LABEL) as AnimalStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={energy} onValueChange={(v) => v && setEnergy(v as AnimalActivity | typeof ALL_ENERGY)} items={energyItems}>
              <SelectTrigger className="h-auto py-1.5 text-xs w-auto"><SelectValue placeholder="Énergie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ENERGY}>Tous niveaux</SelectItem>
                {(Object.keys(ACTIVITY_LABEL) as AnimalActivity[]).map((a) => (
                  <SelectItem key={a} value={a}>{ACTIVITY_LABEL[a]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un nom"
              className="h-9 w-44 shrink-0 rounded-md border border-border bg-surface px-2.5 text-xs font-[inherit] text-ink outline-none"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1200px] mx-auto px-6 pb-16">
        {visible.length === 0 ? (
          <div className="py-20 text-center text-ink-muted text-sm">
            Aucun chat ne correspond à cette recherche.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {visible.map((cat) => (
              <CatCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
