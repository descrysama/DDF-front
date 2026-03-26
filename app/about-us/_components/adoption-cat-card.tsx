import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export interface AdoptionCatCardProps {
  name: string
  img: string
  desc: string
  tags: string[]
}

export function AdoptionCatCard({ name, img, desc, tags }: AdoptionCatCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="h-64 relative">
        <Image src={img} alt={name} fill className="object-cover" />
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          À l&apos;adoption
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription className="text-gray-600 line-clamp-2">
          {desc.replace(/'/g, "&apos;")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 pt-2">
          {tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
