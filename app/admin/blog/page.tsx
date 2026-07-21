import { fetchBlogPostsAdmin } from '@/lib/strapi'
import { deleteBlogPost } from './actions'
import PageHeader from '@/components/admin/page-header'
import ActionButtons from '@/components/admin/action-buttons'
import { AD } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'

const GRID_COLS = '2fr 1fr 0.8fr 150px'

export default async function AdminBlogPage() {
  const { posts, total } = await fetchBlogPostsAdmin({ limit: 100 })

  return (
    <div style={{ padding: '28px 32px' }}>
      <PageHeader
        breadcrumb="Admin / Blog"
        title="Blog & actualités"
        subtitle={`${total} article(s) au total`}
        action={{ label: '+ Nouvel article', href: '/admin/blog/new' }}
      />

      <Card className="overflow-hidden hover:translate-y-0">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: GRID_COLS,
            alignItems: 'center',
            background: AD.surfaceAlt,
            padding: '10px 18px',
            gap: 12,
            borderBottom: `1px solid ${AD.border}`,
          }}
        >
          {['Titre', 'Date', 'Statut', 'Actions'].map(col => (
            <div
              key={col}
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: AD.inkMuted,
              }}
            >
              {col}
            </div>
          ))}
        </div>

        {posts.map((post) => (
          <div
            key={post.documentId}
            style={{
              display: 'grid',
              gridTemplateColumns: GRID_COLS,
              alignItems: 'center',
              padding: '12px 18px',
              gap: 12,
              borderBottom: `1px solid ${AD.border}`,
              background: AD.surface,
            }}
          >
            <p style={{ fontSize: 13.5, fontWeight: 600, color: AD.ink, margin: 0 }}>
              {post.title}
            </p>

            <p style={{ fontSize: 12.5, color: AD.inkMuted, margin: 0 }}>
              {post.publishedDate
                ? new Date(post.publishedDate).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })
                : '—'}
            </p>

            <span
              style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 6,
                background: '#E0F0E8',
                color: '#2D6A4F',
                width: 'fit-content',
              }}
            >
              Publié
            </span>

            <ActionButtons
              viewHref={`/news/${post.slug}`}
              editHref={`/admin/blog/${post.documentId}`}
              deleteAction={deleteBlogPost.bind(null, post.documentId)}
            />
          </div>
        ))}

        {posts.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: AD.inkMuted, fontSize: 14 }}>
            Aucun article trouvé.
          </div>
        )}
      </Card>
    </div>
  )
}
