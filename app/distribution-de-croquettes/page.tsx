import Header from '@/components/header'
import Footer from '@/components/footer'
import { DistributionHero } from './_components/distribution-hero'
import { HistorySection } from './_components/history-section'
import { PracticalInfoSection } from './_components/practical-info-section'
import { EligibilitySection } from './_components/eligibility-section'

export const metadata = {
  title: 'Distribution de croquettes – Sans Croquettes Fixes',
  description: "Tous les vendredis, l'association Sans Croquettes Fixes distribue gratuitement des croquettes pour chiens et chats aux personnes en situation de précarité, rue Desaix à Lyon.",
}

export default function DistributionDeCroquettesPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        <DistributionHero />
        <HistorySection />
        <PracticalInfoSection />
        <EligibilitySection />
      </main>
      <Footer />
    </div>
  )
}
