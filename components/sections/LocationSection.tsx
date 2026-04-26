'use client'
import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'
import { FadeIn } from './FadeIn'

interface LocationSectionProps {
  venueName: string
  venueAddress: string
  googleMapsEmbedUrl: string
}

export function LocationSection({
  venueName,
  venueAddress,
  googleMapsEmbedUrl,
}: LocationSectionProps) {
  const t = useTranslations('location')
  const navigateUrl = `https://maps.google.com/?q=${encodeURIComponent(venueAddress)}`

  return (
    <section className="py-16 px-8 bg-cream">
      <FadeIn>
        <h2 className="font-heading text-[40px] text-dark text-center mb-1">
          {t('title')}
        </h2>
        <p className="font-body text-[8px] tracking-[0.3em] text-gold uppercase text-center mb-10">
          {t('subtitle')}
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="max-w-lg mx-auto">
          {googleMapsEmbedUrl ? (
            <iframe
              src={googleMapsEmbedUrl}
              className="w-full h-64 border border-gold/20 mb-6"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Wedding venue"
            />
          ) : (
            <div className="w-full h-64 bg-dark/5 border border-gold/20 flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-dark/20" />
            </div>
          )}

          {venueName && (
            <p className="font-heading text-[28px] text-dark text-center mb-2">
              {venueName}
            </p>
          )}
          <p className="font-body text-[9px] tracking-[0.1em] text-dark/50 text-center mb-6 leading-relaxed">
            {venueAddress}
          </p>

          <a
            href={navigateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-gold/50 px-6 py-4 font-body text-[8px] tracking-[0.3em] uppercase text-dark hover:border-gold hover:text-gold transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            {t('navigate')}
          </a>
        </div>
      </FadeIn>
    </section>
  )
}
