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

  // Flower parallax: photo moves up slower than scroll
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const photoOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  // Content: gently lifts and fades as user scrolls
  const contentY = useTransform(scrollYProgress, [0, 0.6], ['0px', '-28px'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

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
    <section
      ref={containerRef}
      className="bg-cream min-h-svh relative overflow-hidden flex flex-col"
    >
      {/* Photo */}
      <div className="absolute top-0 inset-x-0 flex justify-center" aria-hidden="true">
        <div className="relative h-[32vh] w-full overflow-hidden bg-cream md:max-w-5xl">
          <motion.div
            style={{ y: photoY, opacity: photoOpacity }}
            className="absolute inset-0 md:-top-16 md:h-[calc(100%+4rem)]"
          >
            <Image
              src="/gallery/flowers_4x3.png"
              alt=""
              fill
              sizes="(min-width: 768px) 1024px, 100vw"
              className="object-cover object-top"
              priority
            />
          </motion.div>
          <div
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, #FAFAF8 88%)' }}
          />
        </div>
      </div>

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex-1 flex flex-col items-center px-6 pt-[28vh] pb-12 md:justify-center md:pt-[13%]"
      >
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">

          {/* Greeting */}
          <FadeIn>
            <p className="font-body text-[8px] tracking-[0.45em] text-gold uppercase mb-8">
              {t('greeting')}, {guestName}
            </p>
          </FadeIn>

          {/* Couple names */}
          <FadeIn delay={0.1}>
            <h1 className="font-heading text-[68px] md:text-[90px] text-dark leading-[1.05] text-center mb-5">
              {coupleNames}
            </h1>
          </FadeIn>

          {/* Gold ornament divider */}
          <FadeIn delay={0.2}>
            <div className="flex items-center gap-3 w-40 mb-4 mx-auto">
              <div className="flex-1 h-px bg-gold/30" />
              <div className="w-1 h-1 bg-gold rotate-45 shrink-0" />
              <div className="flex-1 h-px bg-gold/30" />
            </div>
          </FadeIn>

          {/* Invitation */}
          <FadeIn delay={0.25}>
            <p className="font-body text-sm md:text-base leading-relaxed text-dark/70 text-center max-w-md mb-4">
              {t('invitation')}
            </p>
          </FadeIn>

          {/* Gold ornament divider */}
          <FadeIn delay={0.3}>
            <div className="flex items-center gap-3 w-40 mb-4 mx-auto">
              <div className="flex-1 h-px bg-gold/30" />
              <div className="w-1 h-1 bg-gold rotate-45 shrink-0" />
              <div className="flex-1 h-px bg-gold/30" />
            </div>
          </FadeIn>

          {/* Date */}
          <FadeIn delay={0.35}>
            <p className="font-body text-[12px] tracking-[0.4em] text-dark/45 uppercase mb-4">
              23 · 08 · 2026
            </p>
          </FadeIn>

          {/* Rest */}
          <FadeIn delay={0.4}>
            <h3 className="font-heading md:text-xl leading-relaxed text-dark/70 text-center max-w-md mb-10 mt-10">
              {t('rest')}
            </h3>
          </FadeIn>

          {/* Countdown */}
          <FadeIn delay={0.45}>
            <div className="flex items-end gap-2 mb-10">
              {units.map(([value, label], i) => (
                <div key={String(label)} className="flex items-end gap-2">
                  {i > 0 && (
                    <span className="font-heading text-[24px] text-gold/50 mb-2.5">·</span>
                  )}
                  <div className="flex flex-col items-center min-w-11">
                    <span className="font-heading text-[38px] text-dark leading-none tabular-nums">
                      {String(value).padStart(2, '0')}
                    </span>
                    <span className="font-body text-[7px] tracking-[0.2em] text-dark/35 uppercase mt-1">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Scroll indicator */}
          <FadeIn delay={0.6}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-px h-6 bg-linear-to-b from-gold/40 to-transparent" />
              <motion.span
                className="font-body text-[7px] tracking-[0.25em] text-dark/30 uppercase"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {t('scroll')}
              </motion.span>
            </div>
          </FadeIn>

        </div>
      </motion.div>
    </section>
  )
}
