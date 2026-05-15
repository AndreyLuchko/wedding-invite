'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

export function TimelineSection() {
  const t = useTranslations('timeline')

  return (
    <section className="py-14 px-6 bg-cream text-center">
      <FadeIn>
        <h2 className="font-heading text-[42px] md:text-[52px] text-dark mb-8">
          {t('title')}
        </h2>
      </FadeIn>
      <FadeIn delay={0.15}>
        <div className="max-w-sm mx-auto">
          <Image
            src="/gallery/Plan.png"
            alt={t('title')}
            width={400}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </FadeIn>
    </section>
  )
}
