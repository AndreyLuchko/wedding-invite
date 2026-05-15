'use client'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

interface QuoteSectionProps {
  greetingText: string
}

export function QuoteSection({ greetingText }: QuoteSectionProps) {
  const tQ = useTranslations('quote')
  const tH = useTranslations('hero')
  const rowRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rowRef, { once: true, margin: '-60px 0px 0px 0px' })

  return (
    <section className="relative pt-12 pb-0 px-0 bg-cream text-center">
      {/* Background — same texture as HeroSection but lighter */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/gallery/bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top-right opacity-40"
        />
      </div>

      <div className="relative z-10">
        {/* Heading + invitation text */}
        <FadeIn>
          <h2 className="font-heading text-[42px] md:text-[52px] text-dark leading-[1.15] mb-5 px-6">
            {tQ('dear')}
            <br />
            {greetingText}
          </h2>
          <p className="font-body text-[16px] text-[#8B4050] leading-relaxed max-w-xs mx-auto mb-8 px-6">
            {tH('invitation')}
          </p>
        </FadeIn>

        {/* Calendar image + decorations */}
        <div ref={rowRef} className="flex items-start justify-center overflow-hidden">
          {/* Cake — smaller, top-aligned, slides in from left */}
          <motion.div
            className="shrink-0 w-[22vw] max-w-30 self-start"
            initial={{ x: -70, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: -70, opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <Image
              src="/gallery/Cake_1.png"
              alt=""
              width={120}
              height={160}
              className="w-full h-auto object-contain object-top"
            />
          </motion.div>

          {/* Calendar — top-aligned */}
          <FadeIn delay={0.1} className="self-start shrink-0 w-[44vw] max-w-55">
            <Image
              src="/gallery/Calendar_1.png"
              alt="August 23, 2026"
              width={220}
              height={270}
              className="w-full h-auto object-contain"
            />
          </FadeIn>

          {/* Glasses — 2x bigger, bottom-aligned, slides in from right */}
          <motion.div
            className="shrink-0 w-[56vw] max-w-34 self-end pt-16 pb-16"
            initial={{ x: 70, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: 70, opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.2 }}
            aria-hidden="true"
          >
            <Image
              src="/gallery/Glasses_1.png"
              alt=""
              width={290}
              height={380}
              className="w-full h-auto object-contain object-bottom"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
