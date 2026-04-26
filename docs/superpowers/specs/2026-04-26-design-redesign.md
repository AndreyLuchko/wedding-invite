# Design Redesign Spec — Wedding Invite
Date: 2026-04-26

## Context

Wedding invitation site for the user's niece (29 years old). Built with Next.js 16 + Tailwind v4 + Framer Motion. Guests receive personalized links (`/[slug]`), see content in their language (ru or ro) via next-intl. All business logic (RSVP, countdown, wishlist copy, Telegram link) must remain unchanged.

## Design Decisions

### Vibe
Romantic & Airy — generous whitespace, thin typography, flowers as decorative accents.

### Color Palette (unchanged)
- `--color-cream: #FAFAF8`
- `--color-dark: #1A1A1A`
- `--color-gold: #C9A96E`

### Fonts (unchanged)
- Headings: Great Vibes (cursive)
- Body: Montserrat (sans-serif)

### Images
- **No couple photos** — only thematic/floral images allowed
- `/gallery/flowers_9x16.png` — hero on mobile (portrait)
- `/gallery/flowers_4x3.png` — hero on desktop + flower dividers
- `/gallery/flowers_1x1.png` — flower dividers (alternate)
- `/gallery/wedding_pair*.png` — **excluded**, never used

### i18n
All new text keys added to both `lib/i18n/ru.json` and `lib/i18n/ro.json`. Existing language-switching logic untouched. No Ukrainian text on the page — guests see Russian or Romanian based on `guest.language`.

---

## Section Structure

### Removed
- `LoveStorySection` — removed from page and import in `app/(public)/[slug]/page.tsx`

### New Section Order
1. HeroSection
2. QuoteSection *(new)*
3. TimelineSection
4. LocationSection
5. RSVPSection
6. WishlistSection
7. TelegramSection

Flower dividers appear between sections 2→3, 3→4, 4→5, 6→7.

---

## Section Specs

### 1. HeroSection (redesigned)

**Layout (mobile-first):**
- Full-width flower photo at top (`flowers_9x16.png` on mobile, `flowers_4x3.png` on ≥768px)
- Gradient overlay at bottom of photo: transparent → `#FAFAF8`
- Photo has parallax scroll effect (moves at 40% scroll speed via Framer Motion `useScroll` + `useTransform`)
- Content below photo (not overlaid):
  - Guest greeting in Montserrat 9px, gold, tracked `0.35em`, uppercase
  - Couple names in Great Vibes 60px
  - Gold ornament divider (line · diamond · line)
  - Date in Montserrat 9px, tracked `0.35em`, muted
  - Countdown: 4 units (days/hours/minutes/seconds) in Great Vibes 40px, separated by gold `·`
  - Scroll hint: thin gold vertical line + "scroll" label fading in last

**Animations:** FadeIn (existing) for each content block with staggered delays.

**i18n keys needed:**
- `hero.greeting` ✓ exists
- `hero.countdown.*` ✓ exists
- `hero.scroll` — new ("Листай" / "Derulează")

---

### 2. QuoteSection (new component)

**File:** `components/sections/QuoteSection.tsx`

