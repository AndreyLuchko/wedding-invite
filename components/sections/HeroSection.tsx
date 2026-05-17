'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface HeroSectionProps {
  coupleNames: string
}

export function HeroSection({ coupleNames }: HeroSectionProps) {
  const t = useTranslations('hero')

  return (
    <section className="bg-cream min-h-svh relative flex flex-col items-center overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/gallery/bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top-right"
          priority
        />
      </div>

      {/* Gradient fade — bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-1 bg-linear-to-t from-cream to-transparent pointer-events-none" aria-hidden="true" />

      {/* Chandelier — slides in from top */}
      <motion.div
        className="relative z-10 w-[100vw] max-w-[450px]"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        aria-hidden="true"
      >
        <Image
          src="/gallery/chandelier_1.png"
          alt=""
          width={280}
          height={220}
          className="w-full h-auto object-contain"
          priority
        />
      </motion.div>

      {/* Couple names + tagline */}
      <div className="@container relative z-10 w-full max-w-lg px-5 pt-5 text-center">
        <motion.h1
          className="font-wolfgang  text-[68px] text-dark leading-[1.05] mb-4 whitespace-nowrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {coupleNames}
        </motion.h1>

        <motion.p
          className="font-body text-[24px] text-black leading-tight whitespace-pre-line"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('tagline')}
        </motion.p>
      </div>

      {/* Row: left candelabra · date and time · right candelabra */}
      <div className="relative z-10 flex-1 flex items-center w-full max-w-lg px-2 py-6">
        {/* Left candelabra */}
        <motion.div
          className="w-[120px] self-center translate-x-[-25%]"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <Image
            src="/gallery/Candles_1.png"
            alt=""
            width={130}
            height={325}
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* Date and time */}
        <div className="@container flex-1 min-w-0 flex flex-col items-center text-center px-3 pb-30">
          <motion.p
            className="font-body text-[64px] font-normal text-black leading-none tracking-wide mb-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            23.08.26
          </motion.p>

          <motion.p
            className="font-body text-[44px] text-black leading-none tracking-widest"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            17:00
          </motion.p>
        </div>

        {/* Right candelabra — mirrored */}
        <motion.div
          className="w-[120px] self-center translate-x-[25%]"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <Image
            src="/gallery/Candles_1.png"
            alt=""
            width={130}
            height={325}
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  )
}
