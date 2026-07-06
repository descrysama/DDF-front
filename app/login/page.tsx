import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import LoginForm from './_components/login-form'
import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const user = await getCurrentUser()
  const { from } = await searchParams
  if (user) {
    redirect(isAdmin(user) ? from ?? '/admin/animals' : from ?? '/')
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-ink mb-1">Connexion</h1>
          <p className="text-sm text-ink/60 mb-6">
            Accédez à votre espace Défense Des Félins.
          </p>
          <LoginForm redirectTo={from} />
          <p className="mt-6 text-sm text-ink/70 text-center">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-coral font-semibold no-underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
