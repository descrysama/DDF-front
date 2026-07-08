'use client'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export default function SubmitButton({
  label,
  pendingLabel = 'Enregistrement…',
  pending: pendingProp,
}: {
  label: string
  pendingLabel?: string
  pending?: boolean
}) {
  const { pending: formStatusPending } = useFormStatus()
  const pending = pendingProp ?? formStatusPending
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  )
}
