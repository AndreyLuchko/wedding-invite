# TimelineSection Redesign

## Summary

Rebuild `TimelineSection` to match the provided screenshot: bg.png background, vertical timeline with alternating image/text layout, scroll-triggered animations via `framer-motion` `whileInView`.

---

## Background

`bg.png` from `/gallery/bg.png` as `fill` + `object-cover`, no overlay — identical to `HeroSection`. Section uses `bg-cream` as fallback.

---

## Layout

- Max width: `max-w-sm mx-auto` (mobile-first, desktop centered same)
- Title: `font-heading` script font, top-left aligned within the container
- `Cupid.png`: absolute top-right corner of the section, `w-[120px]` approx

### Timeline Grid

4 rows using CSS grid `grid-cols-[1fr_auto_1fr]`:

| Row | Left cell | Center | Right cell |
|-----|-----------|--------|------------|
| 1 | `shoes.png` (image) | dot | "16:00 Виїзд з Кишинева" (text) |
| 2 | "Церемонія 17:00" (text) | dot | `arch.png` (image) |
| 3 | `photo&glass.png` (image) | dot | "18:00 Святковий банкет" (text) |
| 4 | "Весільний торт 00:00" (text) | dot | `Cake_2.png` (image) |

Center column: vertical line (`border-l` or `w-px bg-dark/40`) connecting dots (`w-2 h-2 rounded-full bg-dark`).

---

## Animation Sequence (`whileInView`, `once: true`)

All triggered when the section enters viewport:

1. **Title** — `opacity: 0→1, y: -10→0`, delay 0s
2. **Cupid** — `opacity: 0→1, x: +40, y: -40 → 0,0`, delay 0.1s
3. **Vertical line + dots + text labels** — `opacity: 0→1`, delay 0s (first on scroll)
4. **shoes.png** — slides from left `x: -60→0`, delay 0.2s
5. **arch.png** — slides from right `x: +60→0`, delay 0.4s
6. **photo&glass.png** — slides from left `x: -60→0`, delay 0.6s
7. **Cake_2.png** — slides from right `x: +60→0`, delay 0.8s

---

## Translations

New keys added to both `ru.json` and `ro.json`:

| Key | RU | RO |
|-----|----|----|
| `departure` | Выезд из Кишинёва | Plecare din Chișinău |
| `departure_time` | 16:00 | 16:00 |
| `ceremony_time` | 17:00 | 17:00 |
| `banquet_time` | 18:00 | 18:00 |
| `cake_time` | 00:00 | 00:00 |

Existing keys reused: `ceremony`, `banquet`, `cake`.

---

## Files Changed

- `components/sections/TimelineSection.tsx` — full rewrite
- `lib/i18n/ru.json` — add departure keys
- `lib/i18n/ro.json` — add departure keys

---

## Out of Scope

- No desktop-specific breakpoint changes (A option chosen: same layout, centered)
- No changes to other sections
