import Header from '@/components/header'
import Footer from '@/components/footer'
import DonateForm from './_components/donate-form'

export const metadata = {
  title: 'Faire un don – Sans Croquettes Fixes',
  description: "Soutenez l'association Sans Croquettes Fixes en faisant un don financier ou matériel.",
}

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        <DonateForm />
      </main>
      <Footer />
    </div>
  )
}
