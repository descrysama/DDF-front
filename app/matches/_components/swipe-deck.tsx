"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Heart, X, ArrowRight, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogPortal } from "@/components/ui/dialog"
import { compatibilityTone, type DiscoverAnnouncement } from "@/lib/strapi"
import { recordSwipe } from "@/lib/actions/swipes"

const SWIPE_THRESHOLD = 120

function SwipeCard({
  cat,
  isTop,
  onCommit,
}: {
  cat: DiscoverAnnouncement
  isTop: boolean
  onCommit: (direction: "like" | "pass") => void
}) {
  const start = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const [exiting, setExiting] = useState<"like" | "pass" | null>(null)

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!isTop) return
    setDragging(true)
    start.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y })
  }

  function commit(direction: "like" | "pass") {
    setDragging(false)
    setExiting(direction)
    setDrag({ x: direction === "like" ? 700 : -700, y: drag.y })
    window.setTimeout(() => onCommit(direction), 200)
  }

  function onPointerUp() {
    if (!dragging) return
    setDragging(false)
    if (Math.abs(drag.x) > SWIPE_THRESHOLD) {
      commit(drag.x > 0 ? "like" : "pass")
    } else {
      setDrag({ x: 0, y: 0 })
    }
  }

  const rotate = drag.x / 14
  const likeOpacity = Math.min(1, Math.max(0, drag.x / SWIPE_THRESHOLD))
  const passOpacity = Math.min(1, Math.max(0, -drag.x / SWIPE_THRESHOLD))

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`w-full h-full rounded-2xl overflow-hidden border border-border bg-surface shadow-[0_20px_50px_rgba(20,22,38,0.18)] select-none ${
        isTop ? "cursor-grab active:cursor-grabbing touch-none" : ""
      }`}
      style={{
        transform: isTop ? `translate(${drag.x}px, ${drag.y}px) rotate(${rotate}deg)` : undefined,
        transition: exiting ? "transform 200ms ease-out" : dragging ? "none" : "transform 260ms cubic-bezier(0.2,0.8,0.2,1)",
      }}
    >
      <div className="relative w-full h-[64%]">
        {cat.photoUrl ? (
          <Image src={cat.photoUrl} alt={cat.name} fill unoptimized sizes="380px" style={{ objectFit: "cover" }} />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${cat.tones[0]} 0%, ${cat.tones[1]} 100%)` }}
          />
        )}

        {cat.compatibility !== null && (
          <div className={`absolute top-3.5 right-3.5 ${compatibilityTone(cat.compatibility)} text-ink px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
            <Sparkles size={12} />
            {cat.compatibility}% compatible
          </div>
        )}

        {isTop && (
          <>
            <div className="absolute inset-0 flex items-center justify-start pl-6" style={{ opacity: passOpacity }}>
              <span className="border-[3px] border-white text-white text-xl font-bold px-3.5 py-1 rounded-lg -rotate-12" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>
                PASSE
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-end pr-6" style={{ opacity: likeOpacity }}>
              <span className="border-[3px] border-white text-white text-xl font-bold px-3.5 py-1 rounded-lg rotate-12" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>
                J&apos;AIME
              </span>
            </div>
          </>
        )}
      </div>

      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between mb-1 gap-2">
          <span className="text-xl font-semibold tracking-[-0.01em] text-ink">{cat.name}</span>
          <span className="text-xs text-ink-muted shrink-0">{cat.age} · {cat.sex}</span>
        </div>
        <p className="text-sm text-ink-muted leading-[1.5] line-clamp-2 m-0">{cat.blurb}</p>
      </div>
    </div>
  )
}

