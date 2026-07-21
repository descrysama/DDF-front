'use server'

import { revalidatePath } from 'next/cache'
import { updateUserRole } from '@/lib/strapi'
import { requireAdmin } from '@/lib/auth'

export async function changeUserRole(userId: number, roleId: number) {
  const admin = await requireAdmin()

  // The table disables the select on your own row, but a Server Action is a
  // public endpoint — re-check here so an admin can't lock themselves out of
  // /admin by demoting themselves.
  if (admin.id === userId) {
    throw new Error('Vous ne pouvez pas modifier votre propre rôle.')
  }

  await updateUserRole(userId, roleId)
  revalidatePath('/admin/users')
}
