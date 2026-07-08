"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { CatCard } from "@/components/cat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { type CardAnimal, type CatTag } from "@/lib/strapi"

type FilterKey = 'Tous' | 'Chaton' | 'Adulte' | 'Senior' | 'Duo' | 'Cas particulier'

const FILTER_TINT: Record<FilterKey, string> = {
  'Tous':             'bg-surface-alt text-ink',
  'Chaton':           'bg-peach text-ink',
  'Adulte':           'bg-pink text-ink',
  'Senior':           'bg-lilac text-ink',
  'Duo':              'bg-mint text-ink',
  'Cas particulier':  'bg-rose text-ink',
}

function tagMatchesFilter(tag: CatTag, filter: FilterKey): boolean {
  if (filter === 'Tous') return true
  if (filter === 'Adulte') return tag === 'Adulte mâle' || tag === 'Adulte femelle'
  return tag === filter
}

interface Props {
  cats: CardAnimal[]
}

export function AdoptionFilters({ cats }: Props) {
  const [active, setActive] = useState<FilterKey>('Tous')
  const [query, setQuery] = useState('')

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

  const visible = useMemo(() => {
    return cats.filter((c) => {
      const matchFilter = tagMatchesFilter(c.tag, active)
      const matchSearch = query.trim() === '' || c.name.toLowerCase().includes(query.toLowerCase())
      return matchFilter && matchSearch
    })
  }, [cats, active, query])

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

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-surface">
            <Search size={13} className="text-ink-muted shrink-0" />
            <Input
              type="search"
              placeholder="Rechercher un nom"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-auto border-none outline-none bg-transparent text-xs md:text-xs font-[inherit] text-ink w-36 shadow-none px-0 py-0 focus-visible:ring-0 focus-visible:border-none dark:bg-transparent"
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