import type { TeamMember, Partner } from '@/lib/strapi'

export const ABOUT_PAGE = {
  heroPhotoUrl: '/about-us/hero-pilgrim.png',
  heroCaption: "Pilgrim, 13 ans. Recueilli en 2024 après l'hospitalisation de son humaine. Il vit désormais en famille d'accueil.",
}

export const TEAM: TeamMember[] = [
  { id: 'clara', name: 'Clara', role: 'Présidente, fondatrice', photoUrl: '/about-us/team-clara.jpeg' },
  { id: 'leo', name: 'Léo', role: 'Trésorier', photoUrl: '/about-us/team-leo.jpeg' },
  { id: 'margaux', name: 'Margaux', role: 'Coordination FA', photoUrl: '/about-us/team-margaux.jpeg' },
  { id: 'yannis', name: 'Yannis', role: 'Distributions', photoUrl: '/about-us/team-yannis.jpeg' },
  { id: 'aida', name: 'Aïda', role: 'Réseaux sociaux', photoUrl: '/about-us/team-aida.jpeg' },
  { id: 'hugo', name: 'Hugo', role: 'Vétérinaire bénévole', photoUrl: '/about-us/team-hugo.jpeg' },
]

export const PARTNERS: Partner[] = [
  { id: 'ville-de-lyon', name: 'Ville de Lyon', logoUrl: '/about-us/partner-ville-de-lyon.svg' },
  { id: 'metropole-69', name: 'Métropole 69', logoUrl: '/about-us/partner-metropole-69.png' },
  { id: 'cabinet-vet-charpennes', name: 'Cabinet Vét. Charpennes', logoUrl: null },
  { id: 'croix-rousse-vet', name: 'Croix-Rousse Vet', logoUrl: null },
  { id: 'maxi-zoo-part-dieu', name: 'Maxi Zoo Part-Dieu', logoUrl: '/about-us/partner-maxi-zoo.svg' },
  { id: 'royal-canin', name: 'Royal Canin', logoUrl: '/about-us/partner-royal-canin.svg' },
  { id: '30-millions-amis', name: "30 Millions d'Amis", logoUrl: '/about-us/partner-30-millions-amis.svg' },
  { id: 'fondation-bardot', name: 'Fondation B. Bardot', logoUrl: null },
]
