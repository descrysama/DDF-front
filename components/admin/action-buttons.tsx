import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ActionButtonsProps {
  editHref: string
  deleteAction: () => Promise<void>
}

export default function ActionButtons({ editHref, deleteAction }: ActionButtonsProps) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Button variant="outline" size="icon-sm" asChild>
        <Link href={editHref} title="Modifier"><Pencil className="size-3.5" /></Link>
      </Button>
      <form action={deleteAction}>
        <Button variant="destructive" size="icon-sm" type="submit" title="Supprimer">
          <Trash2 className="size-3.5" />
        </Button>
      </form>
    </div>
  )
}
