'use client'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

interface TelegramSectionProps {
  telegramLink: string
}

export function TelegramSection({ telegramLink }: TelegramSectionProps) {
  const t = useTranslations('telegram')
  if (!telegramLink) return null

  return (
    <section className="py-24 px-6 bg-white text-center">
      <FadeIn>
        <h2 className="font-serif text-4xl text-dark mb-4">{t('title')}</h2>
        <p className="font-sans text-sm text-dark/50 max-w-sm mx-auto mb-10">
          {t('description')}
        </p>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-dark text-cream px-8 py-4 font-sans text-sm tracking-widest uppercase hover:bg-gold hover:text-dark transition-colors"
        >
          {t('join')}
        </a>
      </FadeIn>
    </section>
  )
}
