import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react'
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

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug)
  if (!post) notFound()

  const { posts: recentPosts } = await fetchBlogPosts({ limit: 4 })
  const otherPosts = recentPosts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const readTime = estimateReadTime(post.content)

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        {/* Hero banner with cover image */}
        <div className="relative w-full h-[260px] md:h-[340px] overflow-hidden">
          {post.coverUrl ? (
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-coral-soft to-[#FCE9D9]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#252840]/80 via-[#252840]/30 to-transparent" />

          {/* Content overlaid on hero */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-[1200px] w-full mx-auto px-6 pb-8 md:pb-10">
              {/* Breadcrumb */}
              <div className="text-xs text-white/60 mb-4">
                <Link href="/" className="text-white/60 no-underline hover:text-white">Accueil</Link>
                <span className="mx-2">&mdash;</span>
                <Link href="/news" className="text-white/60 no-underline hover:text-white">Blog</Link>
                <span className="mx-2">&mdash;</span>
                <span className="text-white/80">{post.title}</span>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-white/15 backdrop-blur-sm text-white text-2xs font-semibold px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-h1-sm md:text-h1-md leading-[1.08] tracking-[-0.03em] font-semibold m-0 text-white max-w-[820px]">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="max-w-[1200px] mx-auto px-6 -mt-6 relative z-10 pb-14">
          <div className="flex gap-8 items-start">

            {/* Content card */}
            <div className="flex-1 min-w-0">
              <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
                {/* Meta bar */}
                <div className="flex items-center gap-5 px-8 md:px-10 py-4 border-b border-border bg-surface-alt/50">
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    <div className="w-6 h-6 rounded-full bg-coral-soft flex items-center justify-center">
                      <User size={12} className="text-coral" />
                    </div>
                    <span className="font-semibold text-ink">{post.authorName}</span>
                  </div>
                  {post.publishedDate && (
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <Calendar size={12} className="text-ink-subtle" />
                      {new Date(post.publishedDate).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <Clock size={12} className="text-ink-subtle" />
                    {readTime} min de lecture
                  </div>
                </div>

                {/* Article body */}
                <div className="px-8 md:px-10 py-6 md:py-8">
                  <div className="prose-scf max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Tags footer */}
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2 px-8 md:px-10 py-4 border-t border-border">
                    <Tag size={13} className="text-ink-subtle" />
                    <div className="flex gap-1.5 flex-wrap">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-coral-soft text-coral-ink text-2xs font-semibold px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar — desktop only */}
            <aside className="hidden lg:flex flex-col gap-4 w-[280px] shrink-0 sticky top-24">
              {/* Author card */}
              <div className="bg-surface border border-border rounded-2xl p-5">
                <p className="text-2xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                  À propos de l&apos;auteur
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-coral-soft to-[#FCE9D9] flex items-center justify-center">
                    <User size={20} className="text-coral" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink m-0">{post.authorName}</p>
                    <p className="text-2xs text-ink-muted m-0">Rédacteur</p>
                  </div>
                </div>
              </div>

              {/* Article info card */}
              <div className="bg-surface border border-border rounded-2xl p-5">
                <p className="text-2xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                  Détails
                </p>
                <div className="flex flex-col gap-3">
                  {post.publishedDate && (
                    <div className="flex items-center gap-2.5 text-xs text-ink-muted">
                      <Calendar size={14} className="text-coral shrink-0" />
                      <div>
                        <p className="m-0 font-medium text-ink">
                          {new Date(post.publishedDate).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                        <p className="m-0 text-2xs">Date de publication</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-xs text-ink-muted">
                    <Clock size={14} className="text-coral shrink-0" />
                    <div>
                      <p className="m-0 font-medium text-ink">{readTime} min</p>
                      <p className="m-0 text-2xs">Temps de lecture</p>
                    </div>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex items-start gap-2.5 text-xs text-ink-muted">
                      <Tag size={14} className="text-coral shrink-0 mt-0.5" />
                      <div className="flex gap-1 flex-wrap">
                        {post.tags.map((tag) => (
                          <span key={tag} className="bg-coral-soft text-coral-ink text-2xs font-semibold px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Back link */}
              <Link
                href="/news"
                className="flex items-center gap-2 text-xs font-semibold text-coral no-underline hover:underline px-1"
              >
                <ArrowLeft size={13} />
                Tous les articles
              </Link>

              {/* Related posts */}
              {otherPosts.length > 0 && (
                <div className="bg-surface border border-border rounded-2xl p-5">
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
                          <div className="relative w-16 h-11 rounded-lg overflow-hidden shrink-0">
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
                          <div className="w-16 h-11 rounded-lg bg-surface-alt shrink-0" />
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

          {/* Mobile: author + related (hidden on desktop) */}
          <div className="lg:hidden mt-8">
            <div className="bg-surface border border-border rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-soft to-[#FCE9D9] flex items-center justify-center">
                  <User size={18} className="text-coral" />
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
        </div>
      </main>
      <Footer />
    </div>
  )
}
