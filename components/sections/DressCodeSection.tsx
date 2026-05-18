'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

const SWATCHES = [
  '#b8999b',
  '#7b6560',
  '#f5f0e8',
  '#c4b4a6',
  '#d4d0cb',
]

function SwatchItem({ color }: { color: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="w-11 h-11 rounded-full border border-black/5 cursor-pointer"
      style={{
        backgroundColor: color,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
        transform: hovered ? 'scale(1.35) translateY(-8px)' : 'scale(1) translateY(0)',
        boxShadow: hovered
          ? `0 14px 28px ${color}99, 0 6px 10px rgba(0,0,0,0.15)`
          : '0 2px 6px rgba(0,0,0,0.10)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  )
}

export function DressCodeSection() {
  const t = useTranslations('dress_code')

  return (
    <section className="py-14 px-6 bg-cream text-center">
      <FadeIn>
        <h2 className="font-heading text-[42px] md:text-[52px] text-dark mb-5">
          {t('title')}
        </h2>
        <p className="font-body text-[20px] text-dark/80 leading-tight max-w-xs mx-auto mb-10">
          {t('description')}
        </p>
        <div className="flex justify-center items-center gap-4">
          {SWATCHES.map((color) => (
            <SwatchItem key={color} color={color} />
          ))}
        </div>
      </FadeIn>
    </section>
  )
}
