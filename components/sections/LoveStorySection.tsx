'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { FadeIn } from './FadeIn'

const PHOTOS = [
  '',
  '',
  '',
]

export function LoveStorySection() {
  const t = useTranslations('love_story')
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + PHOTOS.length) % PHOTOS.length)
  const next = () => setCurrent(i => (i + 1) % PHOTOS.length)

  return (
    <section className="py-24 px-6 bg-cream">
      <FadeIn>
        <h2 className="font-heading text-4xl text-dark text-center mb-12">
          {t('title')}
        </h2>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="relative max-w-xl mx-auto aspect-[3/4] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={PHOTOS[current]}
                alt={`Photo ${current + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-cream/80 p-2 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-dark" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-cream/80 p-2 rounded-full"
          >
            <ChevronRight className="w-5 h-5 text-dark" />
          </button>

          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-cream' : 'bg-cream/40'
                  }`}
              />
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
