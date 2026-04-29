import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { QuoteSection } from '@/components/sections/QuoteSection'
import { FlowerDivider } from '@/components/sections/FlowerDivider'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { LocationSection } from '@/components/sections/LocationSection'
import { RSVPSection } from '@/components/sections/RSVPSection'
import { WishlistSection } from '@/components/sections/WishlistSection'
import { TelegramSection } from '@/components/sections/TelegramSection'
import ruMessages from '@/lib/i18n/ru.json'
import roMessages from '@/lib/i18n/ro.json'
import type { Language } from '@/lib/types'

const messages = { ru: ruMessages, ro: roMessages }

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!guest) notFound()

  const { data: configRows } = await supabase.from('site_config').select('*')
  const config: Record<string, string> = {}
  for (const row of configRows ?? []) {
    config[row.key] = row.value
  }

  const locale = guest.language as Language

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <main>
        <HeroSection
          guestName={guest.name}
          coupleNames={config.couple_names ?? 'Pavel & Olesya'}
        />
        <QuoteSection />
        <FlowerDivider src="/gallery/flowers_4x3.png" />
        <TimelineSection />
        <FlowerDivider src="/gallery/flowers_4x3.png" flip />
        <LocationSection
          venueName={config.venue_name ?? ''}
          venueAddress={config.venue_address ?? ''}
          googleMapsEmbedUrl={config.google_maps_embed_url ?? ''}
        />
        <FlowerDivider src="/gallery/flowers_4x3.png" />
        <RSVPSection guestId={guest.id} />
        <WishlistSection cardNumber={config.card_number ?? ''} />
        <FlowerDivider src="/gallery/flowers_4x3.png" />
        <TelegramSection telegramLink={config.telegram_link ?? ''} />
      </main>
    </NextIntlClientProvider>
  )
}
