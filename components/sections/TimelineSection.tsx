'use client'
import { useTranslations } from 'next-intl'
import { Clock, Camera, Wine, UtensilsCrossed, Music, Cake } from 'lucide-react'
import { FadeIn } from './FadeIn'

const TIMELINE = [
  { time: '12:00', Icon: Clock,            label: 'Церемония / Ceremonie' },
  { time: '13:00', Icon: Wine,             label: 'Фуршет / Aperitiv' },
  { time: '14:00', Icon: Camera,           label: 'Фотосессия / Fotosesiune' },
  { time: '16:00', Icon: UtensilsCrossed,  label: 'Банкет / Banchet' },
  { time: '18:00', Icon: Cake,             label: 'Торт / Tort' },
  { time: '19:00', Icon: Music,            label: 'Танцы / Dans' },
]

export function TimelineSection() {
  const t = useTranslations('timeline')

  return (
    <section className="py-24 px-6 bg-white">
      <FadeIn>
        <h2 className="font-serif text-4xl text-dark text-center mb-16">
          {t('title')}
        </h2>
      </FadeIn>

      <div className="max-w-md mx-auto space-y-6">
        {TIMELINE.map(({ time, Icon, label }, i) => (
          <FadeIn key={time} delay={i * 0.08}>
            <div className="flex items-center gap-5">
              <span className="font-sans text-sm text-dark/50 tabular-nums w-12 shrink-0">
                {time}
              </span>
              <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <div className="h-px flex-1 bg-dark/10" />
              <span className="font-sans text-sm text-dark/70 text-right">
                {label}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