function MatchOverlay({ cat, onClose }: { cat: DiscoverAnnouncement; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogPortal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 data-open:animate-in data-open:fade-in-0"
          style={{ background: "rgba(20,22,38,0.6)", backdropFilter: "blur(6px)" }}
        />
        <DialogPrimitive.Popup className="fixed inset-0 z-50 flex items-center justify-center px-4 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95">
          <div className="relative w-full max-w-[380px] bg-white rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(20,22,38,0.35)] text-center px-7 py-9">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #F76C70 0%, #E84A77 100%)" }}
            >
              <Heart size={26} className="text-white" fill="white" />
            </div>
            <DialogPrimitive.Title className="text-[22px] font-semibold tracking-[-0.02em] text-ink m-0 mb-2">
              C&apos;est un match !
            </DialogPrimitive.Title>
            <p className="text-sm text-ink-muted leading-[1.55] m-0 mb-6">
              Vous avez eu un coup de cœur pour {cat.name}
              {cat.compatibility !== null && (
                <> · <strong className="text-ink">{cat.compatibility}% compatible</strong></>
              )}
              . Venez voir sa fiche pour en savoir plus.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href={`/adopt-pet/${cat.documentId}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white text-sm font-semibold no-underline"
                style={{ background: "linear-gradient(90deg, #F76C70 0%, #E84A77 100%)" }}
              >
                Voir le chat <ArrowRight size={14} />
              </Link>
              <Button variant="ghost" onClick={onClose} className="text-ink-muted text-sm h-auto hover:bg-transparent">
                Continuer à swiper
              </Button>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}

export function SwipeDeck({ initialCats, hasProfile }: { initialCats: DiscoverAnnouncement[]; hasProfile: boolean }) {
  const [cats] = useState(initialCats)
  const [index, setIndex] = useState(0)
  const [matched, setMatched] = useState<DiscoverAnnouncement | null>(null)
  const [unsaved, setUnsaved] = useState<string[]>([])

  const visible = cats.slice(index, index + 3)
  const current = cats[index]

  /**
   * The card leaves immediately — waiting on the round-trip would make every
   * swipe feel laggy. But a swipe that never reached Strapi is a swipe the
   * deck will serve again tomorrow, so a silent failure gets surfaced rather
   * than swallowed.
   */
  function handleCommit(direction: "like" | "pass") {
    if (!current) return
    const cat = current

    recordSwipe(cat.documentId, direction)
      .then(({ success }) => {
        if (!success) setUnsaved((names) => [...names, cat.name])
      })
      .catch(() => setUnsaved((names) => [...names, cat.name]))

    if (direction === "like") setMatched(cat)
    setIndex((i) => i + 1)
  }

  return (
    <section className="max-w-[400px] mx-auto px-4 py-10">
      <div className="text-center mb-5">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-ink m-0 mb-1">Trouve ton match</h1>
        <p className="text-sm text-ink-muted m-0">Glissez à droite pour un coup de cœur, à gauche pour passer.</p>
      </div>

      {!hasProfile && (
        <Link
          href="/profile"
          className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-lg bg-lilac text-ink text-xs font-medium no-underline"
        >
          <Sparkles size={14} className="shrink-0" />
          Complétez votre profil adoptant pour voir votre compatibilité avec chaque chat.
        </Link>
      )}

      {unsaved.length > 0 && (
        <div
          role="status"
          className="flex items-start gap-2.5 mb-5 px-4 py-3 rounded-lg bg-rose text-ink text-xs font-medium"
        >
          <AlertCircle size={14} className="shrink-0 mt-px" />
          <span>
            {unsaved.length === 1
              ? `Votre swipe sur ${unsaved[0]} n'a pas pu être enregistré.`
              : `${unsaved.length} swipes n'ont pas pu être enregistrés.`}{" "}
            Rechargez la page pour les revoir.
          </span>
        </div>
      )}

      <div className="relative aspect-[3/4] mb-6">
        {visible.length > 0 ? (
          visible.map((cat, i) => (
            <div
              key={cat.documentId}
              className="absolute inset-0"
              style={{
                zIndex: visible.length - i,
                transform: i === 0 ? undefined : `translateY(${i * 8}px) scale(${1 - i * 0.04})`,
                transition: "transform 220ms ease",
              }}
            >
              <SwipeCard cat={cat} isTop={i === 0} onCommit={handleCommit} />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 rounded-2xl border border-dashed border-border-strong flex flex-col items-center justify-center text-center px-8 gap-3">
            <Sparkles size={28} className="text-ink-subtle" />
            <p className="text-sm text-ink-muted m-0">
              Plus de chats à découvrir pour le moment — revenez bientôt !
            </p>
            <Link href="/adopt-pet" className="text-sm font-semibold text-coral-ink no-underline">
              Voir tous les chats à l&apos;adoption
            </Link>
          </div>
        )}
      </div>

      {current && (
        <div className="flex items-center justify-center gap-5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleCommit("pass")}
            className="w-14 h-14 rounded-full border-border-strong bg-white hover:bg-white shadow-[0_6px_16px_rgba(20,22,38,0.10)]"
            aria-label={`Passer ${current.name}`}
          >
            <X size={22} className="text-ink-muted" />
          </Button>
          <Button
            type="button"
            size="icon"
            onClick={() => handleCommit("like")}
            className="w-16 h-16 rounded-full border-none shadow-[0_10px_24px_rgba(247,108,112,0.35)] hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #F76C70 0%, #E84A77 100%)" }}
            aria-label={`Coup de cœur pour ${current.name}`}
          >
            <Heart size={26} className="text-white" />
          </Button>
        </div>
      )}

      {matched && <MatchOverlay cat={matched} onClose={() => setMatched(null)} />}
    </section>
  )
}
