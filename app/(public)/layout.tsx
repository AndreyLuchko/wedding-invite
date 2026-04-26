import { Great_Vibes } from 'next/font/google'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-great-vibes',
})

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className={greatVibes.variable}>{children}</div>
}
