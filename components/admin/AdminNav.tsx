'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/admin/LogoutButton'

const navLinks = [
  { href: '/admin/guests', label: 'Guests' },
  { href: '/admin/rsvp', label: 'RSVP' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center gap-6">
      <Image src="/gallery/Logo_2.png" alt="Logo" width={80} height={80} className="mr-4 object-contain" loading="eager" />
      {navLinks.map(({ href, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm transition-colors ${active
              ? 'text-[#C9A84C] font-semibold border-b-2 border-[#C9A84C] pb-0.5'
              : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            {label}
          </Link>
        )
      })}
      <LogoutButton />
    </nav>
  )
}
