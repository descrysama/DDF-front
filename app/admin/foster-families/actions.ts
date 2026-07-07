'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'

function parseFosterFamilyFormData(formData: FormData) {
  return {
    address:      formData.get('address') as string,
    max_capacity: Number(formData.get('max_capacity')),
    has_children: formData.get('has_children') === 'on',
    has_dogs:     formData.get('has_dogs') === 'on',
    has_cats:     formData.get('has_cats') === 'on',
  }
}

export async function createFosterFamily(formData: FormData) {
  await requireAdmin()
  await strapiPost('/api/foster-families', parseFosterFamilyFormData(formData))
  revalidatePath('/admin/foster-families')
  redirect('/admin/foster-families')
}

export async function updateFosterFamily(documentId: string, formData: FormData) {
  await requireAdmin()
  await strapiPut(`/api/foster-families/${documentId}`, parseFosterFamilyFormData(formData))
  revalidatePath('/admin/foster-families')
  redirect('/admin/foster-families')
}

export async function deleteFosterFamily(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/foster-families/${documentId}`)
  revalidatePath('/admin/foster-families')
  redirect('/admin/foster-families')
}
