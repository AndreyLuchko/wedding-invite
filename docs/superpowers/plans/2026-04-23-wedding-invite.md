# Wedding Invite Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personalized digital wedding invitation with Next.js + Supabase, featuring per-guest URLs, bilingual support (Russian/Romanian), and an admin dashboard for guest management and RSVP tracking.

**Architecture:** Single Next.js 15 monorepo with route groups `(public)` for guest invitation pages and `(admin)` for the dashboard. Supabase handles PostgreSQL, Auth, and RLS. Guest language is determined from the DB field — no locale in the URL.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS, Framer Motion, shadcn/ui, next-intl, Supabase (@supabase/ssr), Vercel

---

## File Map

```
app/
├── (public)/[slug]/page.tsx        ← personalized guest page
├── (admin)/
│   ├── layout.tsx                  ← admin shell with nav
│   ├── login/page.tsx
│   ├── guests/page.tsx
│   └── rsvp/page.tsx
├── api/export/rsvp/route.ts        ← CSV download endpoint
├── actions/
│   ├── rsvp.ts                     ← submitRsvp server action
│   └── guests.ts                   ← addGuest, deleteGuest server actions
├── layout.tsx                      ← root layout (fonts)
├── page.tsx                        ← redirects to /admin/login
└── not-found.tsx

components/
├── sections/
│   ├── FadeIn.tsx
│   ├── HeroSection.tsx
│   ├── LoveStorySection.tsx
│   ├── TimelineSection.tsx
│   ├── LocationSection.tsx
│   ├── RSVPSection.tsx
│   ├── WishlistSection.tsx
│   └── TelegramSection.tsx
└── admin/
    └── GuestsTable.tsx

lib/
├── supabase/
│   ├── client.ts                   ← browser client
│   └── server.ts                   ← server client (async, cookie-based)
├── i18n/
│   ├── ru.json
│   └── ro.json
├── utils/
│   └── slug.ts                     ← nameToSlug (Cyrillic → Latin)
└── types.ts

middleware.ts                       ← protects /admin/* (except /admin/login)
supabase/migrations/001_initial.sql
public/gallery/.gitkeep            ← drop wedding photos here
```

---

## Task 1: Initialize project + install dependencies

**Files:**
- Creates: full Next.js scaffold

