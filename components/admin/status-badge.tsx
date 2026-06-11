import { Badge } from '@/components/ui/badge'
import { STATUS_META, type StatusKey } from '@/lib/admin-tokens'

export default function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as StatusKey] ?? STATUS_META.available
  return (
    <Badge
      className="hover:opacity-100"
      style={{ background: meta.tint, color: meta.ink, border: 'none' }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.dot, marginRight: 4, display: 'inline-block' }} />
      {meta.label}
    </Badge>
  )
}
