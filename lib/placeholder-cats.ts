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
  slug: string
  name: string
  tag: CatTag
  tagStyle: 'coral' | 'ink'
  blurb: string
  age: string
  sex: string
  tones: [string, string]
  born?: string
  location?: string
  appartement?: string
  sterilise?: string
  entente?: string
  story?: string[]
}

export const CAT_TINT: Record<CatTag, string> = {
  'Chaton':          'bg-peach',
  'Adulte mâle':     'bg-pink',
  'Adulte femelle':  'bg-pink',
  'Senior':          'bg-lilac',
  'Duo':             'bg-mint',
  'Cas particulier': 'bg-rose',
}

export const PLACEHOLDER_CATS: PlaceholderCat[] = [
  {
    id: '1', slug: 'qamar', name: 'Qamar', tag: 'Chaton', tagStyle: 'coral',
    blurb: 'Vraie petite boule d\'énergie, toujours partante pour jouer.',
    age: '4 mois', sex: 'Femelle', tones: ['#E8C9B3', '#C99879'],
    born: 'Février 2026', location: 'Lyon 6e',
    appartement: 'Oui, idéale en appart',
    sterilise: 'À stériliser (inclus dans les frais)',
    entente: 'Très bien avec les chats',
    story: [
      'Qamar a été recueillie par notre équipe en mars dernier, après avoir été trouvée errante dans un quartier de Lyon. Très jeune, elle a vite repris confiance grâce à nos familles d\'accueil.',
      'C\'est une vraie petite boule d\'énergie, toujours partante pour jouer, mais qui sait aussi se poser pour de longs moments de câlins. Elle s\'entend parfaitement avec les autres chats et adorerait avoir un copain félin à la maison.',
      'Qamar cherche une famille patiente, attentive, et prête à lui offrir un cadre sécurisant pour grandir sereinement.',
    ],
  },
  {
    id: '2', slug: 'keiko', name: 'Keiko', tag: 'Adulte mâle', tagStyle: 'coral',
    blurb: 'Adore la compagnie et la présence de ses humains, partout dans la maison.',
    age: '6 ans', sex: 'Mâle', tones: ['#D9D3C5', '#9D9485'],
    born: 'Avril 2019', location: 'Lyon 3e',
    appartement: 'Oui, s\'adapte bien',
    sterilise: 'Stérilisé, vacciné, pucé',
    entente: 'S\'entend avec d\'autres chats calmes',
    story: [
      'Keiko est arrivé chez nous après le déménagement de son ancienne famille qui ne pouvait pas l\'emmener. Il avait besoin d\'un peu de temps pour s\'adapter, mais il est maintenant épanoui.',
      'Curieux et affectueux, il suit ses humains de pièce en pièce. Il adore se lover contre vous le soir pour regarder une série.',
      'Il cherche une famille stable, de préférence sans enfants en bas âge, qui lui offrira calme et affection quotidienne.',
    ],
  },
  {
    id: '3', slug: 'ayana', name: 'Ayana & Tara', tag: 'Duo', tagStyle: 'coral',
    blurb: 'Deux jeunes chattes très sociables, curieuses et dynamiques.',
    age: '1 an', sex: 'Femelles', tones: ['#E0AC9C', '#A87968'],
    born: 'Janvier 2025', location: 'Lyon 7e',
    appartement: 'Oui, à adopter ensemble obligatoirement',
    sterilise: 'Stérilisées, vaccinées, pucées',
    entente: 'Inséparables l\'une de l\'autre',
    story: [
      'Ayana et Tara sont arrivées ensemble dans notre réseau en tant que chatons abandonnés. Inséparables depuis le premier jour, elles jouent, dorment et mangent toujours côte à côte.',
      'Ce sont deux chattes dynamiques et curieuses, qui s\'adaptent facilement à de nouveaux environnements. Elles sont très joueuses et aiment explorer chaque recoin de leur logement.',
      'Une adoption individuelle est impossible : elles doivent impérativement partir ensemble pour ne pas souffrir de la séparation.',
    ],
  },
  {
    id: '4', slug: 'kavi', name: 'Kavi', tag: 'Cas particulier', tagStyle: 'ink',
    blurb: 'Adore jouer, surtout avec un rouleau de scotch qu\'elle promène partout.',
    age: '1 an', sex: 'Femelle', tones: ['#F1D7C4', '#D3A88C'],
    born: 'Mars 2025', location: 'Villeurbanne',
    appartement: 'Oui, mais enrichissement nécessaire',
    sterilise: 'Stérilisée, vaccinée, pucée',
    entente: 'Pas avec les chiens — chats OK après présentation',
    story: [
      'Kavi est un cas particulier car elle a besoin d\'une famille expérimentée et patiente. Ancienne errante, elle garde quelques craintes envers les inconnus mais se révèle une chatte attachante une fois en confiance.',
      'Elle adore jouer — particulièrement avec des rouleaux de scotch ou des morceaux de papier froissé. Sa drôlerie et son caractère espiègle font craquer tous nos bénévoles.',
      'Elle convient à une famille sans chien, idéalement sans enfants de moins de 8 ans. Un foyer calme et prévisible lui fera le plus grand bien.',
    ],
  },
  {
    id: '5', slug: 'junior', name: 'Junior', tag: 'Adulte mâle', tagStyle: 'coral',
    blurb: 'Encore un peu craintif mais adore les caresses et ronronne longtemps.',
    age: '2 ans', sex: 'Mâle', tones: ['#D9B898', '#A47A55'],
    born: 'Juin 2023', location: 'Lyon 8e',
    appartement: 'Oui, avec des cachettes disponibles',
    sterilise: 'Stérilisé, vacciné, pucé',
    entente: 'Préférence pour être seul ou avec un chat docile',
    story: [
      'Junior a été trouvé errant à Lyon 8e à l\'âge d\'un an. Mal socialisé dans ses premiers mois, il est encore timide avec les nouvelles personnes mais sa personnalité s\'épanouit avec le temps.',
      'Dès qu\'il est en confiance, il se transforme : il vient réclamer des caresses, monte sur les genoux et ronronne pendant des heures. C\'est un chat très doux qui a juste besoin de patience.',
      'Il lui faut une famille disponible et tranquille, prête à lui laisser le temps de s\'apprivoiser. En échange, il vous donnera une affection sincère et profonde.',
    ],
  },
  {
    id: '6', slug: 'argen', name: 'Argen', tag: 'Adulte mâle', tagStyle: 'coral',
    blurb: 'Très proche de l\'humain, aime la présence tout en gardant son indépendance.',
    age: '1 an', sex: 'Mâle', tones: ['#C6C8CB', '#7E8189'],
    born: 'Octobre 2024', location: 'Lyon 4e',
    appartement: 'Oui, très adaptable',
    sterilise: 'Stérilisé, vacciné, pucé',
    entente: 'Très bien avec les chats et les enfants',
    story: [
      'Argen est arrivé chez nous à 3 mois, recueilli par une bénévole qui l\'avait trouvé seul dans une cave. Il a été socialisé très tôt et est aujourd\'hui un chat équilibré et joyeux.',
      'Il est sociable avec tout le monde : humains, autres chats, enfants. Il cherche la présence sans être envahissant — il sera là à côté de vous, mais ne vous collera pas non plus.',
      'Argen conviendrait parfaitement à une première adoption, à une famille avec enfants, ou à toute personne cherchant un compagnon discret mais affectueux.',
    ],
  },
  {
    id: '7', slug: 'pilgrim', name: 'Pilgrim', tag: 'Senior', tagStyle: 'ink',
    blurb: 'On peut le qualifier de gros câlineur. Âgé mais plein de tendresse.',
    age: '13 ans', sex: 'Mâle', tones: ['#3C3F4E', '#1F2235'],
    born: 'Avril 2012', location: 'Lyon 2e',
    appartement: 'Idéal en appartement calme',
    sterilise: 'Stérilisé, vacciné, pucé — suivi vétérinaire régulier',
    entente: 'Préfère être seul, sans autres animaux',
    story: [
      'Pilgrim a été confié à notre association en 2024 après l\'hospitalisation de son humaine. À 13 ans, il a quitté la maison qu\'il connaissait depuis tout petit, et cherche une nouvelle famille aimante pour ses dernières années.',
      'C\'est un grand câlineur, doux et posé. Il vient s\'installer sur les genoux dès que vous vous asseyez, ronronne doucement, et apprécie une vie tranquille. Il n\'a plus l\'énergie des chatons, mais il a toute la sagesse et la tendresse d\'un chat mature.',
      'Pilgrim cherche une famille calme, sans enfants trop turbulents ni autres animaux. En échange, il vous offrira une présence profondément réconfortante.',
    ],
  },
  {
    id: '8', slug: 'kratos', name: 'Kratos & Tselanos', tag: 'Duo', tagStyle: 'coral',
    blurb: 'Ils ne se priveront pas de quémander des câlins, sur le canapé ou dans votre lit.',
    age: '2-3 ans', sex: 'Mâles', tones: ['#C0B095', '#876D52'],
    born: 'Kratos : 2022 · Tselanos : 2023', location: 'Décines',
    appartement: 'Oui, avec espace de jeu',
    sterilise: 'Stérilisés, vaccinés, pucés',
    entente: 'Inséparables — à adopter ensemble',
    story: [
      'Kratos et Tselanos ont été recueillis séparément mais sont devenus inséparables lors de leur passage en famille d\'accueil. Retirer l\'un sans l\'autre est impossible : ils dorment ensemble, se font la toilette et jouent comme deux frères.',
      'Kratos est le plus entreprenant des deux : il vient réclamer des câlins sans prévenir, s\'installe sur votre clavier, et mange votre place sur le canapé. Tselanos est plus réservé mais tout aussi affectueux une fois en confiance.',
      'Ils cherchent une famille prête à accueillir deux chats actifs, qui aimera les voir jouer ensemble et se blottir l\'un contre l\'autre le soir.',
    ],
  },
]
