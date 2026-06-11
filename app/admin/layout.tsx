import AdminSidebar from '@/components/admin/sidebar'
import AdminHeader from '@/components/admin/admin-header'
import { AD } from '@/lib/admin-tokens'

export const metadata = {
  title: 'Admin — Sans Croquettes Fixes',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: AD.bg }}>
      <AdminHeader />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
