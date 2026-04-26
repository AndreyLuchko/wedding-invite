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
    <section className="py-16 px-8 bg-white text-center">
      <FadeIn>
        <h2 className="font-heading text-[40px] text-dark mb-3">
          {t('title')}
        </h2>
        <p className="font-body text-[9px] tracking-[0.08em] text-dark/50 max-w-xs mx-auto mb-10 leading-relaxed">
          {t('description')}
        </p>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-dark text-cream px-10 py-4 font-body text-[8px] tracking-[0.3em] uppercase hover:bg-gold hover:text-dark transition-colors"
        >
          → {t('join')}
        </a>
      </FadeIn>
    </section>
  )
}
