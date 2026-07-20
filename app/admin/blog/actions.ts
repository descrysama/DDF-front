'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { strapiPost, strapiPut, strapiDelete } from '@/lib/strapi'
import { STRAPI_URL, strapiAuthHeaders } from '@/lib/config'
import { requireAdmin } from '@/lib/auth'

const AUTH = strapiAuthHeaders()

function parseBlogFormData(formData: FormData) {
  const publishedDate = formData.get('published_date') as string
  return {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    content: formData.get('content') as string,
    excerpt: (formData.get('excerpt') as string) || null,
    author_name: (formData.get('author_name') as string) || 'Sans Croquettes Fixes',
    published_date: publishedDate || null,
  }
}

async function uploadFile(file: File): Promise<number> {
  const upload = new FormData()
  upload.append('files', file)
  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: AUTH,
    body: upload,
  })
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
  const [uploaded] = await res.json()
  return uploaded.id as number
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin()
  const body: Record<string, unknown> = parseBlogFormData(formData)

  const coverFile = formData.get('cover') as File | null
  if (coverFile && coverFile.size > 0) {
    body.cover = await uploadFile(coverFile)
  }

  await strapiPost('/api/blog-posts', body)
  revalidatePath('/admin/blog')
  revalidatePath('/news')
  redirect('/admin/blog')
}

export async function updateBlogPost(documentId: string, formData: FormData) {
  await requireAdmin()
  const body: Record<string, unknown> = parseBlogFormData(formData)

  const coverFile = formData.get('cover') as File | null
  if (coverFile && coverFile.size > 0) {
    body.cover = await uploadFile(coverFile)
  }

  await strapiPut(`/api/blog-posts/${documentId}`, body)
  revalidatePath('/admin/blog')
  revalidatePath('/news')
  redirect('/admin/blog')
}

export async function publishBlogPost(documentId: string) {
  await requireAdmin()
  const res = await fetch(`${STRAPI_URL}/api/blog-posts/${documentId}/actions/publish`, {
    method: 'POST',
    headers: { ...AUTH, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Publish failed: ${res.status}`)
  revalidatePath('/admin/blog')
  revalidatePath('/news')
  redirect('/admin/blog')
}

export async function deleteBlogPost(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/blog-posts/${documentId}`)
  revalidatePath('/admin/blog')
  revalidatePath('/news')
  redirect('/admin/blog')
}
