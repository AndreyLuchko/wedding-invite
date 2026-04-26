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
    <section className="py-16 px-8 bg-cream">
      <FadeIn>
        <h2 className="font-heading text-[40px] text-dark text-center mb-3">
          {t('title')}
        </h2>
        <p className="font-body text-[9px] tracking-[0.08em] text-dark/50 text-center max-w-xs mx-auto mb-10 leading-relaxed">
          {t('description')}
        </p>
      </FadeIn>

      {cardNumber && (
        <FadeIn delay={0.2}>
          <div className="max-w-xs mx-auto">
            <p className="font-body text-[8px] tracking-[0.25em] uppercase text-dark/40 text-center mb-3">
              {t('card_label')}
            </p>
            <div className="flex items-center justify-between border border-gold/40 px-5 py-4">
              <span className="font-body text-[15px] tracking-[0.15em] text-dark">
                {cardNumber}
              </span>
              <button
                onClick={handleCopy}
                aria-label={copied ? t('copied') : t('copy')}
                className="text-dark/40 hover:text-gold transition-colors ml-4 shrink-0"
              >
                {copied
                  ? <Check className="w-4 h-4 text-gold" />
                  : <Copy className="w-4 h-4" />
                }
              </button>
            </div>
            {copied && (
              <p className="text-center font-body text-[9px] text-gold mt-2 tracking-widest">
                {t('copied')}
              </p>
            )}
          </div>
        </FadeIn>
      )}
    </section>
  )
}
