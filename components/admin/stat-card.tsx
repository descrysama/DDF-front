import { Card } from '@/components/ui/card'

interface StatCardProps { label: string; count: number; dot: string }

export default function StatCard({ label, count, dot }: StatCardProps) {
  return (
    <Card className="flex items-center gap-3 p-4 hover:translate-y-0">
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold leading-tight">{count}</p>
      </div>
    </Card>
  )
}
