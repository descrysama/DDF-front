import { STATUS_META, StatusKey } from '@/lib/admin-tokens'

export default function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as StatusKey] ?? {
    label: status,
    tint: '#F4F1EB',
    dot: '#A6A6AE',
    ink: '#6A6C7A',
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 9px',
        borderRadius: 4,
        background: meta.tint,
        color: meta.ink,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: meta.dot,
          flexShrink: 0,
        }}
      />
      {meta.label}
    </span>
  )
}
