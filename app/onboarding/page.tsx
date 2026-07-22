import Header from "@/components/header"
import Footer from "@/components/footer"
import { OnboardingGate } from "./_components/onboarding-gate"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <OnboardingGate />
      <Footer />
    </div>
  )
}
