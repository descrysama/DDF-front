import Link from 'next/link'
import FosterFamilyForm from '@/components/admin/foster-family-form'
import { createFosterFamily } from '../actions'
import { AD } from '@/lib/admin-tokens'
import { cardStyle } from '@/lib/admin-styles'

export default function NewFosterFamilyPage() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/foster-families"
          style={{ fontSize: 13, color: AD.inkMuted, textDecoration: 'none' }}
        >
          ← Retour aux familles d&apos;accueil
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 24 }}>
        Nouvelle famille d&apos;accueil
      </h1>
      <div style={{ ...cardStyle, padding: 28, maxWidth: 600 }}>
        <FosterFamilyForm action={createFosterFamily} />
      </div>
    </div>
  )
}
