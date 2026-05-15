# TimelineSection Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild TimelineSection to match the screenshot — bg.png background, vertical timeline with alternating image/text layout, scroll-triggered `framer-motion` animations.

**Architecture:** Single component rewrite + i18n additions. No new files. Background identical to HeroSection (`bg.png`, no overlay). Four timeline events in a CSS grid with a centered vertical line; each image animates in from its side via `framer-motion` `whileInView`.

**Tech Stack:** Next.js (App Router), React, framer-motion, next-intl, Tailwind v4

---

## Files

| File | Action |
|------|--------|
| `components/sections/TimelineSection.tsx` | Full rewrite |
| `lib/i18n/ru.json` | Add `departure`, `departure_time`, `ceremony_time`, `banquet_time`, `cake_time` keys |
| `lib/i18n/ro.json` | Same keys in Romanian |

---

### Task 1: Update translation files

**Files:**
- Modify: `lib/i18n/ru.json` (inside `"timeline"` object)
- Modify: `lib/i18n/ro.json` (inside `"timeline"` object)

- [ ] **Step 1: Add keys to ru.json**

Inside the `"timeline"` object, add after `"title"`:

```json
"departure": "Выезд из Кишинёва",
"departure_time": "16:00",
"ceremony_time": "17:00",
"banquet": "Праздничный банкет",
"banquet_time": "18:00",
"cake_time": "00:00",
```

Note: `"banquet"` key already exists with value `"Банкет"` — **replace** it with `"Праздничный банкет"`. All other existing keys remain untouched.

- [ ] **Step 2: Add keys to ro.json**

Inside the `"timeline"` object, add after `"title"`:

```json
"departure": "Plecare din Chișinău",
"departure_time": "16:00",
"ceremony_time": "17:00",
"banquet_time": "18:00",
"cake_time": "00:00",
```

Note: `"banquet"` already exists as `"Banchet"` — update to `"Banchet festiv"`.

- [ ] **Step 3: Verify build compiles**

```bash
cd /Users/andrii/Desktop/HOME/wedding-invite && npx next build 2>&1 | tail -20
```

Expected: no TypeScript or module errors.

---

### Task 2: Rewrite TimelineSection — layout + background

**Files:**
- Modify: `components/sections/TimelineSection.tsx`

- [ ] **Step 1: Replace the entire file with the static layout (no animations yet)**

```tsx
'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export function TimelineSection() {
  const t = useTranslations('timeline')

  return (
    <section className="relative py-14 px-6 bg-cream overflow-hidden">
      {/* Background — same as HeroSection, no overlay */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/gallery/bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Cupid — absolute top-right */}
      <div className="absolute top-0 right-0 z-10 w-32.5" aria-hidden="true">
        <Image
          src="/gallery/Cupid.png"
          alt=""
          width={130}
          height={170}
          className="w-full h-auto"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-sm mx-auto">
        {/* Title */}
        <h2 className="font-heading text-[42px] text-dark mb-10 text-left pl-2">
          {t('title')}
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-dark/30 -translate-x-1/2" />

          <div className="grid grid-cols-[1fr_20px_1fr] gap-y-10 items-center">

            {/* Row 1: shoes | dot | 16:00 Виїзд */}
            <div className="flex justify-end pr-4">
              <Image
                src="/gallery/shoes.png"
                alt="shoes"
                width={90}
                height={90}
                className="w-22.5 h-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center z-10">
              <div className="w-3 h-3 rounded-full bg-dark" />
            </div>
            <div className="pl-4">
              <p className="font-body text-[15px] text-dark leading-snug">
                {t('departure_time')} {t('departure')}
              </p>
            </div>

            {/* Row 2: Церемонія 17:00 | dot | arch */}
            <div className="flex justify-end pr-4">
              <p className="font-body text-[15px] text-dark leading-snug text-right">
                {t('ceremony')} {t('ceremony_time')}
              </p>
            </div>
            <div className="flex items-center justify-center z-10">
              <div className="w-3 h-3 rounded-full bg-dark" />
            </div>
            <div className="pl-4">
              <Image
                src="/gallery/arch.png"
                alt="arch"
                width={90}
                height={90}
                className="w-22.5 h-auto object-contain"
              />
            </div>

            {/* Row 3: photo&glass | dot | 18:00 Банкет */}
            <div className="flex justify-end pr-4">
              <Image
                src="/gallery/photo&glass.png"
                alt="photo and glass"
                width={90}
                height={90}
                className="w-22.5 h-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center z-10">
              <div className="w-3 h-3 rounded-full bg-dark" />
            </div>
            <div className="pl-4">
              <p className="font-body text-[15px] text-dark leading-snug">
                {t('banquet_time')} {t('banquet')}
              </p>
            </div>

            {/* Row 4: Весільний торт 00:00 | dot | Cake_2 */}
            <div className="flex justify-end pr-4">
              <p className="font-body text-[15px] text-dark leading-snug text-right">
                {t('cake')} {t('cake_time')}
              </p>
            </div>
            <div className="flex items-center justify-center z-10">
              <div className="w-3 h-3 rounded-full bg-dark" />
            </div>
            <div className="pl-4">
              <Image
                src="/gallery/Cake_2.png"
                alt="wedding cake"
                width={90}
                height={90}
                className="w-22.5 h-auto object-contain"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Start dev server and visually verify static layout**

```bash
cd /Users/andrii/Desktop/HOME/wedding-invite && npx next dev
```

Open `http://localhost:3000` and scroll to the timeline section. Verify:
- bg.png background visible (same texture as hero)
- Cupid in top-right corner
- Vertical line and 4 dots visible
- All 4 images render (shoes, arch, photo&glass, Cake_2)
- Text labels readable on correct sides

