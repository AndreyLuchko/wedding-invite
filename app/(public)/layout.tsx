import { Cormorant_Infant } from 'next/font/google'
import localFont from 'next/font/local'

const cormorantInfant = Cormorant_Infant({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-cormorant',
})

const liana = localFont({
  src: '../../public/fonts/liana.ttf',
  variable: '--font-liana',
})

const wolfgang = localFont({
  src: '../../public/fonts/wolfgangamadeusmozart.ttf',
  variable: '--font-wolfgang',
})

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorantInfant.variable} ${liana.variable} ${wolfgang.variable}`}>
      {children}
    </div>
  )
}
