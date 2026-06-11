'use client'

import { useFormStatus } from 'react-dom'
import { ADMIN } from '@/lib/admin-tokens'

interface SubmitButtonProps {
  label: string
  pendingLabel?: string
}

export default function SubmitButton({ label, pendingLabel = 'Enregistrement…' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: '10px 24px',
        background: pending ? '#c4c4c4' : ADMIN.coral,
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 14,
        cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
