'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { FadeIn } from './FadeIn'

const WEDDING_DATE = new Date('2026-08-23T12:00:00')

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

interface HeroSectionProps {
  guestName: string
  coupleNames: string
}

export function HeroSection({ guestName, coupleNames }: HeroSectionProps) {
  const t = useTranslations('hero')
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    [timeLeft.days, t('countdown.days')],
    [timeLeft.hours, t('countdown.hours')],
    [timeLeft.minutes, t('countdown.minutes')],
    [timeLeft.seconds, t('countdown.seconds')],
  ] as const

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-cream px-6 text-center gap-16">
      <FadeIn>
        <p className="font-body text-sm tracking-[0.3em] text-gold uppercase mb-6">
          {t('greeting')}, {guestName}
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-dark leading-tight mb-4">
          {coupleNames}
        </h1>
        <p className="font-body text-lg text-dark/50 tracking-[0.25em] w-[640px] pb-8">{t('invitation')}</p>
        <p className="font-body text-lg text-dark/50 tracking-[0.25em]">
          23 · 08 · 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className='flex flex-col'>
          <div className="flex gap-8 md:gap-14 ">
            {units.map(([value, label]) => (
              <div key={String(label)} className="flex flex-col items-center gap-2">
                <span className="font-heading text-4xl md:text-5xl text-dark tabular-nums">
                  {String(value).padStart(2, '0')}
                </span>
                <span className="font-body text-[10px] tracking-[0.2em] text-dark/40 uppercase">
                  {label}
                </span>
              </div>
            ))}

          </div>
          <p className="font-body text-lg text-dark/50 tracking-[0.25em] pt-8">
            {t('rest')}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.5}>
        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <Image
            src="/gallery/photo_2026-04-25 20.40.49.jpeg"
            alt={coupleNames}
            width={1920}
            height={1080}
            className="w-full max-h-[70vh] object-cover"
            priority
          />
        </div>
      </FadeIn>
    </section>
  )
}
