'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'
import { submitRsvp } from '@/app/actions/rsvp'

interface RSVPSectionProps {
  guestId: string
  alreadySubmitted?: boolean
}

export function RSVPSection({ guestId, alreadySubmitted = false }: RSVPSectionProps) {
  const t = useTranslations('rsvp')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState(1)
  const [needsTransport, setNeedsTransport] = useState<boolean | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already'>(
    alreadySubmitted ? 'already' : 'idle'
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (attending === null) return
    if (attending === true && needsTransport === null) return
    setStatus('loading')
    const result = await submitRsvp(guestId, attending, guestCount, needsTransport)
    if (result.error === 'already_submitted') setStatus('already')
    else if (result.success) setStatus('success')
    else setStatus('idle')
  }

  if (status === 'success' || status === 'already') {
    const message = status === 'already'
      ? t('already_submitted')
      : attending
        ? t('success')
        : t('success_decline')

    return (
      <section className="py-16 px-8 bg-white text-center">
        <FadeIn>
          <p className="font-heading text-[32px] text-dark">{message}</p>
        </FadeIn>
      </section>
    )
  }

  return (
    <section className="py-16 px-8">
      <FadeIn>
        <h2 className="font-heading text-[42px] md:text-[52px] text-dark text-center leading-tight mb-3">
          {t('title')}
        </h2>
        <p className="font-body text-[20px] text-[#8B4050] text-center mb-8 leading-tight">
          {t('deadline')}
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setAttending(true); setNeedsTransport(null) }}
              className={`flex-1 py-4 font-body text-[12px] tracking-[0.25em] uppercase border transition-colors cursor-pointer ${attending === true
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-[#f5f0e8] bg-white/60 text-dark/60 hover:bg-[#f5f0e8] hover:text-dark'
                }`}
            >
              {t('attending_yes')}
            </button>
            <button
              type="button"
              onClick={() => { setAttending(false); setNeedsTransport(null) }}
              className={`flex-1 py-4 font-body text-[12px] tracking-[0.25em] uppercase border cursor-pointer transition-colors ${attending === false
                ? 'border-dark/60 bg-dark/5 text-dark'
                : 'border-[#f5f0e8] bg-white/60 text-dark/60 hover:bg-[#f5f0e8] hover:text-dark'
                }`}
            >
              {t('attending_no')}
            </button>
          </div>

          {attending === true && (
            <div className="space-y-2">
              <p className="font-body text-[12px] tracking-[0.25em] uppercase text-dark/40">
                {t('guest_count_label')}
              </p>
              <div className="flex items-center gap-4 border border-dark/15 p-4">
                <button
                  type="button"
                  onClick={() => setGuestCount(c => Math.max(1, c - 1))}
                  className="font-body text-[12px] text-dark/50 w-8 text-center border border-[#f5f0e8] hover:bg-[#f5f0e8] hover:text-dark transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="font-body text-[36px] text-dark flex-1 text-center tabular-nums">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount(c => Math.min(10, c + 1))}
                  className="font-body text-[12px] text-dark/50 w-8 text-center border border-[#f5f0e8] hover:bg-[#f5f0e8] hover:text-dark transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {attending === true && (
            <div className="space-y-2">
              <p className="font-body text-[12px] tracking-[0.25em] uppercase text-dark/40">
                {t('transfer_question')}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNeedsTransport(true)}
                  className={`flex-1 py-4 font-body text-[12px] tracking-[0.25em] uppercase border transition-colors cursor-pointer ${needsTransport === true
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-[#f5f0e8] bg-white/60 text-dark/60 hover:bg-[#f5f0e8] hover:text-dark'
                    }`}
                >
                  {t('transfer_yes')}
                </button>
                <button
                  type="button"
                  onClick={() => setNeedsTransport(false)}
                  className={`flex-1 py-4 font-body text-[12px] tracking-[0.25em] uppercase border cursor-pointer transition-colors ${needsTransport === false
                    ? 'border-dark/60 bg-dark/5 text-dark'
                    : 'border-[#f5f0e8] bg-white/60 text-dark/60 hover:bg-[#f5f0e8] hover:text-dark'
                    }`}
                >
                  {t('transfer_no')}
                </button>
              </div>
            </div>
          )}

          {attending !== null && (
            <button
              type="submit"
              disabled={status === 'loading' || (attending === true && needsTransport === null)}
              className="w-full py-4 bg-white/60 text-dark font-body text-[14px] tracking-[0.3em] uppercase border border-[#f5f0e8] hover:bg-[#f5f0e8] hover:text-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default"
            >
              {status === 'loading' ? '…' : t('submit')}
            </button>
          )}
        </form>
      </FadeIn>
    </section>
  )
}
