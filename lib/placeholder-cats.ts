import type { CatTag } from '@/lib/strapi'

/** Tailwind background classes per cat tag, used as card/detail tints. */
export const CAT_TINT: Record<CatTag, string> = {
  'Chaton':          'bg-peach',
  'Adulte mâle':     'bg-pink',
  'Adulte femelle':  'bg-pink',
  'Senior':          'bg-lilac',
  'Duo':             'bg-mint',
  'Cas particulier': 'bg-rose',
}