- [ ] **Step 1: Scaffold Next.js 15**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"
```

When prompted: TypeScript ✓, ESLint ✓, Tailwind ✓, App Router ✓, no `src/` dir, import alias `@/*`

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install framer-motion lucide-react @supabase/ssr @supabase/supabase-js next-intl clsx tailwind-merge
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted: Default style, Neutral base color, CSS variables: yes

- [ ] **Step 4: Add shadcn components used in admin**

```bash
npx shadcn@latest add button input label badge
```

- [ ] **Step 5: Verify dev server starts cleanly**

```bash
npm run dev
```

Expected: `ready - started server on http://localhost:3000`, no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 15 project with all dependencies"
```

---

## Task 2: Supabase project + DB schema

**Files:**
- Create: `supabase/migrations/001_initial.sql`
- Create: `.env.local`

- [ ] **Step 1: Create Supabase project**

Go to https://supabase.com/dashboard → New Project. Save the **Project URL** and **anon key** from Settings → API.

- [ ] **Step 2: Create `.env.local` (never commit this file)**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

- [ ] **Step 3: Add `.env.local` to `.gitignore`**

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 4: Create migration file**

Create `supabase/migrations/001_initial.sql`:

```sql
-- Guests: one row per invited person/family
CREATE TABLE guests (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  language    text        NOT NULL CHECK (language IN ('ru', 'ro')),
  created_at  timestamptz DEFAULT now()
);

-- RSVP responses: one per guest
CREATE TABLE rsvp_responses (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id     uuid        NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  attending    boolean     NOT NULL,
  guest_count  integer     NOT NULL DEFAULT 1,
  meal_pref    text,
  transport    boolean,
  song_request text,
  custom_data  jsonb,
  submitted_at timestamptz DEFAULT now()
);

-- Wishlist: reserved for future item-reservation feature
CREATE TABLE wishlist_items (
  id          uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text  NOT NULL,
  amount      integer,
  link        text,
  reserved_by text
);

-- Site config: key-value store for couple names, card number, etc.
CREATE TABLE site_config (
  key   text PRIMARY KEY,
  value text NOT NULL
);

-- Seed initial config rows (fill values in Supabase after deploy)
INSERT INTO site_config (key, value) VALUES
  ('couple_names',          'Andrii & ____'),
  ('card_number',           ''),
  ('telegram_link',         ''),
  ('venue_name',            ''),
  ('venue_address',         ''),
  ('google_maps_embed_url', '');

-- Row Level Security
ALTER TABLE guests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Public: read guests and config (needed by server components with anon key)
CREATE POLICY "public_read_guests"
  ON guests FOR SELECT USING (true);

CREATE POLICY "public_read_config"
  ON site_config FOR SELECT USING (true);

-- Public: submit one RSVP (duplicate prevention handled in server action)
CREATE POLICY "public_insert_rsvp"
  ON rsvp_responses FOR INSERT WITH CHECK (true);

-- Authenticated admin: full access to all tables
CREATE POLICY "admin_all_guests"
  ON guests FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_rsvp"
  ON rsvp_responses FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_config"
  ON site_config FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_wishlist"
  ON wishlist_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 5: Run migration in Supabase**

Supabase Dashboard → SQL Editor → paste and run `001_initial.sql`.

Expected: "Success. No rows returned."

- [ ] **Step 6: Create 2 admin users**

Supabase Dashboard → Authentication → Users → "Add user" for both accounts (email + password).

- [ ] **Step 7: Verify in Table Editor**

Supabase Dashboard → Table Editor → confirm tables `guests`, `rsvp_responses`, `wishlist_items`, `site_config` exist with the correct columns.

- [ ] **Step 8: Commit**

```bash
git add supabase/ .gitignore
git commit -m "feat: add DB schema migration and Supabase project setup"
```

---

## Task 3: Tailwind config + Google Fonts + global styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans:  ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        cream: '#FAFAF8',
        dark:  '#1A1A1A',
        gold:  '#C9A96E',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 2: Update `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Wedding Invitation',
  description: 'You are invited',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${playfair.variable} ${inter.variable} bg-cream antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Update `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cream text-dark;
  }
  ::selection {
    @apply bg-gold/30;
  }
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Open http://localhost:3000 — Playfair Display should be the default serif font.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx
git commit -m "feat: configure Tailwind, Google Fonts (Playfair + Inter), global styles"
```

---

## Task 4: Supabase client helpers

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create `lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create `lib/supabase/server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()                { return cookieStore.getAll() },
        setAll(cookiesToSet)    {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/
git commit -m "feat: add Supabase browser and server client helpers"
```

---

## Task 5: Auth middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  // Only protect /admin/* routes
  if (!request.nextUrl.pathname.startsWith('/admin')) return response
  // Login page is always accessible
  if (request.nextUrl.pathname === '/admin/login') return response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()             { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Verify redirect**

```bash
npm run dev
```

Visit http://localhost:3000/admin/guests — should redirect to `/admin/login`.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add admin auth middleware with Supabase session check"
```

---

## Task 6: i18n dictionaries

**Files:**
- Create: `lib/i18n/ru.json`
- Create: `lib/i18n/ro.json`

- [ ] **Step 1: Create `lib/i18n/ru.json`**

```json
{
  "hero": {
    "greeting": "Дорогой(ая)",
    "countdown": {
      "days": "дней",
      "hours": "часов",
      "minutes": "минут",
      "seconds": "секунд"
    }
  },
  "love_story": {
    "title": "Наша история"
  },
  "timeline": {
    "title": "Расписание дня"
  },
  "location": {
    "title": "Место проведения",
    "navigate": "Открыть в навигаторе"
  },
  "rsvp": {
    "title": "Подтвердите присутствие",
    "attending_yes": "Приду",
    "attending_no": "Не смогу",
    "guest_count_label": "Количество гостей (включая вас)",
    "submit": "Отправить",
    "success": "Спасибо! Ждём вас с нетерпением.",
    "already_submitted": "Вы уже подтвердили участие."
  },
  "wishlist": {
    "title": "Подарки",
    "description": "Если хотите порадовать нас, будем рады денежному подарку.",
    "card_label": "Номер карты",
    "copy": "Скопировать",
    "copied": "Скопировано!"
  },
  "telegram": {
    "title": "Telegram группа",
    "description": "Присоединяйтесь к нашей группе для общения и объявлений.",
    "join": "Присоединиться"
  }
}
```

- [ ] **Step 2: Create `lib/i18n/ro.json`**

```json
{
  "hero": {
    "greeting": "Dragă",
    "countdown": {
      "days": "zile",
      "hours": "ore",
      "minutes": "minute",
      "seconds": "secunde"
    }
  },
  "love_story": {
    "title": "Povestea noastră"
  },
  "timeline": {
    "title": "Programul zilei"
  },
  "location": {
    "title": "Locul evenimentului",
    "navigate": "Deschide în navigator"
  },
  "rsvp": {
    "title": "Confirmați prezența",
    "attending_yes": "Vin",
    "attending_no": "Nu pot veni",
    "guest_count_label": "Numărul de persoane (inclusiv dvs.)",
    "submit": "Trimite",
    "success": "Mulțumim! Vă așteptăm cu nerăbdare.",
    "already_submitted": "Ați confirmat deja participarea."
  },
  "wishlist": {
    "title": "Cadouri",
    "description": "Dacă doriți să ne faceți un cadou, suntem recunoscători pentru un cadou în bani.",
    "card_label": "Numărul cardului",
    "copy": "Copiați",
    "copied": "Copiat!"
  },
  "telegram": {
    "title": "Grup Telegram",
    "description": "Alăturați-vă grupului nostru pentru comunicare și anunțuri.",
    "join": "Alăturați-vă"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/i18n/
git commit -m "feat: add Russian and Romanian i18n dictionaries"
```

---

## Task 7: Shared types + slug utility

**Files:**
- Create: `lib/types.ts`
- Create: `lib/utils/slug.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```typescript
export type Language = 'ru' | 'ro'

export interface Guest {
  id: string
  slug: string
  name: string
  language: Language
  created_at: string
}

export interface RsvpResponse {
  id: string
  guest_id: string
  attending: boolean
  guest_count: number
  meal_pref: string | null
  transport: boolean | null
  song_request: string | null
  custom_data: Record<string, unknown> | null
  submitted_at: string
}

export interface GuestWithRsvp extends Guest {
  rsvp_responses: RsvpResponse[]
}
```

- [ ] **Step 2: Create `lib/utils/slug.ts`**

```typescript
const CYRILLIC_MAP: Record<string, string> = {
  а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'yo',
  ж:'zh', з:'z', и:'i', й:'j', к:'k', л:'l', м:'m',
  н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u',
  ф:'f', х:'kh', ц:'ts', ч:'ch', ш:'sh', щ:'shch',
  ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya',
}

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .split('')
    .map(char => CYRILLIC_MAP[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts lib/utils/
git commit -m "feat: add shared types and Cyrillic slug transliteration utility"
```

---

## Task 8: FadeIn animation component

**Files:**
- Create: `components/sections/FadeIn.tsx`

- [ ] **Step 1: Create `components/sections/FadeIn.tsx`**

```typescript
'use client'
import { motion } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/
git commit -m "feat: add FadeIn scroll animation component"
```

---

## Task 9: HeroSection with live countdown

**Files:**
- Create: `components/sections/HeroSection.tsx`

- [ ] **Step 1: Create `components/sections/HeroSection.tsx`**

```typescript
'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

const WEDDING_DATE = new Date('2026-08-23T12:00:00')

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
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

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    [timeLeft.days,    t('countdown.days')],
    [timeLeft.hours,   t('countdown.hours')],
    [timeLeft.minutes, t('countdown.minutes')],
    [timeLeft.seconds, t('countdown.seconds')],
  ] as const

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-cream px-6 text-center gap-16">
      <FadeIn>
        <p className="font-sans text-sm tracking-[0.3em] text-gold uppercase mb-6">
          {t('greeting')}, {guestName}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-dark leading-tight mb-4">
          {coupleNames}
        </h1>
        <p className="font-sans text-lg text-dark/50 tracking-[0.25em]">
          23 · 08 · 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="flex gap-8 md:gap-14">
          {units.map(([value, label]) => (
            <div key={String(label)} className="flex flex-col items-center gap-2">
              <span className="font-serif text-4xl md:text-5xl text-dark tabular-nums">
                {String(value).padStart(2, '0')}
              </span>
              <span className="font-sans text-[10px] tracking-[0.2em] text-dark/40 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/HeroSection.tsx
git commit -m "feat: add HeroSection with live countdown timer"
```

---

## Task 10: LoveStorySection (photo gallery slider)

**Files:**
- Create: `components/sections/LoveStorySection.tsx`
- Create: `public/gallery/.gitkeep`

- [ ] **Step 1: Create gallery placeholder directory**

```bash
mkdir -p public/gallery && touch public/gallery/.gitkeep
```

Drop actual wedding photos into `public/gallery/` as `photo-1.jpg`, `photo-2.jpg`, etc. Update the `PHOTOS` array in the component to match.

- [ ] **Step 2: Create `components/sections/LoveStorySection.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { FadeIn } from './FadeIn'

// Update this list after dropping photos into public/gallery/
const PHOTOS = [
  '/gallery/photo-1.jpg',
  '/gallery/photo-2.jpg',
  '/gallery/photo-3.jpg',
]

export function LoveStorySection() {
  const t = useTranslations('love_story')
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + PHOTOS.length) % PHOTOS.length)
  const next = () => setCurrent(i => (i + 1) % PHOTOS.length)

  return (
    <section className="py-24 px-6 bg-cream">
      <FadeIn>
        <h2 className="font-serif text-4xl text-dark text-center mb-12">
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
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current ? 'bg-cream' : 'bg-cream/40'
                }`}
              />
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/LoveStorySection.tsx public/gallery/
git commit -m "feat: add LoveStorySection photo gallery with animated slider"
```

---

## Task 11: TimelineSection

**Files:**
- Create: `components/sections/TimelineSection.tsx`

- [ ] **Step 1: Create `components/sections/TimelineSection.tsx`**

Update `TIMELINE` times and labels to match your actual wedding schedule before shipping.

```typescript
import { useTranslations } from 'next-intl'
import { Clock, Camera, Wine, UtensilsCrossed, Music, Cake } from 'lucide-react'
import { FadeIn } from './FadeIn'

const TIMELINE = [
  { time: '12:00', Icon: Clock,            label: 'Церемония / Ceremonie' },
  { time: '13:00', Icon: Wine,             label: 'Фуршет / Aperitiv' },
  { time: '14:00', Icon: Camera,           label: 'Фотосессия / Fotosesiune' },
  { time: '16:00', Icon: UtensilsCrossed,  label: 'Банкет / Banchet' },
  { time: '18:00', Icon: Cake,             label: 'Торт / Tort' },
  { time: '19:00', Icon: Music,            label: 'Танцы / Dans' },
]

export function TimelineSection() {
  const t = useTranslations('timeline')

  return (
    <section className="py-24 px-6 bg-white">
      <FadeIn>
        <h2 className="font-serif text-4xl text-dark text-center mb-16">
          {t('title')}
        </h2>
      </FadeIn>

      <div className="max-w-md mx-auto space-y-6">
        {TIMELINE.map(({ time, Icon, label }, i) => (
          <FadeIn key={time} delay={i * 0.08}>
            <div className="flex items-center gap-5">
              <span className="font-sans text-sm text-dark/50 tabular-nums w-12 shrink-0">
                {time}
              </span>
              <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <div className="h-px flex-1 bg-dark/10" />
              <span className="font-sans text-sm text-dark/70 text-right">
                {label}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/TimelineSection.tsx
git commit -m "feat: add TimelineSection with animated wedding day schedule"
```

---

## Task 12: LocationSection

**Files:**
- Create: `components/sections/LocationSection.tsx`

- [ ] **Step 1: Create `components/sections/LocationSection.tsx`**

```typescript
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
    <section className="py-24 px-6 bg-cream">
      <FadeIn>
        <h2 className="font-serif text-4xl text-dark text-center mb-3">
          {t('title')}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-12">
          <MapPin className="w-4 h-4 text-gold" />
          <p className="font-sans text-sm text-dark/50">{venueName}</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="max-w-2xl mx-auto">
          {googleMapsEmbedUrl ? (
            <iframe
              src={googleMapsEmbedUrl}
              className="w-full h-72 border-0 mb-6"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Wedding venue"
            />
          ) : (
            <div className="w-full h-72 bg-dark/5 flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-dark/20" />
            </div>
          )}

          <div className="text-center">
            <p className="font-sans text-sm text-dark/50 mb-6">{venueAddress}</p>
            <a
              href={navigateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-dark/20 px-6 py-3 font-sans text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {t('navigate')}
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/LocationSection.tsx
git commit -m "feat: add LocationSection with Google Maps embed and navigator link"
```

---

## Task 13: RSVPSection + Server Action

**Files:**
- Create: `app/actions/rsvp.ts`
- Create: `components/sections/RSVPSection.tsx`

- [ ] **Step 1: Create `app/actions/rsvp.ts`**

```typescript
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitRsvp(
  guestId: string,
  attending: boolean,
  guestCount: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('rsvp_responses')
    .select('id')
    .eq('guest_id', guestId)
    .maybeSingle()

  if (existing) return { success: false, error: 'already_submitted' }

  const { error } = await supabase.from('rsvp_responses').insert({
    guest_id:    guestId,
    attending,
    guest_count: attending ? guestCount : 0,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/rsvp')
  return { success: true }
}
```

- [ ] **Step 2: Create `components/sections/RSVPSection.tsx`**

```typescript
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
          <p className="font-serif text-2xl text-dark">
            {status === 'success' ? t('success') : t('already_submitted')}
          </p>
        </FadeIn>
      </section>
    )
  }

  return (
    <section className="py-24 px-6 bg-white">
      <FadeIn>
        <h2 className="font-serif text-4xl text-dark text-center mb-12">
          {t('title')}
        </h2>
      </FadeIn>

      <FadeIn delay={0.2}>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-8">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`flex-1 py-3 font-sans text-sm tracking-widest uppercase border transition-colors ${
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
              className={`flex-1 py-3 font-sans text-sm tracking-widest uppercase border transition-colors ${
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
              <label className="font-sans text-xs tracking-widest uppercase text-dark/50 block">
                {t('guest_count_label')}
              </label>
              <div className="flex items-center gap-4 border border-dark/20 p-4">
                <button
                  type="button"
                  onClick={() => setGuestCount(c => Math.max(1, c - 1))}
                  className="font-sans text-xl text-dark/60 w-8 text-center hover:text-gold transition-colors"
                >
                  −
                </button>
                <span className="font-serif text-2xl text-dark flex-1 text-center tabular-nums">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount(c => Math.min(10, c + 1))}
                  className="font-sans text-xl text-dark/60 w-8 text-center hover:text-gold transition-colors"
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
              className="w-full py-4 bg-dark text-cream font-sans text-sm tracking-widest uppercase hover:bg-gold hover:text-dark transition-colors disabled:opacity-50"
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

- [ ] **Step 3: Commit**

```bash
git add app/actions/rsvp.ts components/sections/RSVPSection.tsx
git commit -m "feat: add RSVPSection with duplicate-prevention server action"
```

---

## Task 14: WishlistSection + TelegramSection

**Files:**
- Create: `components/sections/WishlistSection.tsx`
- Create: `components/sections/TelegramSection.tsx`

- [ ] **Step 1: Create `components/sections/WishlistSection.tsx`**

```typescript
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
```

- [ ] **Step 2: Create `components/sections/TelegramSection.tsx`**

```typescript
import { useTranslations } from 'next-intl'
import { FadeIn } from './FadeIn'

interface TelegramSectionProps {
  telegramLink: string
}

export function TelegramSection({ telegramLink }: TelegramSectionProps) {
  const t = useTranslations('telegram')
  if (!telegramLink) return null

  return (
    <section className="py-24 px-6 bg-white text-center">
      <FadeIn>
        <h2 className="font-serif text-4xl text-dark mb-4">{t('title')}</h2>
        <p className="font-sans text-sm text-dark/50 max-w-sm mx-auto mb-10">
          {t('description')}
        </p>
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-dark text-cream px-8 py-4 font-sans text-sm tracking-widest uppercase hover:bg-gold hover:text-dark transition-colors"
        >
          {t('join')}
        </a>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/WishlistSection.tsx components/sections/TelegramSection.tsx
git commit -m "feat: add WishlistSection (copy card number) and TelegramSection"
```

---

## Task 15: Public invitation page

**Files:**
- Create: `app/(public)/[slug]/page.tsx`
- Create: `app/not-found.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `app/(public)/[slug]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { createClient } from '@/lib/supabase/server'
import { HeroSection }     from '@/components/sections/HeroSection'
import { LoveStorySection } from '@/components/sections/LoveStorySection'
import { TimelineSection }  from '@/components/sections/TimelineSection'
import { LocationSection }  from '@/components/sections/LocationSection'
import { RSVPSection }      from '@/components/sections/RSVPSection'
import { WishlistSection }  from '@/components/sections/WishlistSection'
import { TelegramSection }  from '@/components/sections/TelegramSection'
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
  const supabase  = await createClient()

  const { data: guest } = await supabase
    .from('guests')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!guest) notFound()

  const { data: configRows } = await supabase.from('site_config').select('*')
  const config: Record<string, string> = Object.fromEntries(
    (configRows ?? []).map(r => [r.key, r.value])
  )

  const locale = guest.language as Language

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <main>
        <HeroSection
          guestName={guest.name}
          coupleNames={config.couple_names ?? 'Andrii & ____'}
        />
        <LoveStorySection />
        <TimelineSection />
        <LocationSection
          venueName={config.venue_name ?? ''}
          venueAddress={config.venue_address ?? ''}
          googleMapsEmbedUrl={config.google_maps_embed_url ?? ''}
        />
        <RSVPSection guestId={guest.id} />
        <WishlistSection cardNumber={config.card_number ?? ''} />
        <TelegramSection telegramLink={config.telegram_link ?? ''} />
      </main>
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 2: Create `app/not-found.tsx`**

```typescript
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream text-center px-6">
      <h1 className="font-serif text-6xl text-dark mb-4">404</h1>
      <p className="font-sans text-sm tracking-widest text-dark/40 uppercase">
        Invitation not found
      </p>
    </main>
  )
}
```

- [ ] **Step 3: Update `app/page.tsx`**

```typescript
import { redirect } from 'next/navigation'
export default function Home() {
  redirect('/admin/login')
}
```

- [ ] **Step 4: Insert a test guest and verify**

In Supabase Dashboard → SQL Editor:

```sql
INSERT INTO guests (slug, name, language) VALUES ('test', 'Тест Гостюк', 'ru');
```

Visit http://localhost:3000/test — full invitation should render in Russian.
Visit http://localhost:3000/unknown-slug — should show 404 page.

- [ ] **Step 5: Commit**

```bash
git add app/
git commit -m "feat: add public invitation page assembling all sections with i18n"
```

---

## Task 16: Admin login page

**Files:**
- Create: `app/(admin)/layout.tsx`
- Create: `app/(admin)/login/page.tsx`

- [ ] **Step 1: Create `app/(admin)/layout.tsx`**

```typescript
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-6">
        <span className="font-semibold text-gray-900 mr-4">Wedding Admin</span>
        <Link href="/admin/guests" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Guests
        </Link>
        <Link href="/admin/rsvp" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          RSVP
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(admin)/login/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/guests')
      router.refresh()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-57px)] px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-gray-900 text-center mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-600 rounded transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-600 rounded transition-colors"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? '…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test login**

Visit http://localhost:3000/admin/login — log in with an admin account created in Supabase. Should redirect to `/admin/guests` (404 until Task 17).

- [ ] **Step 4: Commit**

```bash
git add app/(admin)/
git commit -m "feat: add admin layout with nav and login page"
```

---

## Task 17: Admin guests page

**Files:**
- Create: `app/actions/guests.ts`
- Create: `components/admin/GuestsTable.tsx`
- Create: `app/(admin)/guests/page.tsx`

- [ ] **Step 1: Create `app/actions/guests.ts`**

```typescript
'use server'
import { createClient } from '@/lib/supabase/server'
import { nameToSlug } from '@/lib/utils/slug'
import { revalidatePath } from 'next/cache'

export async function addGuest(
  name: string,
  language: 'ru' | 'ro'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const slug = nameToSlug(name)

  const { error } = await supabase.from('guests').insert({ name, slug, language })
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/guests')
  return { success: true }
}

export async function deleteGuest(id: string): Promise<{ success: boolean }> {
  const supabase = await createClient()
  await supabase.from('guests').delete().eq('id', id)
  revalidatePath('/admin/guests')
  return { success: true }
}
```

- [ ] **Step 2: Create `components/admin/GuestsTable.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { Copy, Check, Trash2, Plus, X } from 'lucide-react'
import { addGuest, deleteGuest } from '@/app/actions/guests'
import type { GuestWithRsvp } from '@/lib/types'

interface GuestsTableProps {
  guests: GuestWithRsvp[]
  baseUrl: string
}

export function GuestsTable({ guests, baseUrl }: GuestsTableProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [showForm, setShowForm]     = useState(false)
  const [newName, setNewName]       = useState('')
  const [newLang, setNewLang]       = useState<'ru' | 'ro'>('ru')
  const [adding, setAdding]         = useState(false)
  const [addError, setAddError]     = useState('')

  async function handleCopy(slug: string) {
    await navigator.clipboard.writeText(`${baseUrl}/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    setAddError('')
    const result = await addGuest(newName.trim(), newLang)
    if (!result.success) {
      setAddError(result.error ?? 'Error adding guest')
      setAdding(false)
      return
    }
    setNewName('')
    setAdding(false)
    setShowForm(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This also removes their RSVP response.`)) return
    await deleteGuest(id)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Guests <span className="text-gray-400 text-lg font-normal">({guests.length})</span>
        </h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm rounded hover:bg-gray-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add guest'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex gap-3 mb-6 p-4 bg-white rounded border">
          <input
            type="text"
            placeholder="Full name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
            className="flex-1 border border-gray-300 px-3 py-2 text-sm rounded outline-none focus:border-gray-500"
          />
          <select
            value={newLang}
            onChange={e => setNewLang(e.target.value as 'ru' | 'ro')}
            className="border border-gray-300 px-3 py-2 text-sm rounded"
          >
            <option value="ru">Russian</option>
            <option value="ro">Romanian</option>
          </select>
          <button
            type="submit"
            disabled={adding}
            className="bg-gray-900 text-white px-4 py-2 text-sm rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            {adding ? '…' : 'Add'}
          </button>
          {addError && <p className="text-red-500 text-xs self-center">{addError}</p>}
        </form>
      )}

      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Lang</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">URL</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">RSVP</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {guests.map(g => {
              const rsvp = g.rsvp_responses?.[0]
              return (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{g.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs uppercase">{g.language}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleCopy(g.slug)}
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <span className="text-xs">/{g.slug}</span>
                      {copiedSlug === g.slug
                        ? <Check className="w-3 h-3 text-green-500" />
                        : <Copy className="w-3 h-3" />
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {!rsvp && <span className="text-gray-400 text-xs">Pending</span>}
                    {rsvp?.attending === true  && <span className="text-green-600 text-xs">✓ {rsvp.guest_count} person(s)</span>}
                    {rsvp?.attending === false && <span className="text-red-400 text-xs">✗ Declined</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(g.id, g.name)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {guests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No guests yet. Add your first guest above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/(admin)/guests/page.tsx`**

```typescript
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { GuestsTable } from '@/components/admin/GuestsTable'

export default async function GuestsPage() {
  const supabase     = await createClient()
  const headersList  = await headers()
  const host         = headersList.get('host') ?? 'localhost:3000'
  const protocol     = host.includes('localhost') ? 'http' : 'https'
  const baseUrl      = `${protocol}://${host}`

  const { data: guests } = await supabase
    .from('guests')
    .select('*, rsvp_responses(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <GuestsTable guests={guests ?? []} baseUrl={baseUrl} />
    </div>
  )
}
```

- [ ] **Step 4: Test**

1. Log in at http://localhost:3000/admin/login
2. Visit http://localhost:3000/admin/guests
3. Add a guest — verify they appear in the table with auto-generated slug
4. Click the copy button — paste to confirm full URL is copied
5. Visit the generated URL to confirm the invitation page loads

- [ ] **Step 5: Commit**

```bash
git add app/actions/guests.ts components/admin/GuestsTable.tsx app/(admin)/guests/
git commit -m "feat: add admin guests page with add/delete/copy-URL actions"
```

---

## Task 18: Admin RSVP page + CSV export

**Files:**
- Create: `app/api/export/rsvp/route.ts`
- Create: `app/(admin)/rsvp/page.tsx`

- [ ] **Step 1: Create `app/api/export/rsvp/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data } = await supabase
    .from('rsvp_responses')
    .select('attending, guest_count, submitted_at, guests(name, slug, language)')
    .order('submitted_at', { ascending: true })

  const header = 'Guest Name,Slug,Language,Attending,Guest Count,Submitted At'
  const rows = (data ?? []).map(r => {
    const g = r.guests as { name: string; slug: string; language: string } | null
    return [
      `"${(g?.name ?? '').replace(/"/g, '""')}"`,
      g?.slug ?? '',
      g?.language ?? '',
      r.attending ? 'Yes' : 'No',
      r.guest_count,
      new Date(r.submitted_at).toLocaleString('uk-UA'),
    ].join(',')
  })

  return new NextResponse([header, ...rows].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rsvp-responses.csv"',
    },
  })
}
```

- [ ] **Step 2: Create `app/(admin)/rsvp/page.tsx`**

```typescript
import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function RsvpPage() {
  const supabase = await createClient()

  const { data: responses } = await supabase
    .from('rsvp_responses')
    .select('*, guests(name)')
    .order('submitted_at', { ascending: false })

  const { count: totalGuests } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true })

  const confirmed   = (responses ?? []).filter(r =>  r.attending).length
  const declined    = (responses ?? []).filter(r => !r.attending).length
  const pending     = (totalGuests ?? 0) - (responses?.length ?? 0)
  const totalPeople = (responses ?? [])
    .filter(r => r.attending)
    .reduce((sum, r) => sum + r.guest_count, 0)

  const stats = [
    { label: 'Invited',      value: totalGuests ?? 0 },
    { label: 'Confirmed',    value: confirmed },
    { label: 'Declined',     value: declined },
    { label: 'Pending',      value: pending },
    { label: 'Total people', value: totalPeople },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">RSVP Responses</h1>
        <a
          href="/api/export/rsvp"
          download
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm rounded hover:border-gray-500 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-white rounded border p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Guest</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Attending</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">People</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(responses ?? []).map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {(r.guests as { name: string } | null)?.name ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {r.attending
                    ? <span className="text-green-600">✓ Yes</span>
                    : <span className="text-red-400">✗ No</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {r.attending ? r.guest_count : '—'}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(r.submitted_at).toLocaleString('uk-UA')}
                </td>
              </tr>
            ))}
            {(responses ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No responses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test RSVP flow end-to-end**

1. Go to a test invitation URL (e.g., http://localhost:3000/test)
2. Submit RSVP — confirm attending, 2 people
3. Visit http://localhost:3000/admin/rsvp — response appears with correct count
4. Click "Download CSV" — file downloads, open in Excel and verify columns

- [ ] **Step 4: Commit**

```bash
git add app/api/ app/(admin)/rsvp/
git commit -m "feat: add admin RSVP page with stats overview and CSV download"
```

---

## Task 19: Vercel deployment

- [ ] **Step 1: Push repository to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/wedding-invite.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Create Vercel project**

1. Go to https://vercel.com → New Project
2. Import the GitHub repo `wedding-invite`
3. Framework: Next.js (auto-detected). Leave all other settings default.

- [ ] **Step 3: Add environment variables in Vercel**

In the project → Settings → Environment Variables, add all three:

```
NEXT_PUBLIC_SUPABASE_URL      = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY     = your-service-role-key
```

- [ ] **Step 4: Add Vercel domain to Supabase allowed URLs**

Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-project.vercel.app`
- Add redirect URL: `https://your-project.vercel.app/**`

- [ ] **Step 5: Trigger deploy and verify**

Vercel deploys automatically after Step 3. After it completes:

1. Visit `https://your-project.vercel.app/test` → invitation loads
2. Visit `https://your-project.vercel.app/admin/login` → login works
3. Submit a test RSVP → appears in admin

- [ ] **Step 6: Fill in real content in site_config**

Supabase Dashboard → SQL Editor:

```sql
UPDATE site_config SET value = 'Andrii & Your Partner' WHERE key = 'couple_names';
UPDATE site_config SET value = 'XXXX XXXX XXXX XXXX'   WHERE key = 'card_number';
UPDATE site_config SET value = 'https://t.me/your-group' WHERE key = 'telegram_link';
UPDATE site_config SET value = 'Your Venue Name'         WHERE key = 'venue_name';
UPDATE site_config SET value = 'Your Venue Address'       WHERE key = 'venue_address';
```

For Google Maps embed URL: Google Maps → Share → Embed a map → copy `src="..."` value.

- [ ] **Step 7: Delete test guest, add real guests**

```sql
DELETE FROM guests WHERE slug = 'test';
```

Then add real guests via the admin panel at `/admin/guests`.

- [ ] **Step 8: Tag release**

```bash
git tag v1.0.0
git push origin v1.0.0
```