---

### Task 3: Add framer-motion scroll-triggered animations

**Files:**
- Modify: `components/sections/TimelineSection.tsx`

Animation order (all `whileInView`, `viewport={{ once: true }}`):
1. Title + line + dots + text — appear first at delay 0
2. `shoes.png` slides from left — delay 0.2
3. `arch.png` slides from right — delay 0.4
4. `photo&glass.png` slides from left — delay 0.6
5. `Cake_2.png` slides from right — delay 0.8
6. `Cupid.png` slides from top-right — delay 0.1

- [ ] **Step 1: Replace the file with the animated version**

```tsx
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
  transition: { duration: 0.7, delay, ease: 'easeOut' },
})

export function TimelineSection() {
  const t = useTranslations('timeline')

  return (
    <section className="relative py-14 px-6 bg-cream overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/gallery/bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Cupid */}
      <motion.div
        className="absolute top-0 right-0 z-10 w-32.5"
        aria-hidden="true"
        initial={{ opacity: 0, x: 40, y: -40 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
      >
        <Image
          src="/gallery/Cupid.png"
          alt=""
          width={130}
          height={170}
          className="w-full h-auto"
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-sm mx-auto">

        {/* Title */}
        <motion.h2
          className="font-heading text-[42px] text-dark mb-10 text-left pl-2"
          {...fadeIn(0)}
        >
          {t('title')}
        </motion.h2>

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

          <div className="grid grid-cols-[1fr_20px_1fr] gap-y-10 items-center">

            {/* Row 1: shoes | dot | departure */}
            <motion.div className="flex justify-end pr-4" {...slideFrom(-60, 0.2)}>
              <Image
                src="/gallery/shoes.png"
                alt="shoes"
                width={90}
                height={90}
                className="w-22.5 h-auto object-contain"
              />
            </motion.div>
            <motion.div className="flex items-center justify-center z-10" {...fadeIn(0)}>
              <div className="w-3 h-3 rounded-full bg-dark" />
            </motion.div>
            <motion.div className="pl-4" {...fadeIn(0)}>
              <p className="font-body text-[15px] text-dark leading-snug">
                {t('departure_time')} {t('departure')}
              </p>
            </motion.div>

            {/* Row 2: ceremony | dot | arch */}
            <motion.div className="flex justify-end pr-4" {...fadeIn(0)}>
              <p className="font-body text-[15px] text-dark leading-snug text-right">
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
                className="w-22.5 h-auto object-contain"
              />
            </motion.div>

            {/* Row 3: photo&glass | dot | banquet */}
            <motion.div className="flex justify-end pr-4" {...slideFrom(-60, 0.6)}>
              <Image
                src="/gallery/photo&glass.png"
                alt="photo and glass"
                width={90}
                height={90}
                className="w-22.5 h-auto object-contain"
              />
            </motion.div>
            <motion.div className="flex items-center justify-center z-10" {...fadeIn(0)}>
              <div className="w-3 h-3 rounded-full bg-dark" />
            </motion.div>
            <motion.div className="pl-4" {...fadeIn(0)}>
              <p className="font-body text-[15px] text-dark leading-snug">
                {t('banquet_time')} {t('banquet')}
              </p>
            </motion.div>

            {/* Row 4: cake text | dot | Cake_2 */}
            <motion.div className="flex justify-end pr-4" {...fadeIn(0)}>
              <p className="font-body text-[15px] text-dark leading-snug text-right">
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
                className="w-22.5 h-auto object-contain"
              />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify animations in browser**

With dev server running at `http://localhost:3000`:
- Scroll down to timeline section
- Verify: line draws from top to bottom first
- Verify: text labels and dots fade in together with the line
- Verify: shoes slides in from left (delay ~0.2s)
- Verify: arch slides in from right (delay ~0.4s)
- Verify: photo&glass slides in from left (delay ~0.6s)
- Verify: Cake_2 slides in from right (delay ~0.8s)
- Verify: Cupid slides in from top-right on section entry
- Verify: no layout overflow or horizontal scroll

- [ ] **Step 3: Check build passes**

```bash
cd /Users/andrii/Desktop/HOME/wedding-invite && npx next build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` with no errors.
