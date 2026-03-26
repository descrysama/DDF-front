import { LucideIcon } from "lucide-react"

export interface FeatureOverlayCardProps {
  title: string
  icon: LucideIcon
}

export function FeatureOverlayCard({ title, icon: Icon }: FeatureOverlayCardProps) {
  return (
    <div className="bg-[#393b4f] text-white p-4 lg:p-5 rounded-xl shadow-xl flex items-center gap-4 cursor-pointer">
      <Icon className="w-6 h-6 text-primary shrink-0" />
      <span className="font-semibold text-sm lg:text-base leading-tight">
        {title.replace(/'/g, "&apos;")}
      </span>
    </div>
  )
}
