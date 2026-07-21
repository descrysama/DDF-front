import Header from '@/components/header'
import Footer from '@/components/footer'
import { fetchAboutPage, fetchTeamMembers, fetchPartners } from '@/lib/strapi'
import { AboutHero } from './_components/about-hero'
import { MissionSection } from './_components/mission-section'
import { TimelineSection } from './_components/timeline-section'
import { TeamSection } from './_components/team-section'
import { PartnersSection } from './_components/partners-section'

export const metadata = {
  title: 'À propos – Sans Croquettes Fixes',
  description: "Découvrez l'association Sans Croquettes Fixes : notre histoire, notre mission et notre équipe de bénévoles à Lyon.",
}

export default async function AboutUsPage() {
  const [aboutPage, team, partners] = await Promise.all([
    fetchAboutPage(),
    fetchTeamMembers(),
    fetchPartners(),
  ])

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        <AboutHero heroPhotoUrl={aboutPage.heroPhotoUrl} heroCaption={aboutPage.heroCaption} />
        <MissionSection />
        <TimelineSection />
        <TeamSection team={team} />
        <PartnersSection partners={partners} />
      </main>
      <Footer />
    </div>
  )
}
