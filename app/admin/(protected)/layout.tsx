import { AdminNav } from '@/components/admin/AdminNav'

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <main>{children}</main>
    </>
  )
}
