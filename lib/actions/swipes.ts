"use server"

import { getCurrentUser } from '@/lib/auth'
import { postSwipe, type SwipeDirection } from '@/lib/strapi'

export async function recordSwipe(
  animalDocumentId: string,
  direction: SwipeDirection
): Promise<{ success: boolean }> {
  const user = await getCurrentUser()
  if (!user) return { success: false }

  await postSwipe(user.id, animalDocumentId, direction)
  return { success: true }
}
