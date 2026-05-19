import AdminSidebar from '@/components/admin/sidebar'
import { ADMIN } from '@/lib/admin-tokens'

export const metadata = {
  title: 'Admin — DDF',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: ADMIN.bg }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
