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
    <section className="py-24 px-6 bg-cream">
      <FadeIn>
        <h2 className="font-heading text-4xl text-dark text-center mb-3">
          {t('title')}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-12">
          <MapPin className="w-4 h-4 text-gold" />
          <p className="font-body text-sm text-dark/50">{venueName}</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="max-w-2xl mx-auto">
          {googleMapsEmbedUrl ? (
            <iframe
              src={googleMapsEmbedUrl}
              className="w-full h-72 border-0 mb-6"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Wedding venue"
            />
          ) : (
            <div className="w-full h-72 bg-dark/5 flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-dark/20" />
            </div>
          )}

          <div className="text-center">
            <p className="font-body text-sm text-dark/50 mb-6">{venueAddress}</p>
            <a
              href={navigateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-dark/20 px-6 py-3 font-body text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {t('navigate')}
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
