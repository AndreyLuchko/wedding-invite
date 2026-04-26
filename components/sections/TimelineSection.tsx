'use client'
import { useTranslations } from 'next-intl'
import { Heart, Wine, Camera, UtensilsCrossed, Cake, Music } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FadeIn } from './FadeIn'

interface TimelineItem {
  time: string
  Icon: LucideIcon
  label: string
  sub: string
}

export function TimelineSection() {
  const t = useTranslations('timeline')

  const TIMELINE: TimelineItem[] = [
    { time: '12:00', Icon: Heart,           label: t('ceremony'), sub: t('ceremony_sub') },
    { time: '13:00', Icon: Wine,            label: t('aperitif'), sub: t('aperitif_sub') },
    { time: '14:00', Icon: Camera,          label: t('photo'),    sub: t('photo_sub')    },
    { time: '16:00', Icon: UtensilsCrossed, label: t('banquet'),  sub: t('banquet_sub')  },
    { time: '18:00', Icon: Cake,            label: t('cake'),     sub: t('cake_sub')     },
    { time: '19:00', Icon: Music,           label: t('dance'),    sub: t('dance_sub')    },
  ]

  return (
    <section className="py-16 px-8 bg-white">
      <FadeIn>
        <h2 className="font-heading text-[40px] text-dark text-center mb-1">
          {t('title')}
        </h2>
        <p className="font-body text-[8px] tracking-[0.3em] text-gold uppercase text-center mb-12">
          {t('subtitle')}
        </p>
      </FadeIn>

      <div className="max-w-sm mx-auto relative">
        {/* Vertical gold line */}
        <div className="absolute left-17 top-5 bottom-5 w-px bg-linear-to-b from-transparent via-gold/30 to-transparent" />

        <div className="flex flex-col">
          {TIMELINE.map(({ time, Icon, label, sub }, i) => (
            <FadeIn key={time} delay={i * 0.08}>
              <div className="flex items-center gap-4 py-3">
                <span className="font-body text-[10px] text-dark/40 tabular-nums w-10 text-right shrink-0">
                  {time}
                </span>
                <div className="w-6 h-6 rounded-full border border-gold bg-cream flex items-center justify-center shrink-0">
                  <Icon className="w-3 h-3 text-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-[11px] font-medium text-dark">
                    {label}
                  </span>
                  <span className="font-body text-[9px] text-dark/40 mt-0.5">
                    {sub}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
