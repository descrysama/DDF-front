/** Admin design tokens — Direction A (warm off-white, coral accent) */
export const AD = {
  bg:           '#FBFAF7',
  surface:      '#FFFFFF',
  surfaceAlt:   '#F4F1EB',
  ink:          '#252840',
  inkMuted:     '#6A6C7A',
  inkSubtle:    '#A6A6AE',
  border:       '#ECE7DD',
  borderStrong: '#D8D3C8',
  coral:        '#F76C70',
  coralSoft:    '#FEE6E5',
  coralInk:     '#B43A3F',
  magenta:      '#E84A77',
} as const

export const TINT = {
  pink:  '#FEE6E5',
  peach: '#FCE9D9',
  mint:  '#E0F0E8',
  lilac: '#E8E5F4',
  rose:  '#FDE2EC',
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

/** Backward-compat alias so existing imports keep working during migration */
export const ADMIN = {
  ...AD,
  /** alias for AD.surface */
  card:    AD.surface,
  success: '#3FA66E',
  warning: '#E0944A',
  danger:  AD.coralInk,
  sidebar: AD.ink,
}
