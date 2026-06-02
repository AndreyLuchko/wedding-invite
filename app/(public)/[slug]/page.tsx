import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ogImage = '/gallery/Logo_2.png?v=2'
const defaultDescription =
  'От всей души приглашаем Вас разделить с нами этот тёплый и особенный день, наполненный любовью, счастьем и искренними эмоциями.'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data: configRows } = await supabase.from('site_config').select('*')
  const config: Record<string, string> = {}
  for (const row of configRows ?? []) config[row.key] = row.value

  const coupleNames = config.couple_names ?? 'Pavel & Olesya'
  const title = `${coupleNames} — Свадебное приглашение`

  return {
    title,
    description: defaultDescription,
    openGraph: {
      title,
      description: defaultDescription,
      type: 'website',
      locale: 'ru_RU',
      images: [{ url: ogImage, alt: `${coupleNames} — Wedding` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: defaultDescription,
      images: [ogImage],
    },
  }
}
import { MusicPlayer } from '@/components/ui/MusicPlayer'
import { HeroSection } from '@/components/sections/HeroSection'
import { QuoteSection } from '@/components/sections/QuoteSection'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { LocationSection } from '@/components/sections/LocationSection'
import { DressCodeSection } from '@/components/sections/DressCodeSection'
import { RSVPSection } from '@/components/sections/RSVPSection'
import { WishlistSection } from '@/components/sections/WishlistSection'
import { TelegramSection } from '@/components/sections/TelegramSection'
import { CountdownSection } from '@/components/sections/CountdownSection'
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

  const adminSupabase = createAdminClient()
  const { data: existingRsvp } = await adminSupabase
    .from('rsvp_responses')
    .select('id')
    .eq('guest_id', guest.id)
    .maybeSingle()

  const { data: configRows } = await supabase.from('site_config').select('*')
  const config: Record<string, string> = {}
  for (const row of configRows ?? []) {
    config[row.key] = row.value
  }

  const locale = guest.language as Language

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <main className="relative max-w-[450px] mx-auto">
        <div className="absolute top-4 right-3 z-50">
          <MusicPlayer />
        </div>
        <HeroSection
          coupleNames={config.couple_names ?? 'Pavel & Olesya'}
        />
        <QuoteSection greetingText={guest.greeting_text} />
        <LocationSection
          venueName={config.venue_name ?? ''}
          venueAddress={config.venue_address ?? ''}
        />
        <DressCodeSection />
        <TimelineSection />
        <RSVPSection guestId={guest.id} alreadySubmitted={!!existingRsvp} />
        <WishlistSection cardNumber={config.card_number ?? ''} />
        <TelegramSection telegramLink={config.telegram_link ?? ''} />
        <CountdownSection />
      </main>
    </NextIntlClientProvider>
  )
}
