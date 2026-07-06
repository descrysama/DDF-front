import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import RegisterForm from './_components/register-form'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect('/')

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-ink mb-1">Créer un compte</h1>
          <p className="text-sm text-ink/60 mb-6">
            Rejoignez la communauté Défense Des Félins.
          </p>
          <RegisterForm />
          <p className="mt-6 text-sm text-ink/70 text-center">
            Déjà inscrit ?{' '}
            <Link href="/login" className="text-coral font-semibold no-underline">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
