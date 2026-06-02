import type { Metadata } from 'next'
import './globals.css'

const coupleNames = 'Pavel & Olesya'
const description =
  'От всей души приглашаем Вас разделить с нами этот тёплый и особенный день, наполненный любовью, счастьем и искренними эмоциями.'
const ogImage = '/gallery/Logo_2.png'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  title: `${coupleNames} — Свадебное приглашение`,
  description,
  openGraph: {
    title: `${coupleNames} — Свадебное приглашение`,
    description,
    type: 'website',
    locale: 'ru_RU',
    images: [{ url: ogImage, alt: `${coupleNames} — Wedding` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${coupleNames} — Свадебное приглашение`,
    description,
    images: [ogImage],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
