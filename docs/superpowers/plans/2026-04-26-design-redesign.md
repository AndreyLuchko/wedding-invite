# Design Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full visual redesign of the wedding invite public page — romantic & airy aesthetic, flower photos as hero and dividers, enhanced animations, remove LoveStorySection, add QuoteSection, all text via ru.json/ro.json.

**Architecture:** Each section component is updated independently; two new components are created (QuoteSection, FlowerDivider). All new text strings are added to both i18n files first, so components can use `useTranslations` immediately. No business logic changes — RSVP, countdown, wishlist copy, Telegram link are untouched.

**Tech Stack:** Next.js 16, Tailwind v4, Framer Motion (already installed), next-intl, Lucide React, next/image

> **Note on testing:** This project has no test setup. Each task verifies with `npm run build` (TypeScript + Next.js compilation) and visual inspection via `npm run dev`. A successful build with no type errors is the passing criterion.

---

## File Map

| File | Action |
|------|--------|
| `lib/i18n/ru.json` | Add new keys (hero.scroll, quote.text, timeline subtitles, location/rsvp/wishlist/telegram updates) |
| `lib/i18n/ro.json` | Same new keys in Romanian |
| `components/sections/FlowerDivider.tsx` | **Create** — reusable flower image strip with gradient fade |
| `components/sections/QuoteSection.tsx` | **Create** — new quote section between hero and timeline |
| `components/sections/HeroSection.tsx` | **Modify** — new layout: flower photo + parallax + ornament divider + scroll hint |
| `components/sections/TimelineSection.tsx` | **Modify** — vertical gold line, icon circles, i18n labels + subtitles, staggered animation |
| `components/sections/LocationSection.tsx` | **Modify** — Great Vibes heading, subtitle, map border, nav button style |
| `components/sections/RSVPSection.tsx` | **Modify** — Great Vibes heading, deadline note in gold |
| `components/sections/WishlistSection.tsx` | **Modify** — Great Vibes heading, gold card border, warmer text |
| `components/sections/TelegramSection.tsx` | **Modify** — Great Vibes heading, refined text/button |
| `app/(public)/[slug]/page.tsx` | **Modify** — remove LoveStorySection, add QuoteSection + FlowerDivider placements |

---

## Task 1: Add all i18n keys

**Files:**
- Modify: `lib/i18n/ru.json`
- Modify: `lib/i18n/ro.json`

- [ ] **Step 1: Replace `lib/i18n/ru.json` with updated content**

```json
{
  "hero": {
    "greeting": "Дорогой(ая)",
    "invitation": "От всего сердца приглашаем вас разделить с нами радость нашей свадьбы!",
    "countdown": {
      "days": "дней",
      "hours": "часов",
      "minutes": "минут",
      "seconds": "секунд"
    },
    "rest": "осталось до свадьбы",
    "scroll": "Листай"
  },
  "quote": {
    "text": "Где двое — там уже целый мир"
  },
  "love_story": { "title": "Наша история" },
  "timeline": {
    "title": "Расписание дня",
    "subtitle": "Программа праздника",
    "ceremony": "Церемония",
    "ceremony_sub": "Официальная регистрация",
    "aperitif": "Фуршет",
    "aperitif_sub": "Лёгкие закуски и приветствие",
    "photo": "Фотосессия",
    "photo_sub": "Памятные моменты",
    "banquet": "Банкет",
    "banquet_sub": "Праздничный ужин",
    "cake": "Торт",
    "cake_sub": "Сладкий момент",
    "dance": "Танцы",
    "dance_sub": "До утра"
  },
  "location": {
    "title": "Место проведения",
    "subtitle": "Где нас найти",
    "navigate": "Открыть в навигаторе"
  },
  "rsvp": {
    "title": "Будете с нами?",
    "deadline": "Просим подтвердить до 1 августа 2026",
    "attending_yes": "Приду",
    "attending_no": "Не смогу",
    "guest_count_label": "Количество гостей (включая вас)",
    "submit": "Отправить",
    "success": "Спасибо! Ждём вас с нетерпением.",
    "already_submitted": "Вы уже подтвердили участие."
  },
  "wishlist": {
    "title": "Подарки",
    "description": "Лучший подарок — ваше присутствие. Если хотите порадовать нас — будем искренне благодарны за денежный подарок.",
    "card_label": "Номер карты",
    "copy": "Скопировать",
    "copied": "Скопировано!"
  },
  "telegram": {
    "title": "Telegram группа",
    "description": "Присоединяйтесь к нашему Telegram-чату — там объявления, координация и фото с праздника.",
    "join": "Присоединиться"
  }
}
```

