import { fetchUnassignedAnimals } from '@/lib/strapi'
import { selfAssignReferent } from '../animals/actions'
import { requireBenevoleOrAdmin } from '@/lib/auth'
import { AD, TINT } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'
import SubmitButton from '@/components/admin/submit-button'
import { Sparkles, PawPrint } from 'lucide-react'

const TONE_TINTS = [TINT.pink, TINT.peach, TINT.mint, TINT.lilac, TINT.rose]

export default async function UnassignedAnimalsPage() {
  await requireBenevoleOrAdmin()
  const { animals, total } = await fetchUnassignedAnimals({ limit: 100 })

  return (
    <div style={{ padding: '28px 32px' }}>
      <p style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: 11.5, color: AD.inkMuted, marginBottom: 8 }}>
        Admin / Chats libres
      </p>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
          padding: '24px 28px',
          marginBottom: 26,
          background: 'linear-gradient(120deg, #FEE6E5 0%, #FCE9D9 55%, #E8E5F4 100%)',
        }}
      >
        <Sparkles
          size={120}
          strokeWidth={1.2}
          style={{ position: 'absolute', right: -18, top: -24, color: 'rgba(255,255,255,0.55)' }}
        />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Sparkles size={20} color={AD.coral} strokeWidth={2.2} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: AD.ink, letterSpacing: '-0.02em' }}>
            Chats en attente d&apos;un référent
          </h1>
        </div>
        <p style={{ position: 'relative', fontSize: 13.5, color: AD.inkMuted, maxWidth: 560 }}>
          Ces chats n&apos;ont pas encore de bénévole responsable. Deviens leur référent
          pour suivre et traiter toi-même leurs demandes d&apos;adoption.
        </p>
        <p style={{ position: 'relative', fontSize: 12.5, fontWeight: 600, color: AD.coral, marginTop: 10 }}>
          {total} chat{total > 1 ? 's' : ''} libre{total > 1 ? 's' : ''}
        </p>
      </div>

      {animals.length === 0 ? (
        <Card className="hover:translate-y-0" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: AD.inkMuted }}>
            🎉 Aucun chat en attente — tous les chats ont déjà un référent.
          </p>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {animals.map((animal, idx) => (
            <Card key={animal.documentId} className="overflow-hidden hover:-translate-y-0.5" style={{ padding: 0 }}>
              <div
                style={{
                  height: 140,
                  background: animal.photoUrl
                    ? `center / cover no-repeat url(${animal.photoUrl})`
                    : TONE_TINTS[idx % TONE_TINTS.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!animal.photoUrl && <PawPrint size={36} color={AD.inkSubtle} strokeWidth={1.5} />}
              </div>

              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                  <h2 style={{ fontSize: 15.5, fontWeight: 700, color: AD.ink }}>{animal.name}</h2>
                  <span style={{ fontSize: 12, color: AD.inkMuted }}>{animal.age}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 10,
                      background: AD.surfaceAlt,
                      color: AD.inkMuted,
                    }}
                  >
                    {animal.sex}
                  </span>
                  {animal.breed && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 10,
                        background: AD.surfaceAlt,
                        color: AD.inkMuted,
                      }}
                    >
                      {animal.breed}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 10,
                      background: AD.coralSoft,
                      color: AD.coralInk,
                    }}
                  >
                    {animal.tag}
                  </span>
                </div>

                {animal.blurb && (
                  <p
                    style={{
                      fontSize: 12.5,
                      color: AD.inkMuted,
                      lineHeight: 1.5,
                      marginBottom: 14,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {animal.blurb}
                  </p>
                )}

                <form action={selfAssignReferent.bind(null, animal.documentId)}>
                  <SubmitButton label="Devenir référent" pendingLabel="Attribution…" />
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
