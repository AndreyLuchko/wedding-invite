'use client'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

export function QuoteSection() {
  const t = useTranslations('quote')

  return (
    <section className="py-14 px-11 bg-cream text-center">
      <FadeIn>
        <span
          className="font-heading text-[52px] text-gold/20 leading-none block -mb-2"
          aria-hidden="true"
        >
          &quot;
        </span>
        <p className="font-heading text-[32px] md:text-[42] text-dark leading-relaxed mb-5">
          {t('text')}
        </p>
        <p className="font-body text-[9px] tracking-[0.35em] text-gold uppercase">
          23 · 08 · 2026
        </p>
      </FadeIn>
    </section>
  )
}
