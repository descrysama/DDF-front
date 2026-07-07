// ─── Admin design tokens ──────────────────────────────────────────────────────

export const AD = {
  bg:           'var(--scf-bg)',
  surface:      'var(--scf-surface)',
  surfaceAlt:   'var(--scf-surface-alt)',
  ink:          'var(--scf-ink)',
  inkMuted:     'var(--scf-ink-muted)',
  inkSubtle:    'var(--scf-ink-subtle)',
  border:       'var(--scf-border)',
  borderStrong: 'var(--scf-border-strong)',
  coral:        'var(--scf-coral)',
  coralSoft:    'var(--scf-coral-soft)',
  coralInk:     'var(--scf-coral-ink)',
  magenta:      'var(--scf-magenta)',
} as const

/** Pastel tints */
export const TINT = {
  pink:  'var(--scf-pink)',
  peach: 'var(--scf-peach)',
  mint:  'var(--scf-mint)',
  lilac: 'var(--scf-lilac)',
  rose:  'var(--scf-rose)',
} as const

export type StatusKey =
  | 'available' | 'in_foster' | 'reserved' | 'adopted'
  | 'open' | 'closed' | 'draft'
  | 'pending' | 'approved' | 'rejected'
  | 'active'

export const STATUS_META: Record<StatusKey, { label: string; tint: string; dot: string; ink: string }> = {
  available: { label: 'Publié',     tint: '#E0F0E8', dot: '#3FA66E', ink: '#1E6B43' },
  in_foster: { label: 'En famille', tint: '#FCE9D9', dot: '#E0944A', ink: '#8C5A1E' },
  reserved:  { label: 'Réservé',    tint: '#E8E5F4', dot: '#7B6CC4', ink: '#4A3F8E' },
  adopted:   { label: 'Adopté',     tint: '#EFEAE2', dot: '#9C9588', ink: '#5C564B' },
  open:      { label: 'Publiée',    tint: '#E0F0E8', dot: '#3FA66E', ink: '#1E6B43' },
  closed:    { label: 'Fermée',     tint: '#EFEAE2', dot: '#9C9588', ink: '#5C564B' },
  draft:     { label: 'Brouillon',  tint: '#FCE9D9', dot: '#E0944A', ink: '#8C5A1E' },
  pending:   { label: 'Nouveau',    tint: '#FEE6E5', dot: '#E84A77', ink: '#B43A3F' },
  approved:  { label: 'Validée',    tint: '#E0F0E8', dot: '#3FA66E', ink: '#1E6B43' },
  rejected:  { label: 'Refusée',    tint: '#EFEAE2', dot: '#9C9588', ink: '#5C564B' },
  active:    { label: 'Active',     tint: '#E0F0E8', dot: '#3FA66E', ink: '#1E6B43' },
}