- [ ] **Step 2: Replace `lib/i18n/ro.json` with updated content**

```json
{
  "hero": {
    "greeting": "Dragă",
    "invitation": "Vă invităm din toată inima să vă bucurați alături de noi de nunta noastră!",
    "countdown": {
      "days": "zile",
      "hours": "ore",
      "minutes": "minute",
      "seconds": "secunde"
    },
    "rest": "mai sunt până la nuntă",
    "scroll": "Derulează"
  },
  "quote": {
    "text": "Acolo unde sunt doi — există deja o lume întreagă"
  },
  "love_story": { "title": "Povestea noastră" },
  "timeline": {
    "title": "Programul zilei",
    "subtitle": "Programul sărbătorii",
    "ceremony": "Ceremonie",
    "ceremony_sub": "Înregistrarea oficială",
    "aperitif": "Aperitiv",
    "aperitif_sub": "Gustări ușoare și salutări",
    "photo": "Fotosesiune",
    "photo_sub": "Momente memorabile",
    "banquet": "Banchet",
    "banquet_sub": "Cina festivă",
    "cake": "Tort",
    "cake_sub": "Momentul dulce",
    "dance": "Dans",
    "dance_sub": "Până dimineața"
  },
  "location": {
    "title": "Locul evenimentului",
    "subtitle": "Unde ne găsiți",
    "navigate": "Deschide în navigator"
  },
  "rsvp": {
    "title": "Veți fi cu noi?",
    "deadline": "Vă rugăm să confirmați până pe 1 august 2026",
    "attending_yes": "Vin",
    "attending_no": "Nu pot veni",
    "guest_count_label": "Numărul de persoane (inclusiv dvs.)",
    "submit": "Trimite",
    "success": "Mulțumim! Vă așteptăm cu nerăbdare.",
    "already_submitted": "Ați confirmat deja participarea."
  },
  "wishlist": {
    "title": "Cadouri",
    "description": "Cel mai bun cadou este prezența voastră. Dacă doriți să ne bucurați — vom fi recunoscători pentru un cadou în bani.",
    "card_label": "Numărul cardului",
    "copy": "Copiați",
    "copied": "Copiat!"
  },
  "telegram": {
    "title": "Grup Telegram",
    "description": "Alăturați-vă grupului nostru de Telegram — acolo sunt anunțuri, coordonare și fotografii de la sărbătoare.",
    "join": "Alăturați-vă"
  }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: No errors. TypeScript will catch missing keys later when components use them.

- [ ] **Step 4: Commit**

```bash
git add lib/i18n/ru.json lib/i18n/ro.json
git commit -m "feat: add i18n keys for redesign (quote, timeline subtitles, rsvp deadline, scroll hint)"
```

---

## Task 2: Create FlowerDivider component

**Files:**
- Create: `components/sections/FlowerDivider.tsx`

- [ ] **Step 1: Create the component**

```tsx
import Image from 'next/image'

interface FlowerDividerProps {
  src?: string
  flip?: boolean
}

