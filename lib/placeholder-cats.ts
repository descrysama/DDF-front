/** Placeholder cat data — will be replaced by Strapi API responses */

export type CatTag =
  | 'Chaton'
  | 'Adulte mâle'
  | 'Adulte femelle'
  | 'Senior'
  | 'Duo'
  | 'Cas particulier'

export interface PlaceholderCat {
  id: string
  name: string
  tag: CatTag
  tagStyle: 'coral' | 'ink'
  blurb: string
  age: string
  sex: string
  tones: [string, string]
}

export const CAT_TINT: Record<CatTag, string> = {
  'Chaton':          '#FCE9D9',
  'Adulte mâle':     '#FEE6E5',
  'Adulte femelle':  '#FEE6E5',
  'Senior':          '#E8E5F4',
  'Duo':             '#E0F0E8',
  'Cas particulier': '#FDE2EC',
}

export const PLACEHOLDER_CATS: PlaceholderCat[] = [
  {
    id: 'qamar', name: 'Qamar', tag: 'Chaton', tagStyle: 'coral',
    blurb: 'Vraie petite boule d\'énergie, toujours partante pour jouer.',
    age: '4 mois', sex: 'Femelle', tones: ['#E8C9B3', '#C99879'],
  },
  {
    id: 'keiko', name: 'Keiko', tag: 'Adulte mâle', tagStyle: 'coral',
    blurb: 'Adore la compagnie et la présence de ses humains, partout dans la maison.',
    age: '6 ans', sex: 'Mâle', tones: ['#D9D3C5', '#9D9485'],
  },
  {
    id: 'ayana', name: 'Ayana & Tara', tag: 'Duo', tagStyle: 'coral',
    blurb: 'Deux jeunes chattes très sociables, curieuses et dynamiques.',
    age: '1 an', sex: 'Femelles', tones: ['#E0AC9C', '#A87968'],
  },
  {
    id: 'kavi', name: 'Kavi', tag: 'Cas particulier', tagStyle: 'ink',
    blurb: 'Adore jouer, surtout avec un rouleau de scotch qu\'elle promène partout.',
    age: '1 an', sex: 'Femelle', tones: ['#F1D7C4', '#D3A88C'],
  },
  {
    id: 'junior', name: 'Junior', tag: 'Adulte mâle', tagStyle: 'coral',
    blurb: 'Encore un peu craintif mais adore les caresses et ronronne longtemps.',
    age: '2 ans', sex: 'Mâle', tones: ['#D9B898', '#A47A55'],
  },
  {
    id: 'argen', name: 'Argen', tag: 'Adulte mâle', tagStyle: 'coral',
    blurb: 'Très proche de l\'humain, aime la présence tout en gardant son indépendance.',
    age: '1 an', sex: 'Mâle', tones: ['#C6C8CB', '#7E8189'],
  },
  {
    id: 'pilgrim', name: 'Pilgrim', tag: 'Senior', tagStyle: 'ink',
    blurb: 'On peut le qualifier de gros câlineur. Âgé mais plein de tendresse.',
    age: '13 ans', sex: 'Mâle', tones: ['#3C3F4E', '#1F2235'],
  },
  {
    id: 'kratos', name: 'Kratos & Tselanos', tag: 'Duo', tagStyle: 'coral',
    blurb: 'Ils ne se priveront pas de quémander des câlins, sur le canapé ou dans votre lit.',
    age: '2-3 ans', sex: 'Mâles', tones: ['#C0B095', '#876D52'],
  },
]