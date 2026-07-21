'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import sharp from 'sharp'
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

function sanitizeFilename(original: string): string {
  const ext = original.lastIndexOf('.')
  const name = ext > 0 ? original.slice(0, ext) : original
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function convertToWebp(file: File): Promise<{ buffer: Buffer; filename: string }> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = await sharp(Buffer.from(arrayBuffer))
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()
  const safeName = sanitizeFilename(file.name)
  const filename = `blog-${safeName}-${Date.now()}.webp`
  return { buffer, filename }
}

const ALLOWED_MIME = new Set([
  'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif',
])

async function uploadFile(file: File): Promise<number> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error('Format non supporté. Formats acceptés : PNG, JPG, WebP, GIF, AVIF.')
  }
  const { buffer, filename } = await convertToWebp(file)

  const blob = new Blob([new Uint8Array(buffer)], { type: 'image/webp' })
  const upload = new FormData()
  upload.append('files', blob, filename)

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

  if (!body.published_date) {
    body.published_date = new Date().toISOString().slice(0, 10)
  }

  const coverFile = formData.get('cover') as File | null
  if (coverFile && coverFile.size > 0) {
    body.cover = await uploadFile(coverFile)
  }

  await strapiPost('/api/blog-posts', body)
  revalidatePath('/admin/blog')
  revalidatePath('/news', 'layout')
  redirect('/admin/blog')
}

export async function updateBlogPost(documentId: string, formData: FormData) {
  await requireAdmin()
  const body: Record<string, unknown> = parseBlogFormData(formData)

  const coverFile = formData.get('cover') as File | null
  if (coverFile && coverFile.size > 0) {
    body.cover = await uploadFile(coverFile)
  }

  const slug = (body.slug as string) || ''
  await strapiPut(`/api/blog-posts/${documentId}`, body)
  revalidatePath('/admin/blog')
  revalidatePath('/news', 'layout')
  if (slug) revalidatePath(`/news/${slug}`)
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
  revalidatePath('/news', 'layout')
  redirect('/admin/blog')
}

export async function deleteBlogPost(documentId: string) {
  await requireAdmin()
  await strapiDelete(`/api/blog-posts/${documentId}`)
  revalidatePath('/admin/blog')
  revalidatePath('/news', 'layout')
  redirect('/admin/blog')
}
