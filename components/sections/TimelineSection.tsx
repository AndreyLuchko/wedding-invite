'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const slideFrom = (x: number, delay = 0) => ({
  initial: { opacity: 0, x },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: 'easeOut' as const },
})

export function TimelineSection() {
  const t = useTranslations('timeline')

  return (
    <section className="relative pt-14 pb-20 px-6 bg-cream overflow-hidden">
      {/* Background — same as HeroSection, no overlay */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/gallery/bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-60"
        />
      </div>

      {/* Gradient fade — top */}
      <div className="absolute inset-x-0 top-0 h-32 z-1 bg-linear-to-b from-cream to-transparent pointer-events-none" aria-hidden="true" />
      {/* Gradient fade — bottom */}
      <div className="absolute inset-x-0 bottom-0 h-32 z-1 bg-linear-to-t from-cream to-transparent pointer-events-none" aria-hidden="true" />

      {/* Main content */}
      <div className="relative z-10 max-w-sm mx-auto">
        {/* Title — centered, alone */}
        <motion.h2
          className="font-heading text-[42px] md:text-[52px] text-dark text-center mb-30"
          {...fadeIn(0)}
        >
          {t('title')}
        </motion.h2>

        {/* Cupid — absolute right, below title, ~1/4 container width, overlaps timeline */}
        <motion.div
          className="absolute -right-9 top-16 w-[140px]"
          aria-hidden="true"
          initial={{ opacity: 0, x: 30, y: -20 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' as const }}
        >
          <Image
            src="/gallery/Cupid.png"
            alt=""
            width={96}
            height={126}
            className="w-full h-auto"
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px bg-dark/30 -translate-x-1/2 origin-top"
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0 }}
          />

          <div className="grid grid-cols-[1fr_20px_1fr]  items-center">

            {/* Row 1: shoes | dot | 16:00 Виїзд */}
            <motion.div className="flex justify-end pr-4" {...slideFrom(-60, 0.2)}>
              <Image
                src="/gallery/shoes.png"
                alt="shoes"
                width={90}
                height={90}
                className="w-[90px] h-auto object-contain"
              />
            </motion.div>
            <motion.div className="flex items-center justify-center z-10" {...fadeIn(0)}>
              <div className="w-3 h-3 rounded-full bg-dark" />
            </motion.div>
            <motion.div className="pl-4" {...fadeIn(0)}>
              <p className="font-body text-[20px] text-dark leading-tight">
                {t('departure_time')} {t('departure')}
              </p>
            </motion.div>

            {/* Row 2: Церемонія 17:00 | dot | arch */}
            <motion.div className="flex justify-end pr-4" {...fadeIn(0)}>
              <p className="font-body text-[20px] text-dark leading-tight text-right">
                {t('ceremony')} {t('ceremony_time')}
              </p>
            </motion.div>
            <motion.div className="flex items-center justify-center z-10" {...fadeIn(0)}>
              <div className="w-3 h-3 rounded-full bg-dark" />
            </motion.div>
            <motion.div className="pl-4" {...slideFrom(60, 0.4)}>
              <Image
                src="/gallery/arch.png"
                alt="arch"
                width={90}
                height={90}
                className="w-[90px] h-auto object-contain"
              />
            </motion.div>

            {/* Row 3: photo&glass | dot | 18:00 Банкет */}
            <motion.div className="flex justify-end pr-4" {...slideFrom(-60, 0.6)}>
              <Image
                src="/gallery/photo&glass.png"
                alt="photo and glass"
                width={90}
                height={90}
                className="w-[90px] h-auto object-contain"
              />
            </motion.div>
            <motion.div className="flex items-center justify-center z-10" {...fadeIn(0)}>
              <div className="w-3 h-3 rounded-full bg-dark" />
            </motion.div>
            <motion.div className="pl-4" {...fadeIn(0)}>
              <p className="font-body text-[20px] text-dark leading-tight">
                {t('banquet_time')} {t('banquet')}
              </p>
            </motion.div>

            {/* Row 4: Весільний торт 00:00 | dot | Cake_2 */}
            <motion.div className="flex justify-end pr-4" {...fadeIn(0)}>
              <p className="font-body text-[20px] text-dark leading-tight text-right">
                {t('cake')} {t('cake_time')}
              </p>
            </motion.div>
            <motion.div className="flex items-center justify-center z-10" {...fadeIn(0)}>
              <div className="w-3 h-3 rounded-full bg-dark" />
            </motion.div>
            <motion.div className="pl-4" {...slideFrom(60, 0.8)}>
              <Image
                src="/gallery/Cake_2.png"
                alt="wedding cake"
                width={90}
                height={90}
                className="w-[90px] h-auto object-contain"
              />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
