import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { fetchBlogPosts } from '@/lib/strapi'

export const metadata = {
  title: 'Blog – Sans Croquettes Fixes',
  description: "Actualités, conseils et histoires de l'association Sans Croquettes Fixes.",
}

export default async function NewsPage() {
  const { posts, total } = await fetchBlogPosts({ limit: 50 })

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        <section className="max-w-[1200px] mx-auto px-6 pt-10 pb-5">
          <div className="text-xs text-ink-muted mb-3">
            <Link href="/" className="text-ink-muted no-underline">Accueil</Link>
            <span className="mx-2 text-coral">&mdash;</span>
            <span className="text-ink">Blog</span>
          </div>

          <div className="flex justify-between items-end flex-wrap gap-6">
            <h1 className="text-h1-sm leading-none tracking-[-0.03em] font-semibold m-0 text-ink">
              Nos <span className="text-coral">actualités</span>.
            </h1>
            <div className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">{total} article{total > 1 ? 's' : ''}</span>
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 pb-14">
          {posts.length === 0 ? (
            <p className="text-sm text-ink-muted py-10">Aucun article pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/news/${post.slug}`}
                  className="bg-surface border border-border rounded-xl overflow-hidden no-underline text-ink transition-shadow hover:shadow-card"
                >
                  {post.coverUrl ? (
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={post.coverUrl}
                        alt={post.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-surface-alt flex items-center justify-center">
                      <span className="text-2xs text-ink-muted">Sans Croquettes Fixes</span>
                    </div>
                  )}

                  <div className="p-4">
                    {post.tags.length > 0 && (
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        {post.tags.map((tag) => (
                          <span key={tag} className="bg-coral-soft text-coral-ink text-2xs font-semibold px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-[15px] font-semibold tracking-[-0.01em] m-0 mb-1.5 leading-snug">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-xs text-ink-muted leading-[1.5] m-0 mb-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-2xs text-ink-muted">
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
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
