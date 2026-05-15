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
        <h2 className="font-heading text-[42px] md:text-[52px] text-dark mb-3">
          {t('title')}
        </h2>
        <p className="font-body text-[16px] tracking-[0.08em] text-dark/50 max-w-xs mx-auto mb-10 leading-relaxed">
          {t('description')}
        </p>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-white/60 text-dark font-body text-[12px] tracking-[0.3em] uppercase border border-[#f5f0e8] hover:bg-[#f5f0e8] hover:text-dark transition-colors cursor-pointer"
        >
          → {t('join')}
        </a>
      </FadeIn>
    </section>
  )
}
