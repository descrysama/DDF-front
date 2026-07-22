import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogPostForm from '@/components/admin/blog-post-form'
import { fetchBlogPostAdmin } from '@/lib/strapi'
import { updateBlogPost } from '../actions'
import { requireAdmin } from '@/lib/auth'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'
import { STRAPI_URL } from '@/lib/config'

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  await requireAdmin()
  const { documentId } = await params

  const post = await fetchBlogPostAdmin(documentId)
  if (!post) notFound()

  const boundUpdate = updateBlogPost.bind(null, documentId)

  const coverUrl = post.cover
    ? `${STRAPI_URL}${post.cover.formats?.medium?.url ?? post.cover.formats?.small?.url ?? post.cover.url}`
    : null

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 20 }}>
        <Link
          href="/admin/blog"
          style={{ fontSize: 13, color: AD.inkMuted, textDecoration: 'none' }}
        >
          &larr; Retour aux articles
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: AD.ink, marginBottom: 24 }}>
        Modifier : {post.title}
      </h1>
      <Card className="p-7 max-w-2xl hover:translate-y-0">
        <BlogPostForm
          defaultValues={{
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            author_name: post.author_name,
            published_date: post.published_date,
            coverUrl,
          }}
          action={boundUpdate}
        />
      </Card>
    </div>
  )
}
