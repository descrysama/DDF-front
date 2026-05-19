import Link from 'next/link'
import AnimalForm from '@/components/admin/animal-form'
import { createAnimal } from '../actions'
import { ADMIN } from '@/lib/admin-tokens'

export default function NewAnimalPage() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/animals"
          style={{ fontSize: 13, color: ADMIN.inkMuted, textDecoration: 'none' }}
        >
          ← Retour aux animaux
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: ADMIN.ink, marginBottom: 24 }}>
        Ajouter un animal
      </h1>
      <div
        style={{
          background: ADMIN.card,
          border: `1px solid ${ADMIN.border}`,
          borderRadius: 10,
          padding: 28,
        }}
      >
        <AnimalForm action={createAnimal} />
      </div>
    </div>
  )
}
