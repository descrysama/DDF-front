import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

export interface StatCardProps {
  icon: LucideIcon
  stat: string
  label: string
  desc: string
}

export function StatCard({ icon: Icon, stat, label, desc }: StatCardProps) {
  return (
    <Card className="text-center rounded-2xl border-t-4 border-transparent">
      <CardHeader className="pb-2">
        <div className="mx-auto w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl lg:text-4xl font-extrabold text-primary">{stat}</div>
        <div className="font-semibold text-gray-900 leading-tight">{label}</div>
        <div className="text-xs text-gray-500">
          {desc.replace(/'/g, "&apos;")}
        </div>
      </CardContent>
    </Card>
  )
}
