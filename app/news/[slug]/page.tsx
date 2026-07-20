import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/strapi'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)
  if (!post) return { title: 'Article introuvable' }
  return {
    title: `${post.title} – Sans Croquettes Fixes`,
    description: post.excerpt ?? `Lisez "${post.title}" sur le blog de Sans Croquettes Fixes.`,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)
  if (!post) notFound()

  const { posts: recentPosts } = await fetchBlogPosts({ limit: 4 })
  const otherPosts = recentPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        <article className="max-w-[1200px] mx-auto px-6 pt-8 pb-14">
          <div className="text-xs text-ink-muted mb-4">
            <Link href="/" className="text-ink-muted no-underline">Accueil</Link>
            <span className="mx-2 text-coral">&mdash;</span>
            <Link href="/news" className="text-ink-muted no-underline">Blog</Link>
            <span className="mx-2 text-coral">&mdash;</span>
            <span className="text-ink">{post.title}</span>
          </div>

          <div className="max-w-[720px]">
            {post.tags.length > 0 && (
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-coral-soft text-coral-ink text-2xs font-semibold px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-h1-sm leading-[1.1] tracking-[-0.03em] font-semibold m-0 mb-3 text-ink">
              {post.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-ink-muted mb-8">
              <span>{post.authorName}</span>
              {post.publishedDate && (
                <>
                  <span className="text-coral">&middot;</span>
                  <span>
                    {new Date(post.publishedDate).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </>
              )}
            </div>
          </div>

          {post.coverUrl && (
            <div className="relative aspect-[2/1] rounded-xl overflow-hidden mb-10 max-w-[900px]">
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="prose-scf max-w-[720px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {otherPosts.length > 0 && (
          <section className="bg-surface-alt py-12">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="text-sm text-coral font-semibold mb-1.5">
                À lire aussi
              </div>
              <h3 className="text-h3 font-semibold tracking-[-0.02em] m-0 mb-5 text-ink">
                D&apos;autres articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {otherPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/news/${p.slug}`}
                    className="bg-surface border border-border rounded-xl overflow-hidden no-underline text-ink transition-shadow hover:shadow-card"
                  >
                    {p.coverUrl ? (
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={p.coverUrl}
                          alt={p.title}
                          fill
                          unoptimized
                          sizes="33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-surface-alt" />
                    )}
                    <div className="p-4">
                      <h4 className="text-[15px] font-semibold tracking-[-0.01em] m-0 mb-1 leading-snug">
                        {p.title}
                      </h4>
                      {p.publishedDate && (
                        <div className="text-2xs text-ink-muted">
                          {new Date(p.publishedDate).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
