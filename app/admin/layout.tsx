import AdminSidebar from '@/components/admin/sidebar'
import AdminHeader from '@/components/admin/admin-header'
import { fetchNextDistribution } from '@/lib/strapi'
import { AD } from '@/lib/admin-tokens'

export const metadata = {
  title: 'Admin — Sans Croquettes Fixes',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const nextDistribution = await fetchNextDistribution()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: AD.bg }}>
      <AdminHeader />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar nextDistribution={nextDistribution} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
