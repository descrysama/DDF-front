import Link from 'next/link'
import { notFound } from 'next/navigation'
import AnimalForm from '@/components/admin/animal-form'
import { fetchResource } from '@/lib/strapi'
import { updateAnimal } from '../actions'
import { ADMIN } from '@/lib/admin-tokens'

interface AnimalDetail {
  id: number
  documentId: string
  name: string
  age: number
  gender: string
  description: string | null
  status: string
  activity_level: string
  ok_with_children: boolean
  ok_with_dogs: boolean
  ok_with_cats: boolean
  indoor_only: boolean
}

export default async function EditAnimalPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  const { documentId } = await params

  let animal: AnimalDetail
  try {
    const res = await fetchResource<AnimalDetail>(
      `/api/animals/${documentId}?populate[0]=breed`
    )
    animal = res.data
  } catch {
    notFound()
  }

  const boundUpdate = updateAnimal.bind(null, documentId)

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
        Modifier : {animal.name}
      </h1>
      <div
        style={{
          background: ADMIN.card,
          border: `1px solid ${ADMIN.border}`,
          borderRadius: 10,
          padding: 28,
        }}
      >
        <AnimalForm defaultValues={animal} action={boundUpdate} />
      </div>
    </div>
  )
}
