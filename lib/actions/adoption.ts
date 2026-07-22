"use server"

import { STRAPI_URL, strapiAuthHeaders } from '@/lib/config'
import { getCurrentUser } from '@/lib/auth'

export interface AdoptionFormData {
  catId: string
  adoption_process_agreement: boolean
  applicant: {
    animal_name: string
    first_name: string
    last_name: string
    birth_date: string
    address: string
    postal_code: string
    city: string
    phone: string
    email: string
  }
  household: {
    composition: string
    roommates_count?: string
    has_children: boolean
    children_count?: string
    children_ages?: string
    household_agrees: boolean
    disagreement_who?: string
    disagreement_why?: string
  }
  employment: {
    employed: boolean
    profession?: string
    work_hours?: string
    hours_alone_per_day: string
  }
  housing: {
    type: string
    surface_area: string
    animal_environment: string
    area_type: string
    busy_road_nearby: string
    outdoor_access_allowed: string
    apartment: { floor: string; windows_secured: string; plans_to_secure_windows: string } | null
  }
  outdoor: {
    garden: {
      has_garden: boolean
      description?: string
      surface_area?: string
      fenced?: boolean
      fence_height?: string
    }
    balcony: {
      has_balcony: boolean
      surface_area?: string
      secured?: string
    }
  }
  other_pets: {
    has_other_pets: boolean
    details?: string
    sterilized?: string
    owned_since?: string
  }
  remarks: string
  responsibility_agreement: boolean
}

export type AdoptionResult = { success: true } | { success: false; error: string }

export async function submitAdoptionRequest(data: AdoptionFormData): Promise<AdoptionResult> {
  const user = await getCurrentUser()

  const res = await fetch(`${STRAPI_URL}/api/adoption-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...strapiAuthHeaders(),
    },
    body: JSON.stringify({
      data: {
        adoption_process_agreement: data.adoption_process_agreement,
        applicant: data.applicant,
        household: data.household,
        employment: data.employment,
        housing: data.housing,
        outdoor: data.outdoor,
        other_pets: data.other_pets,
        remarks: data.remarks,
        responsibility_agreement: data.responsibility_agreement,
        request_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        animal: data.catId,
        ...(user && { adopter: user.id }),
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { success: false, error: `Strapi ${res.status}: ${text.slice(0, 200)}` }
  }

  return { success: true }
}
