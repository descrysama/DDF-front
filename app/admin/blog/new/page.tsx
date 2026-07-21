import Link from 'next/link'
import BlogPostForm from '@/components/admin/blog-post-form'
import { createBlogPost } from '../actions'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

export default function NewBlogPostPage() {
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
        Nouvel article
      </h1>
      <Card className="p-7 max-w-2xl hover:translate-y-0">
        <BlogPostForm action={createBlogPost} />
      </Card>
    </div>
  )
}
