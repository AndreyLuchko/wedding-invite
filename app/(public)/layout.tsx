import { Great_Vibes, Cormorant_Infant } from 'next/font/google'
import localFont from 'next/font/local'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-great-vibes',
})

const cormorantInfant = Cormorant_Infant({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-cormorant',
})

const wolfgang = localFont({
  src: '../../public/fonts/wolfgangamadeusmozart.ttf',
  variable: '--font-wolfgang',
})

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${greatVibes.variable} ${cormorantInfant.variable} ${wolfgang.variable}`}>
      {children}
    </div>
  )
}
