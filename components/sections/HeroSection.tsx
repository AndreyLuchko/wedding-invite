'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

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
    <section ref={containerRef} className="bg-cream">
      {/* Flower photo with parallax */}
      <div className="relative w-full aspect-[3/4] md:aspect-[4/3] overflow-hidden">
        <motion.div style={{ y: photoY }} className="absolute inset-0 scale-110">
          <Image
            src="/gallery/flowers_9x16.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center md:hidden"
            priority
            aria-hidden="true"
          />
          <Image
            src="/gallery/flowers_4x3.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center hidden md:block"
            aria-hidden="true"
          />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-linear-to-b from-transparent to-cream" />
      </div>

      {/* Content below photo */}
      <div className="px-9 pb-16 text-center flex flex-col items-center">
        <FadeIn>
          <p className="font-body text-[9px] tracking-[0.35em] text-gold uppercase mb-5">
            {t('greeting')}, {guestName}
          </p>
          <h1 className="font-heading text-[60px] md:text-[80px] text-dark leading-tight mb-4">
            {coupleNames}
          </h1>
          {/* Gold ornament divider */}
          <div className="flex items-center gap-3 w-full max-w-xs mb-3 mx-auto">
            <div className="flex-1 h-px bg-gold/30" />
            <div className="w-[6px] h-[6px] bg-gold rotate-45 shrink-0" />
            <div className="flex-1 h-px bg-gold/30" />
          </div>
          <p className="font-body text-[9px] tracking-[0.35em] text-dark/50 uppercase mb-8">
            23 · 08 · 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex items-end gap-2">
            {units.map(([value, label], i) => (
              <div key={String(label)} className="flex items-end gap-2">
                {i > 0 && (
                  <span className="font-heading text-[28px] text-gold/60 mb-3">·</span>
                )}
                <div className="flex flex-col items-center min-w-[44px]">
                  <span className="font-heading text-[40px] text-dark leading-none tabular-nums">
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className="font-body text-[7px] tracking-[0.2em] text-dark/40 uppercase mt-1">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col items-center gap-2 mt-9">
            <div className="w-px h-7 bg-linear-to-b from-gold/40 to-transparent" />
            <motion.span
              className="font-body text-[7px] tracking-[0.25em] text-dark/30 uppercase"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {t('scroll')}
            </motion.span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
