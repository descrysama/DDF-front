import { AD } from '@/lib/admin-tokens'

interface StatCardProps {
  label: string
  count: number
  dot: string
}

export default function StatCard({ label, count, dot }: StatCardProps) {
  return (
    <div
      style={{
        background: AD.surface,
        border: `1px solid ${AD.border}`,
        borderRadius: 10,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: dot,
          flexShrink: 0,
        }}
      />
      <div>
        <p style={{ fontSize: 11.5, color: AD.inkMuted }}>{label}</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: AD.ink, lineHeight: 1.2 }}>{count}</p>
      </div>
    </div>
  )
}
