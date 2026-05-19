import Header from "@/components/header"
import Footer from "@/components/footer"
import { HeroSection } from "./(home)/_components/hero-section"
import { StatsStrip } from "./(home)/_components/stats-strip"
import { CatsPreview } from "./(home)/_components/cats-preview"
import { AboutSection } from "./(home)/_components/about-section"
import { CtaSection } from "./(home)/_components/cta-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        <HeroSection />
        <StatsStrip />
        <CatsPreview />
        <AboutSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
