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
      <section className="py-24 px-6 bg-white text-center">
        <FadeIn>
          <p className="font-heading text-2xl text-dark">
            {status === 'success' ? t('success') : t('already_submitted')}
          </p>
        </FadeIn>
      </section>
    )
  }

  return (
    <section className="py-24 px-6 bg-white">
      <FadeIn>
        <h2 className="font-heading text-4xl text-dark text-center mb-12">
          {t('title')}
        </h2>
      </FadeIn>

      <FadeIn delay={0.2}>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-8">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`flex-1 py-3 font-body text-sm tracking-widest uppercase border transition-colors ${
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
              className={`flex-1 py-3 font-body text-sm tracking-widest uppercase border transition-colors ${
                attending === false
                  ? 'border-dark bg-dark/5 text-dark'
                  : 'border-dark/20 text-dark/60 hover:border-dark'
              }`}
            >
              {t('attending_no')}
            </button>
          </div>

          {attending === true && (
            <div className="space-y-2">
              <label className="font-body text-xs tracking-widest uppercase text-dark/50 block">
                {t('guest_count_label')}
              </label>
              <div className="flex items-center gap-4 border border-dark/20 p-4">
                <button
                  type="button"
                  onClick={() => setGuestCount(c => Math.max(1, c - 1))}
                  className="font-body text-xl text-dark/60 w-8 text-center hover:text-gold transition-colors"
                >
                  −
                </button>
                <span className="font-heading text-2xl text-dark flex-1 text-center tabular-nums">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount(c => Math.min(10, c + 1))}
                  className="font-body text-xl text-dark/60 w-8 text-center hover:text-gold transition-colors"
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
              className="w-full py-4 bg-dark text-cream font-body text-sm tracking-widest uppercase hover:bg-gold hover:text-dark transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '…' : t('submit')}
            </button>
          )}
        </form>
      </FadeIn>
    </section>
  )
}