**Layout:**
- Background: `cream`
- Centered, padding `52px 44px`
- Large decorative opening quote mark in Great Vibes, `#C9A96E22`
- Quote text in Great Vibes 24px (from i18n, guest's language)
- Date `23 · 08 · 2026` in gold caps below

**Animation:** FadeIn

**i18n keys:**
- `quote.text` — "Где двое — там уже целый мир" / "Acolo unde sunt doi — există deja o lume întreagă"

---

### 3. TimelineSection (redesigned)

**Changes from current:**
- Vertical gold line connecting all items (CSS pseudo-element on container)
- Each item: time (muted) · icon in gold circle (24px) · label + subtitle text
- Icons remain Lucide React: `Heart` (ceremony), `Wine`, `Camera`, `UtensilsCrossed`, `Cake`, `Music`
- Added subtitle per event (e.g. "Офіційна реєстрація")
- Section heading "Наш день" / "Ziua noastră" in Great Vibes
- Section subtitle label in gold caps

**Animation:** Staggered FadeIn — each row delay `i * 0.08s`

**i18n keys needed (all new):**
- `timeline.title` ✓ exists ("Расписание дня" / "Programul zilei")
- `timeline.subtitle` — new ("Программа праздника" / "Programul sărbătorii")
- `timeline.ceremony_sub` — "Официальная регистрация" / "Înregistrarea oficială"
- `timeline.aperitif_sub` — "Лёгкие закуски и приветствие" / "Gustări ușoare și salutări"
- `timeline.photo_sub` — "Памятные моменты" / "Momente memorabile"
- `timeline.banquet_sub` — "Праздничный ужин" / "Cina festivă"
- `timeline.cake_sub` — "Сладкий момент" / "Momentul dulce"
- `timeline.dance_sub` — "До утра" / "Până dimineața"

---

### 4. LocationSection (redesigned)

**Changes from current:**
- Section heading in Great Vibes: "Место праздника" / "Locul sărbătorii"
- Section subtitle label in gold caps
- Map iframe: add `rounded-sm` (2px) + gold border `border border-gold/20`
- Venue name in Great Vibes below map
- Navigate button: gold border, arrow icon, full width

**i18n keys:**
- `location.title` ✓ exists
- `location.subtitle` — new ("Где нас найти" / "Unde ne găsiți")
- `location.navigate` ✓ exists

---

### 5. RSVPSection (redesigned)

**Changes from current:**
- Section heading: "Будете с нами?" / "Veți fi cu noi?" in Great Vibes
- Added deadline note below heading: "Просим подтвердить до 1 августа 2026" / "Vă rugăm să confirmați până pe 1 august 2026" — deadline date in gold
- Attending buttons: same logic, refined styling (gold border on active "yes", dark border on active "no")
- Submit button: full width, dark bg, cream text — unchanged logic

**i18n keys:**
- `rsvp.title` ✓ exists — update text to "Будете с нами?" / "Veți fi cu noi?"
- `rsvp.deadline` — new ("Просим подтвердить до 1 августа 2026" / "Vă rugăm să confirmați până pe 1 august 2026")
- `rsvp.attending_yes` ✓, `rsvp.attending_no` ✓, `rsvp.submit` ✓, `rsvp.success` ✓, `rsvp.already_submitted` ✓

---

### 6. WishlistSection (redesigned)

**Changes from current:**
- Section heading in Great Vibes
- Body text refined (warmer tone)
- Card number box: gold border `#C9A96E44`, generous padding
- Copy button: gold color, checkmark animation on copy (already implemented)

**i18n keys:**
- `wishlist.title` ✓, `wishlist.description` — update text tone
- `wishlist.card_label` ✓, `wishlist.copy` ✓, `wishlist.copied` ✓

---

### 7. TelegramSection (redesigned)

**Changes from current:**
- Section heading in Great Vibes
- Refined body text
- CTA button with telegram arrow icon `→`

**i18n keys:**
- `telegram.title` ✓, `telegram.description` — refine text
- `telegram.join` ✓

---

## Flower Dividers

**New component:** `components/sections/FlowerDivider.tsx`

**Props:** `src: string`, `flip?: boolean` (mirrors image horizontally for variety)

**Layout:**
- Full-width, height `110px`
- `<Image>` with `object-cover`
- CSS pseudo-elements: top 45% fades `#FAFAF8 → transparent`, bottom 45% fades `transparent → #FAFAF8`. Since sections alternate between `#FAFAF8` and `#ffffff` (visually near-identical), a fixed cream gradient works for all placements.

**Used between:** Quote→Timeline, Timeline→Location, Location→RSVP, Wishlist→Telegram (4 total)

---

## Animations

### Existing (keep)
- `FadeIn` component (Framer Motion) — `opacity 0→1`, `y 24→0`, duration `0.8s` — applied to all section content blocks

### New
- **Hero parallax:** `useScroll` + `useTransform` on flower image `y` value: scrollYProgress `[0, 1]` → `y` `[0%, 30%]`. Client component.
- **Staggered timeline:** Each `FadeIn` on timeline row uses `delay={i * 0.08}`
- **Scroll hint fade:** Hero scroll indicator uses `animate={{ opacity: [1, 0.3, 1] }}` loop, 2s

---

## FadeIn Enhancement

Current `FadeIn` is `whileInView` with `once: true`. No changes needed — works well for all sections.

---

## File Changes Summary

| File | Change |
|------|--------|
| `app/(public)/[slug]/page.tsx` | Remove `LoveStorySection` import and usage; add `QuoteSection`, `FlowerDivider` |
| `components/sections/HeroSection.tsx` | New layout with flower photo + parallax + ornament divider + scroll hint |
| `components/sections/QuoteSection.tsx` | New file |
| `components/sections/FlowerDivider.tsx` | New file |
| `components/sections/TimelineSection.tsx` | Vertical line, gold icon circles, subtitle per event, staggered animation |
| `components/sections/LocationSection.tsx` | New section heading style, map border, nav button style |
| `components/sections/RSVPSection.tsx` | New heading, deadline note, refined button styles |
| `components/sections/WishlistSection.tsx` | New heading, gold border on card box, refined text |
| `components/sections/TelegramSection.tsx` | New heading style, refined text and button |
| `lib/i18n/ru.json` | Add all new keys listed above |
| `lib/i18n/ro.json` | Add all new keys listed above |
| `components/sections/LoveStorySection.tsx` | Kept as file, just not imported |
