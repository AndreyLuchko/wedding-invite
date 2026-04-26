'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'
import { submitRsvp } from '@/app/actions/rsvp'

interface RSVPSectionProps {
  guestId: string
}

export function RSVPSection({ guestId }: RSVPSectionProps) {
  const t = useTranslations('rsvp')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (attending === null) return
    setStatus('loading')
    const result = await submitRsvp(guestId, attending, guestCount)
    if (result.error === 'already_submitted') setStatus('already')
    else if (result.success) setStatus('success')
    else setStatus('idle')
  }

  if (status === 'success' || status === 'already') {
    return (
      <section className="py-16 px-8 bg-white text-center">
        <FadeIn>
          <p className="font-heading text-[32px] text-dark">
            {status === 'success' ? t('success') : t('already_submitted')}
          </p>
        </FadeIn>
      </section>
    )
  }

  return (
    <section className="py-16 px-8 bg-white">
      <FadeIn>
        <h2 className="font-heading text-[40px] text-dark text-center mb-3">
          {t('title')}
        </h2>
        <p className="font-body text-[9px] tracking-[0.08em] text-dark/50 text-center mb-8 leading-relaxed">
          {t('deadline')}
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`flex-1 py-4 font-body text-[8px] tracking-[0.25em] uppercase border transition-colors ${
                attending === true
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-dark/20 text-dark/60 hover:border-gold hover:text-gold'
              }`}
            >
              {t('attending_yes')}
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`flex-1 py-4 font-body text-[8px] tracking-[0.25em] uppercase border transition-colors ${
                attending === false
                  ? 'border-dark/60 bg-dark/5 text-dark'
                  : 'border-dark/20 text-dark/60 hover:border-dark/60'
              }`}
            >
              {t('attending_no')}
            </button>
          </div>

          {attending === true && (
            <div className="space-y-2">
              <label className="font-body text-[8px] tracking-[0.25em] uppercase text-dark/40 block">
                {t('guest_count_label')}
              </label>
              <div className="flex items-center gap-4 border border-dark/15 p-4">
                <button
                  type="button"
                  onClick={() => setGuestCount(c => Math.max(1, c - 1))}
                  className="font-body text-xl text-dark/50 w-8 text-center hover:text-gold transition-colors"
                >
                  −
                </button>
                <span className="font-heading text-[28px] text-dark flex-1 text-center tabular-nums">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount(c => Math.min(10, c + 1))}
                  className="font-body text-xl text-dark/50 w-8 text-center hover:text-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {attending !== null && (
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 bg-dark text-cream font-body text-[8px] tracking-[0.3em] uppercase hover:bg-gold hover:text-dark transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '…' : t('submit')}
            </button>
          )}
        </form>
      </FadeIn>
    </section>
  )
}
