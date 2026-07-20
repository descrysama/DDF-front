import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Calendar, User, ArrowLeft } from 'lucide-react'
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
          {/* Breadcrumb */}
          <div className="text-xs text-ink-muted mb-6">
            <Link href="/" className="text-ink-muted no-underline">Accueil</Link>
            <span className="mx-2 text-coral">&mdash;</span>
            <Link href="/news" className="text-ink-muted no-underline">Blog</Link>
            <span className="mx-2 text-coral">&mdash;</span>
            <span className="text-ink">{post.title}</span>
          </div>

          {/* Cover full width */}
          {post.coverUrl && (
            <div className="relative aspect-[2.5/1] rounded-xl overflow-hidden mb-8">
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-coral-soft text-coral-ink text-2xs font-semibold px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-h1-sm leading-[1.1] tracking-[-0.03em] font-semibold m-0 mb-8 text-ink max-w-[820px]">
            {post.title}
          </h1>

          {/* Two-column layout: content left, sidebar right */}
          <div className="flex gap-10 items-start">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-surface border border-border rounded-xl p-8 md:p-10">
                <div className="prose-scf">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24">
              {/* Author card */}
              <div className="bg-surface border border-border rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-coral-soft flex items-center justify-center">
                    <User size={18} className="text-coral" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink m-0">{post.authorName}</p>
                    <p className="text-2xs text-ink-muted m-0">Auteur</p>
                  </div>
                </div>

                {post.publishedDate && (
                  <div className="flex items-center gap-2 text-xs text-ink-muted pt-3 border-t border-border">
                    <Calendar size={13} className="text-ink-subtle" />
                    <span>
                      {new Date(post.publishedDate).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Back to blog */}
              <Link
                href="/news"
                className="flex items-center gap-2 text-xs font-semibold text-coral no-underline hover:underline px-1"
              >
                <ArrowLeft size={13} />
                Tous les articles
              </Link>

              {/* Other posts in sidebar */}
              {otherPosts.length > 0 && (
                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-2xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                    À lire aussi
                  </p>
                  <div className="flex flex-col gap-3">
                    {otherPosts.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/news/${p.slug}`}
                        className="flex gap-3 items-start no-underline text-ink group"
                      >
                        {p.coverUrl ? (
                          <div className="relative w-16 h-11 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={p.coverUrl}
                              alt={p.title}
                              fill
                              unoptimized
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-11 rounded-md bg-surface-alt shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-snug m-0 group-hover:text-coral transition-colors line-clamp-2">
                            {p.title}
                          </p>
                          {p.publishedDate && (
                            <p className="text-2xs text-ink-muted m-0 mt-0.5">
                              {new Date(p.publishedDate).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'short',
                              })}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Mobile: author + other posts (hidden on desktop) */}
          <div className="lg:hidden mt-10 pt-8 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-coral-soft flex items-center justify-center">
                <User size={16} className="text-coral" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink m-0">{post.authorName}</p>
                {post.publishedDate && (
                  <p className="text-2xs text-ink-muted m-0">
                    {new Date(post.publishedDate).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>

            {otherPosts.length > 0 && (
              <>
                <p className="text-sm text-coral font-semibold mb-3">À lire aussi</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {otherPosts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/news/${p.slug}`}
                      className="bg-surface border border-border rounded-xl overflow-hidden no-underline text-ink"
                    >
                      {p.coverUrl ? (
                        <div className="relative aspect-[16/9]">
                          <Image src={p.coverUrl} alt={p.title} fill unoptimized sizes="33vw" className="object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-surface-alt" />
                      )}
                      <div className="p-3">
                        <p className="text-xs font-semibold m-0 leading-snug">{p.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
