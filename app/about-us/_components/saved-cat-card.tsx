import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export interface SavedCatCardProps {
  name: string
  img: string
  desc: string
}

export function SavedCatCard({ name, img, desc }: SavedCatCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl flex flex-col sm:flex-row">
      <div className="sm:w-2/5 h-56 sm:h-auto relative">
        <Image src={img} alt={name.replace(/'/g, "&apos;")} fill className="object-cover" />
      </div>
      <CardContent className="sm:w-3/5 p-6 flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-2">
          {name.replace(/'/g, "&apos;")}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {desc.replace(/'/g, "&apos;")}
        </p>
      </CardContent>
    </Card>
  )
}
