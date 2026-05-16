'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

interface LocationSectionProps {
  venueName: string
  venueAddress: string
}

export function LocationSection({ venueName, venueAddress }: LocationSectionProps) {
  const t = useTranslations('location')
  const navigateUrl = `https://maps.google.com/?q=${encodeURIComponent(venueAddress)}`

  return (
    <section className="py-14 px-6 bg-cream">
      <FadeIn>
        <h2 className="font-heading text-[42px] md:text-[52px] text-dark text-center mb-2">
          {t('title')}
        </h2>
        {venueName && (
          <p className="font-body text-[20px] text-dark/80 leading-tight text-center mb-6 mt-6">
            {venueName}
          </p>
        )}
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="max-w-lg mx-auto">
          <div className="relative w-full aspect-4/3 overflow-hidden mb-6">
            <Image
              src="/gallery/Complexul_Turistic_Costesti_1.png"
              alt={venueName}
              fill
              sizes="(min-width: 1024px) 512px, 100vw"
              className="object-cover"
            />
          </div>

          <a
            href={navigateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[20px] text-dark/90 hover:text-dark bg-[#f5f0e8] transition-colors flex items-center justify-center gap-2 w-full border border-[#f5f0e8] py-2 hover:bg-[#f5f0e8]/80"
          >
            {t('navigate')} <span className='bold'>→</span>
          </a>
        </div>
      </FadeIn>
    </section>
  )
}
