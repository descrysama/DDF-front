import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { AD, TINT } from '@/lib/admin-tokens'

interface ActionButtonsProps {
  editHref: string
  deleteAction: () => Promise<void>
}

export default function ActionButtons({ editHref, deleteAction }: ActionButtonsProps) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Link
        href={editHref}
        title="Modifier"
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: TINT.peach,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        <Pencil size={13} color="#E0944A" />
      </Link>
      <form action={deleteAction}>
        <button
          type="submit"
          title="Supprimer"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: TINT.pink,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Trash2 size={13} color={AD.coralInk} />
        </button>
      </form>
    </div>
  )
}
