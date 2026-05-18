/** Design tokens — mirrors app/design-variables.css for use in TSX inline styles */
export const T = {
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
  pink:         '#FEE6E5',
  peach:        '#FCE9D9',
  mint:         '#E0F0E8',
  lilac:        '#E8E5F4',
  rose:         '#FDE2EC',
} as const

export type Tokens = typeof T