import { ADMIN } from '@/lib/admin-tokens'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  // animals
  available:  { bg: '#dcfce7', color: ADMIN.success },
  in_foster:  { bg: '#dbeafe', color: '#1d4ed8' },
  reserved:   { bg: '#fef9c3', color: '#854d0e' },
  adopted:    { bg: '#f3e8ff', color: '#7c3aed' },
  // announcements
  open:       { bg: '#dcfce7', color: ADMIN.success },
  closed:     { bg: '#fee2e2', color: ADMIN.danger },
  draft:      { bg: '#f3f4f6', color: ADMIN.inkMuted },
  // adoption requests
  pending:    { bg: '#fef3c7', color: ADMIN.warning },
  approved:   { bg: '#dcfce7', color: ADMIN.success },
  rejected:   { bg: '#fee2e2', color: ADMIN.danger },
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Disponible',
  in_foster: 'En famille',
  reserved:  'Réservé',
  adopted:   'Adopté',
  open:      'Ouvert',
  closed:    'Fermé',
  draft:     'Brouillon',
  pending:   'En attente',
  approved:  'Approuvé',
  rejected:  'Rejeté',
}

export default function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? { bg: '#f3f4f6', color: '#6b7280' }
  return (
    <span
      style={{
        padding: '3px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: colors.bg,
        color: colors.color,
        whiteSpace: 'nowrap',
      }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}
