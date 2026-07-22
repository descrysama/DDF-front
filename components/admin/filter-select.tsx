'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { fieldStyle } from '@/lib/admin-styles'

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
  const value = searchParams.get(paramName) ?? ''

  function handleChange(next: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (next) params.set(paramName, next)
    else params.delete(paramName)
    params.delete('page')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      style={{ ...fieldStyle, width: 'auto', minWidth: 160 }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
