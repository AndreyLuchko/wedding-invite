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

      {/* Gradient fade — top */}
      <div className="absolute inset-x-0 top-0 h-32 z-1 bg-linear-to-b from-cream to-transparent pointer-events-none" aria-hidden="true" />
      {/* Gradient fade — bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32 z-1 bg-linear-to-t from-cream to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative z-10">
        {/* Heading + invitation text */}
        <FadeIn>
          <h2 className="font-heading text-[42px] md:text-[52px] text-dark leading-[1.15] mb-5 px-6">
            {greetingText.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h2>
          <p className="font-body text-[20px] text-[#8B4050] leading-tight max-w-xs mx-auto mb-8 mt-8 px-6">
            {tH('invitation')}
          </p>

        </FadeIn>

        {/* Calendar image + decorations */}
        <div ref={rowRef} className="flex justify-center overflow-hidden pb-20">
          {/* Calendar — anchor block; Cake and Glasses are absolutely positioned relative to it */}
          <div className="relative w-[65vw] max-w-65">
            <FadeIn delay={0.1}>
              <Image
                src="/gallery/Calendar_1.png"
                alt="August 23, 2026"
                width={220}
                height={270}
                className="w-full h-auto object-contain"
              />
            </FadeIn>

            {/* Cake — absolute, anchored to Calendar block, slides in from left */}
            <motion.div
              className="absolute top-0 right-full w-[30vw] max-w-30"
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

            {/* Glasses — absolute, anchored to Calendar block, slides in from right */}
            <motion.div
              className="absolute -bottom-15 left-[83%] w-[35vw] max-w-35"
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
      </div>
    </section>
  )
}
