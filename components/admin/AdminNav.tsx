import Link from 'next/link'
import { LogoutButton } from '@/components/admin/LogoutButton'

export function AdminNav() {
  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center gap-6">
      <span className="font-semibold text-gray-900 mr-4">Wedding Admin</span>
      <Link href="/admin/guests" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        Guests
      </Link>
      <Link href="/admin/rsvp" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        RSVP
      </Link>
      <LogoutButton />
    </nav>
  )
}
