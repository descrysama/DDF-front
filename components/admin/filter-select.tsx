'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const ALL_VALUE = '__all__'

export default function FilterSelect({
  paramName,
  placeholder,
  options,
}: {
  paramName: string
  placeholder: string
  options: { value: string; label: string }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const value = searchParams.get(paramName) ?? ALL_VALUE

  const items: Record<string, string> = { [ALL_VALUE]: placeholder }
  options.forEach((o) => { items[o.value] = o.label })

  function handleChange(next: string | null) {
    if (!next) return
    const params = new URLSearchParams(searchParams.toString())
    if (next === ALL_VALUE) params.delete(paramName)
    else params.set(paramName, next)
    params.delete('page')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <Select value={value} onValueChange={handleChange} items={items}>
      <SelectTrigger className="w-auto min-w-[160px]"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
