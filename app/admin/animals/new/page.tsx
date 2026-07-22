import Link from 'next/link'
import AnimalForm from '@/components/admin/animal-form'
import { createAnimal } from '../actions'
import { fetchBreeds, fetchCharacters } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'
import { AD } from '@/lib/admin-tokens'

export default async function NewAnimalPage() {
  await requireAdmin()
  const [breeds, characters] = await Promise.all([fetchBreeds(), fetchCharacters()])
  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/animals"
          style={{ fontSize: 13, color: AD.inkMuted, textDecoration: 'none' }}
        >
          ← Retour aux animaux
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 24 }}>
        Ajouter un animal
      </h1>
      <div
        style={{
          background: AD.surface,
          border: `1px solid ${AD.border}`,
          borderRadius: 10,
          padding: 28,
        }}
      >
        <AnimalForm action={createAnimal} breeds={breeds} characters={characters} />
      </div>
    </div>
  )
}
