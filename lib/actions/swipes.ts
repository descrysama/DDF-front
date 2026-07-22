"use server"

import { getCurrentUser, getAuthToken } from '@/lib/auth'
import { postSwipe, type SwipeDirection } from '@/lib/strapi'

export async function recordSwipe(
  announcementDocumentId: string,
  direction: SwipeDirection
): Promise<{ success: boolean }> {
  const user = await getCurrentUser()
  const token = await getAuthToken()
  if (!user || !token) return { success: false }

  await postSwipe(token, announcementDocumentId, direction)
  return { success: true }
}