export function FlowerDivider({
  src = '/gallery/flowers_4x3.png',
  flip = false,
}: FlowerDividerProps) {
  return (
    <div className="relative w-full h-[110px] overflow-hidden" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        className={`object-cover object-center ${flip ? '-scale-x-100' : ''}`}
      />
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-cream to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-cream to-transparent" />
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Compiles with no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/FlowerDivider.tsx
git commit -m "feat: add FlowerDivider component with gradient fade"
```

---

## Task 3: Create QuoteSection component

**Files:**
- Create: `components/sections/QuoteSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

export function QuoteSection() {
  const t = useTranslations('quote')

  return (
    <section className="py-14 px-11 bg-cream text-center">
      <FadeIn>
        <span
          className="font-heading text-[52px] text-gold/20 leading-none block -mb-2"
          aria-hidden
        >
          "
        </span>
        <p className="font-heading text-[24px] text-dark leading-relaxed mb-5">
          {t('text')}
        </p>
        <p className="font-body text-[9px] tracking-[0.35em] text-gold uppercase">
          23 · 08 · 2026
        </p>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/QuoteSection.tsx
git commit -m "feat: add QuoteSection with i18n quote text"
```

---

## Task 4: Redesign HeroSection

**Files:**
- Modify: `components/sections/HeroSection.tsx`

The current file references a non-existent image (`/gallery/photo_2026-04-25 20.40.49.jpeg`). The new design uses `flowers_9x16.png` (mobile) and `flowers_4x3.png` (desktop) with a parallax effect via `useScroll` + `useTransform`.

- [ ] **Step 1: Replace `components/sections/HeroSection.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeIn } from './FadeIn'

const WEDDING_DATE = new Date('2026-08-23T12:00:00')

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

interface HeroSectionProps {
  guestName: string
  coupleNames: string
}

export function HeroSection({ guestName, coupleNames }: HeroSectionProps) {
  const t = useTranslations('hero')
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    [timeLeft.days, t('countdown.days')],
    [timeLeft.hours, t('countdown.hours')],
    [timeLeft.minutes, t('countdown.minutes')],
    [timeLeft.seconds, t('countdown.seconds')],
  ] as const

  return (
    <section ref={containerRef} className="bg-cream">
      {/* Flower photo with parallax */}
      <div className="relative w-full aspect-[3/4] md:aspect-[4/3] overflow-hidden">
        <motion.div style={{ y: photoY }} className="absolute inset-0 scale-110">
          <Image
            src="/gallery/flowers_9x16.png"
            alt=""
            fill
            className="object-cover object-center md:hidden"
            priority
            aria-hidden
          />
          <Image
            src="/gallery/flowers_4x3.png"
            alt=""
            fill
            className="object-cover object-center hidden md:block"
            priority
            aria-hidden
          />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b from-transparent to-cream" />
      </div>

      {/* Content below photo */}
      <div className="px-9 pb-16 text-center flex flex-col items-center">
        <FadeIn>
          <p className="font-body text-[9px] tracking-[0.35em] text-gold uppercase mb-5">
            {t('greeting')}, {guestName}
          </p>
          <h1 className="font-heading text-[60px] md:text-[80px] text-dark leading-tight mb-4">
            {coupleNames}
          </h1>
          {/* Gold ornament divider */}
          <div className="flex items-center gap-3 w-full max-w-xs mb-3 mx-auto">
            <div className="flex-1 h-px bg-gold/30" />
            <div className="w-[6px] h-[6px] bg-gold rotate-45 shrink-0" />
            <div className="flex-1 h-px bg-gold/30" />
          </div>
          <p className="font-body text-[9px] tracking-[0.35em] text-dark/50 uppercase mb-8">
            23 · 08 · 2026
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex items-end gap-2">
            {units.map(([value, label], i) => (
              <div key={String(label)} className="flex items-end gap-2">
                {i > 0 && (
                  <span className="font-heading text-[28px] text-gold/60 mb-3">·</span>
                )}
                <div className="flex flex-col items-center min-w-[44px]">
                  <span className="font-heading text-[40px] text-dark leading-none tabular-nums">
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className="font-body text-[7px] tracking-[0.2em] text-dark/40 uppercase mt-1">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex flex-col items-center gap-2 mt-9">
            <div className="w-px h-7 bg-gradient-to-b from-gold/40 to-transparent" />
            <motion.span
              className="font-body text-[7px] tracking-[0.25em] text-dark/30 uppercase"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {t('scroll')}
            </motion.span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: No TypeScript errors. If `'scroll'` key is missing from i18n, Task 1 must be done first.

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```
Open any guest URL (e.g. `http://localhost:3000/test-slug`) and check:
- Flower photo appears at top, fills width
- Gradient fades photo into cream background
- Couple names in Great Vibes font, large
- Gold diamond ornament between names and date
- Countdown ticking
- Scroll hint pulsing at bottom
- Parallax effect when scrolling (photo moves slower than page)

- [ ] **Step 4: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat: redesign HeroSection with flower parallax, ornament divider, scroll hint"
```

---

## Task 5: Redesign TimelineSection

**Files:**
- Modify: `components/sections/TimelineSection.tsx`

Changes: vertical gold line, icon in gold circle, label from i18n, subtitle from i18n, staggered FadeIn.

- [ ] **Step 1: Replace `components/sections/TimelineSection.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { Heart, Wine, Camera, UtensilsCrossed, Cake, Music } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FadeIn } from './FadeIn'

interface TimelineItem {
  time: string
  Icon: LucideIcon
  label: string
  sub: string
}

export function TimelineSection() {
  const t = useTranslations('timeline')

  const TIMELINE: TimelineItem[] = [
    { time: '12:00', Icon: Heart,           label: t('ceremony'), sub: t('ceremony_sub') },
    { time: '13:00', Icon: Wine,            label: t('aperitif'), sub: t('aperitif_sub') },
    { time: '14:00', Icon: Camera,          label: t('photo'),    sub: t('photo_sub')    },
    { time: '16:00', Icon: UtensilsCrossed, label: t('banquet'),  sub: t('banquet_sub')  },
    { time: '18:00', Icon: Cake,            label: t('cake'),     sub: t('cake_sub')     },
    { time: '19:00', Icon: Music,           label: t('dance'),    sub: t('dance_sub')    },
  ]

  return (
    <section className="py-16 px-8 bg-white">
      <FadeIn>
        <h2 className="font-heading text-[40px] text-dark text-center mb-1">
          {t('title')}
        </h2>
        <p className="font-body text-[8px] tracking-[0.3em] text-gold uppercase text-center mb-12">
          {t('subtitle')}
        </p>
      </FadeIn>

      <div className="max-w-sm mx-auto relative">
        {/* Vertical gold line */}
        <div className="absolute left-[54px] top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent" />

        <div className="flex flex-col">
          {TIMELINE.map(({ time, Icon, label, sub }, i) => (
            <FadeIn key={time} delay={i * 0.08}>
              <div className="flex items-center gap-4 py-3">
                <span className="font-body text-[10px] text-dark/40 tabular-nums w-10 text-right shrink-0">
                  {time}
                </span>
                <div className="w-6 h-6 rounded-full border border-gold bg-cream flex items-center justify-center shrink-0">
                  <Icon className="w-3 h-3 text-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-[11px] font-medium text-dark">
                    {label}
                  </span>
                  <span className="font-body text-[9px] text-dark/40 mt-0.5">
                    {sub}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: No errors. TypeScript validates that `labelKey` and `subKey` are valid keys of the `timeline` namespace.

- [ ] **Step 3: Visual check — open dev server and confirm**

- Icons appear in small gold circles
- Vertical gold line runs through all items
- Each item has label (normal weight) and subtitle (muted, smaller)
- Items fade in sequentially when scrolling into view

- [ ] **Step 4: Commit**

```bash
git add components/sections/TimelineSection.tsx
git commit -m "feat: redesign TimelineSection with gold icon circles, subtitles, staggered animation"
```

---

## Task 6: Redesign LocationSection

**Files:**
- Modify: `components/sections/LocationSection.tsx`

Changes: Great Vibes heading, gold subtitle label, map border, full-width nav button.

- [ ] **Step 1: Replace `components/sections/LocationSection.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'
import { FadeIn } from './FadeIn'

interface LocationSectionProps {
  venueName: string
  venueAddress: string
  googleMapsEmbedUrl: string
}

export function LocationSection({
  venueName,
  venueAddress,
  googleMapsEmbedUrl,
}: LocationSectionProps) {
  const t = useTranslations('location')
  const navigateUrl = `https://maps.google.com/?q=${encodeURIComponent(venueAddress)}`

  return (
    <section className="py-16 px-8 bg-cream">
      <FadeIn>
        <h2 className="font-heading text-[40px] text-dark text-center mb-1">
          {t('title')}
        </h2>
        <p className="font-body text-[8px] tracking-[0.3em] text-gold uppercase text-center mb-10">
          {t('subtitle')}
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="max-w-lg mx-auto">
          {googleMapsEmbedUrl ? (
            <iframe
              src={googleMapsEmbedUrl}
              className="w-full h-64 border border-gold/20 mb-6"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Wedding venue"
            />
          ) : (
            <div className="w-full h-64 bg-dark/5 border border-gold/20 flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-dark/20" />
            </div>
          )}

          {venueName && (
            <p className="font-heading text-[28px] text-dark text-center mb-2">
              {venueName}
            </p>
          )}
          <p className="font-body text-[9px] tracking-[0.1em] text-dark/50 text-center mb-6 leading-relaxed">
            {venueAddress}
          </p>

          <a
            href={navigateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-gold/50 px-6 py-4 font-body text-[8px] tracking-[0.3em] uppercase text-dark hover:border-gold hover:text-gold transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            {t('navigate')}
          </a>
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/LocationSection.tsx
git commit -m "feat: redesign LocationSection with Great Vibes heading, gold map border, full-width nav button"
```

---

## Task 7: Redesign RSVPSection

**Files:**
- Modify: `components/sections/RSVPSection.tsx`

Changes: Great Vibes heading, deadline note with gold date, refined button styles. All form logic unchanged.

- [ ] **Step 1: Replace `components/sections/RSVPSection.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/RSVPSection.tsx
git commit -m "feat: redesign RSVPSection with Great Vibes heading and deadline note"
```

---

## Task 8: Redesign WishlistSection

**Files:**
- Modify: `components/sections/WishlistSection.tsx`

Changes: Great Vibes heading, warmer text (already in i18n), gold border on card number box.

- [ ] **Step 1: Replace `components/sections/WishlistSection.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/WishlistSection.tsx
git commit -m "feat: redesign WishlistSection with gold border and Great Vibes heading"
```

---

## Task 9: Redesign TelegramSection

**Files:**
- Modify: `components/sections/TelegramSection.tsx`

Changes: Great Vibes heading, refined text (already in i18n), refined button.

- [ ] **Step 1: Replace `components/sections/TelegramSection.tsx`**

```tsx
'use client'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

interface TelegramSectionProps {
  telegramLink: string
}

export function TelegramSection({ telegramLink }: TelegramSectionProps) {
  const t = useTranslations('telegram')
  if (!telegramLink) return null

  return (
    <section className="py-16 px-8 bg-white text-center">
      <FadeIn>
        <h2 className="font-heading text-[40px] text-dark mb-3">
          {t('title')}
        </h2>
        <p className="font-body text-[9px] tracking-[0.08em] text-dark/50 max-w-xs mx-auto mb-10 leading-relaxed">
          {t('description')}
        </p>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-dark text-cream px-10 py-4 font-body text-[8px] tracking-[0.3em] uppercase hover:bg-gold hover:text-dark transition-colors"
        >
          → {t('join')}
        </a>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/TelegramSection.tsx
git commit -m "feat: redesign TelegramSection with Great Vibes heading and refined button"
```

---

## Task 10: Wire everything in page.tsx

**Files:**
- Modify: `app/(public)/[slug]/page.tsx`

Remove `LoveStorySection`. Add `QuoteSection` and four `FlowerDivider` placements.

- [ ] **Step 1: Replace `app/(public)/[slug]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { QuoteSection } from '@/components/sections/QuoteSection'
import { FlowerDivider } from '@/components/sections/FlowerDivider'
import { TimelineSection } from '@/components/sections/TimelineSection'
import { LocationSection } from '@/components/sections/LocationSection'
import { RSVPSection } from '@/components/sections/RSVPSection'
import { WishlistSection } from '@/components/sections/WishlistSection'
import { TelegramSection } from '@/components/sections/TelegramSection'
import ruMessages from '@/lib/i18n/ru.json'
import roMessages from '@/lib/i18n/ro.json'
import type { Language } from '@/lib/types'

const messages = { ru: ruMessages, ro: roMessages }

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!guest) notFound()

  const { data: configRows } = await supabase.from('site_config').select('*')
  const config: Record<string, string> = {}
  for (const row of configRows ?? []) {
    config[row.key] = row.value
  }

  const locale = guest.language as Language

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <main>
        <HeroSection
          guestName={guest.name}
          coupleNames={config.couple_names ?? 'Pavel & Olesya'}
        />
        <QuoteSection />
        <FlowerDivider src="/gallery/flowers_4x3.png" />
        <TimelineSection />
        <FlowerDivider src="/gallery/flowers_1x1.png" flip />
        <LocationSection
          venueName={config.venue_name ?? ''}
          venueAddress={config.venue_address ?? ''}
          googleMapsEmbedUrl={config.google_maps_embed_url ?? ''}
        />
        <FlowerDivider src="/gallery/flowers_4x3.png" />
        <RSVPSection guestId={guest.id} />
        <WishlistSection cardNumber={config.card_number ?? ''} />
        <FlowerDivider src="/gallery/flowers_1x1.png" />
        <TelegramSection telegramLink={config.telegram_link ?? ''} />
      </main>
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Clean build, no TypeScript errors, no missing module errors.

- [ ] **Step 3: Full visual walkthrough on dev server**

```bash
npm run dev
```

Open a guest URL and verify end-to-end:
1. Hero: flower photo → parallax on scroll → names → diamond ornament → countdown → scroll hint
2. Quote: "Где двое — там уже целый мир" (RU) or Romanian equivalent
3. Flower divider strip
4. Timeline: icons in gold circles, subtitles, staggered reveal
5. Flower divider strip (flipped)
6. Location: heading, map, venue name, navigate button
7. Flower divider strip
8. RSVP: heading, deadline in muted text, yes/no buttons, submit
9. Wishlist: gold border card number, copy button
10. Flower divider strip
11. Telegram: heading, description, arrow button

- [ ] **Step 4: Commit**

```bash
git add app/(public)/[slug]/page.tsx
git commit -m "feat: wire redesigned page — remove LoveStory, add QuoteSection and FlowerDividers"
```
