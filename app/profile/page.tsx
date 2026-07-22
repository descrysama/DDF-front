import Header from "@/components/header"
import Footer from "@/components/footer"
import { ProfileContent } from "./_components/profile-content"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <ProfileContent />
      <Footer />
    </div>
  )
}
