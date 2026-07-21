'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'

function parseDistributionFormData(formData: FormData) {
  return {
    date:       formData.get('date') as string,
    location:   formData.get('location') as string,
    status:     formData.get('status') as string,
    notes:      (formData.get('notes') as string) || null,
    volunteers: formData.getAll('volunteer_ids').map(Number),
  }
}

export async function createDistribution(formData: FormData) {
  await requireAdmin()
  await strapiPost('/api/distributions', parseDistributionFormData(formData))
  revalidatePath('/admin/distributions')
  redirect('/admin/distributions')
}

export async function updateDistribution(documentId: string, formData: FormData) {
  await requireAdmin()
  await strapiPut(`/api/distributions/${documentId}`, parseDistributionFormData(formData))
  revalidatePath('/admin/distributions')
  redirect('/admin/distributions')
}

export async function deleteDistribution(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/distributions/${documentId}`)
  revalidatePath('/admin/distributions')
  redirect('/admin/distributions')
}
