'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Copy, Check } from 'lucide-react'
import { FadeIn } from './FadeIn'

interface WishlistSectionProps {
  cardNumber: string
}

export function WishlistSection({ cardNumber }: WishlistSectionProps) {
  const t = useTranslations('wishlist')
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(cardNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 px-6 bg-cream">
      <FadeIn>
        <h2 className="font-serif text-4xl text-dark text-center mb-4">
          {t('title')}
        </h2>
        <p className="font-sans text-sm text-dark/50 text-center max-w-sm mx-auto mb-12">
          {t('description')}
        </p>
      </FadeIn>

      {cardNumber && (
        <FadeIn delay={0.2}>
          <div className="max-w-xs mx-auto">
            <p className="font-sans text-xs tracking-widest uppercase text-dark/40 text-center mb-3">
              {t('card_label')}
            </p>
            <div className="flex items-center justify-between border border-dark/20 px-4 py-3">
              <span className="font-sans text-lg tracking-widest text-dark">
                {cardNumber}
              </span>
              <button
                onClick={handleCopy}
                aria-label={copied ? t('copied') : t('copy')}
                className="text-dark/40 hover:text-gold transition-colors ml-4"
              >
                {copied
                  ? <Check className="w-4 h-4 text-gold" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>
            {copied && (
              <p className="text-center font-sans text-xs text-gold mt-2">
                {t('copied')}
              </p>
            )}
          </div>
        </FadeIn>
      )}
    </section>
  )
}
