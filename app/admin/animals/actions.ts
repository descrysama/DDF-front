'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'

function parseAnimalFormData(formData: FormData) {
  return {
    name:             formData.get('name') as string,
    age:              Number(formData.get('age')),
    gender:           formData.get('gender') as string,
    description:      formData.get('description') as string | null,
    status:           formData.get('status') as string,
    activity_level:   formData.get('activity_level') as string,
    ok_with_children: formData.get('ok_with_children') === 'on',
    ok_with_dogs:     formData.get('ok_with_dogs') === 'on',
    ok_with_cats:     formData.get('ok_with_cats') === 'on',
    indoor_only:      formData.get('indoor_only') === 'on',
  }
}

export async function createAnimal(formData: FormData) {
  await strapiPost('/api/animals', parseAnimalFormData(formData))
  revalidatePath('/admin/animals')
  redirect('/admin/animals')
}

export async function updateAnimal(documentId: string, formData: FormData) {
  await strapiPut(`/api/animals/${documentId}`, parseAnimalFormData(formData))
  revalidatePath('/admin/animals')
  redirect('/admin/animals')
}

export async function deleteAnimal(documentId: string) {
  await strapiDelete(`/api/animals/${documentId}`)
  revalidatePath('/admin/animals')
  redirect('/admin/animals')
}
