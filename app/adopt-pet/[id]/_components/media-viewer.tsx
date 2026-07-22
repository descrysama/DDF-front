"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import type { CardAnimalMedia } from "@/lib/strapi"

interface Item {
  url: string
  isVideo: boolean
}

interface MediaViewerProps {
  name: string
  tones: [string, string]
  tag: string
  tagClass: string
  medias: CardAnimalMedia[]
  videoUrl: string | null
}

export function MediaViewer({ name, tones, tag, tagClass, medias, videoUrl }: MediaViewerProps) {
  const items: Item[] = [
    ...medias
      .slice()
      .sort((a, b) => Number(b.isCover) - Number(a.isCover))
      .map((m) => ({ url: m.url, isVideo: false })),
    ...(videoUrl ? [{ url: videoUrl, isVideo: true }] : []),
  ]
  const [active, setActive] = useState(0)
  const current = items[active] ?? null

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden mb-2.5 aspect-[5/4] bg-ink">
        {current ? (
          current.isVideo ? (
            <video key={current.url} src={current.url} controls className="absolute inset-0 w-full h-full object-contain bg-ink" />
          ) : (
            <Image key={current.url} src={current.url} alt={name} fill unoptimized style={{ objectFit: "cover" }} />
          )
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${tones[0]} 0%, ${tones[1]} 100%)` }}
            />
            <svg
              width="100%" height="100%"
              className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="detail-stripe-fallback" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                  <line x1="0" y1="0" x2="0" y2="14" stroke="#ffffff" strokeWidth="6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#detail-stripe-fallback)" />
            </svg>
          </>
        )}

        <div className={`absolute top-3.5 left-3.5 ${tagClass} text-white px-3 py-[5px] rounded text-xs font-semibold`}>
          {tag}
        </div>
      </div>

      {items.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {items.map((item, i) => (
            <button
              key={item.url + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative rounded-md overflow-hidden aspect-square border-2 cursor-pointer ${i === active ? "border-coral" : "border-transparent"}`}
              aria-label={item.isVideo ? "Voir la vidéo" : `Photo ${i + 1} de ${name}`}
            >
              {item.isVideo ? (
                <>
                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover" muted />
                  <div className="absolute inset-0 bg-ink/30 flex items-center justify-center">
                    <Play size={16} className="text-white" fill="white" />
                  </div>
                </>
              ) : (
                <Image src={item.url} alt="" fill unoptimized sizes="120px" style={{ objectFit: "cover" }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
