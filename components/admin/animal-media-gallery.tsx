'use client'

import { useTransition } from 'react'
import { AD } from '@/lib/admin-tokens'
import { addMediaToAnimal, deleteMedia, setCoverMedia } from '@/app/admin/animals/actions'
import type { StrapiMedia } from '@/lib/strapi'

interface AnimalMediaGalleryProps {
  medias: StrapiMedia[]
  animalDocumentId: string
  strapiUrl: string
}

export default function AnimalMediaGallery({
  medias,
  animalDocumentId,
  strapiUrl,
}: AnimalMediaGalleryProps) {
  const [isPending, startTransition] = useTransition()

  function handleSetCover(componentId: number) {
    startTransition(() => setCoverMedia(componentId, animalDocumentId))
  }

  function handleDelete(componentId: number) {
    if (!confirm('Supprimer cette photo ?')) return
    startTransition(() => deleteMedia(componentId, animalDocumentId))
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    form.reset()
    startTransition(() => addMediaToAnimal(animalDocumentId, formData))
  }

  return (
    <div>
      <p style={{ fontSize: 13, fontWeight: 600, color: AD.ink, marginBottom: 12, marginTop: 0 }}>
        Photos ({medias.length})
      </p>

      {medias.length === 0 ? (
        <p style={{ fontSize: 13, color: AD.inkMuted, marginBottom: 16 }}>
          Aucune photo pour l&apos;instant.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 12,
            marginBottom: 20,
            opacity: isPending ? 0.6 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {medias.map(media => {
            const relPath =
              media.image?.formats?.medium?.url ??
              media.image?.formats?.small?.url ??
              media.image?.url ??
              null
            const displayUrl = relPath ? `${strapiUrl}${relPath}` : null
            const isCover = media.is_cover

            return (
              <div
                key={media.id}
                style={{
                  border: `2px solid ${isCover ? AD.coral : AD.border}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: AD.surfaceAlt,
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                  {displayUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={displayUrl}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 11, color: AD.inkMuted }}>Sans image</span>
                    </div>
                  )}
                  {isCover && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        background: AD.coral,
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 4,
                      }}
                    >
                      Couverture
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 4, padding: '6px 6px' }}>
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(media.id)}
                      disabled={isPending}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        fontSize: 11,
                        background: AD.coralSoft,
                        color: AD.coralInk,
                        border: 'none',
                        borderRadius: 4,
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      ★ Couverture
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(media.id)}
                    disabled={isPending}
                    style={{
                      padding: '4px 10px',
                      fontSize: 11,
                      background: '#FEE6E5',
                      color: AD.coralInk,
                      border: 'none',
                      borderRadius: 4,
                      cursor: isPending ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <input
          name="photo"
          type="file"
          accept="image/*"
          required
          disabled={isPending}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '6px 10px',
            border: `1px solid ${AD.border}`,
            borderRadius: 6,
            fontSize: 13,
            color: AD.ink,
            background: '#fff',
            cursor: 'pointer',
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '7px 18px',
            background: isPending ? AD.border : AD.coral,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 13,
            cursor: isPending ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {isPending ? 'En cours…' : '+ Ajouter'}
        </button>
      </form>
      <p style={{ fontSize: 11, color: AD.inkSubtle, marginTop: 5, marginBottom: 0 }}>
        JPG, PNG, WebP — max 5 Mo
      </p>
    </div>
  )
}
