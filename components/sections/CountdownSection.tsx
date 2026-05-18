'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

const WEDDING_DATE = new Date('2026-08-23T17:00:00')

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  }
}

export function CountdownSection() {
  const t = useTranslations('countdown')
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="py-16 px-8 bg-white text-center">
      <FadeIn>
        <h2 className="font-heading text-[38px] md:text-[48px] text-dark mb-10 leading-tight">
          {t('title')}
        </h2>

        <div className="flex justify-center gap-8 mb-10">
          {(['days', 'hours', 'minutes'] as const).map((unit) => (
            <div key={unit} className="flex flex-col items-center">
              <span className="font-body text-[42px] md:text-[52px] text-dark leading-none">
                {String(time[unit]).padStart(2, '0')}
              </span>
              <span className="font-body text-[12px] tracking-[0.2em] uppercase text-dark/50 mt-2">
                {t(unit)}
              </span>
            </div>
          ))}
        </div>

        <p className="font-body text-[16px] tracking-[0.08em] text-dark/50">
          {t('subtitle')}
        </p>
      </FadeIn>
    </section>
  )
}
