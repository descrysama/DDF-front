import { fetchMyAnimals } from '@/lib/strapi'
import { selfUnassignReferent } from '../animals/actions'
import { requireBenevoleOrAdmin } from '@/lib/auth'
import { AD, TINT } from '@/lib/admin-tokens'
import { Card } from '@/components/ui/card'
import SubmitButton from '@/components/admin/submit-button'
import { UserCheck, PawPrint } from 'lucide-react'

const TONE_TINTS = [TINT.mint, TINT.lilac, TINT.peach, TINT.pink, TINT.rose]

export default async function MyAnimalsPage() {
  const user = await requireBenevoleOrAdmin()
  const { animals, total } = await fetchMyAnimals(user.id)

  return (
    <div style={{ padding: '28px 32px' }}>
      <p style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', fontSize: 11.5, color: AD.inkMuted, marginBottom: 8 }}>
        Admin / Mes chats
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: AD.ink, letterSpacing: '-0.025em', marginBottom: 4 }}>
            Mes chats
          </h1>
          <p style={{ fontSize: 13, color: AD.inkMuted }}>
            {total} chat{total > 1 ? 's' : ''} dont vous êtes responsable
          </p>
        </div>
      </div>

      {animals.length === 0 ? (
        <Card className="hover:translate-y-0" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: AD.inkMuted }}>
            Vous n&apos;êtes référent d&apos;aucun chat pour l&apos;instant — direction{' '}
            <span style={{ fontWeight: 600, color: AD.ink }}>Chats libres</span> pour en prendre un.
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
                  position: 'relative',
                  background: animal.photoUrl
                    ? `center / cover no-repeat url(${animal.photoUrl})`
                    : TONE_TINTS[idx % TONE_TINTS.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!animal.photoUrl && <PawPrint size={36} color={AD.inkSubtle} strokeWidth={1.5} />}
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.9)',
                    color: AD.ink,
                  }}
                >
                  <UserCheck size={12} strokeWidth={2.5} />
                  {animal.role === 'referent' ? 'Référent' : 'Co-référent'}
                </span>
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
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`/admin/adoption-requests?animal=${animal.documentId}&animalName=${encodeURIComponent(animal.name)}`}
                    style={{
                      flex: 1,
                      fontSize: 12.5,
                      fontWeight: 600,
                      textAlign: 'center',
                      padding: '8px 10px',
                      borderRadius: 8,
                      border: `1px solid ${AD.border}`,
                      color: AD.ink,
                      textDecoration: 'none',
                    }}
                  >
                    Voir ses demandes
                  </a>
                  <form action={selfUnassignReferent.bind(null, animal.documentId)} style={{ flex: 1 }}>
                    <SubmitButton label="Me retirer" pendingLabel="Retrait…" />
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
