# Wedding Invite Platform — Design Spec
**Date:** 2026-04-23  
**Wedding date:** 23.08.2026

---

## Overview

A personalized digital wedding invitation platform built with Next.js + Supabase. Each guest receives a unique URL with their name pre-filled. The couple manages guests and views RSVP responses via a protected admin dashboard.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Components | shadcn/ui |
| i18n | next-intl (Russian + Romanian) |
| Backend/DB | Supabase (PostgreSQL + Auth + RLS) |
| Deployment | Vercel (free tier) |
| Export | Native CSV (no libraries) |
| Fonts | Playfair Display + Inter (Google Fonts) |

---

## Project Structure

```
app/
├── (public)/
│   └── [slug]/
│       └── page.tsx          # personalized guest invitation page
├── (admin)/
│   ├── layout.tsx            # auth guard
│   ├── login/page.tsx
│   ├── guests/page.tsx       # guest list + URL generation
│   └── rsvp/page.tsx         # RSVP responses + CSV export
├── layout.tsx
└── not-found.tsx

components/
├── sections/                 # Hero, LoveStory, Timeline, RSVP, Wishlist, Location, Telegram
├── ui/                       # shadcn/ui components
└── admin/                    # tables, forms

lib/
├── supabase/                 # client, server, middleware helpers
└── i18n/                     # ru.json, ro.json dictionaries

middleware.ts                 # protects /admin/* routes via Supabase session
```

---

## Database Schema (Supabase)

### `guests`
```sql
id          uuid        PRIMARY KEY DEFAULT gen_random_uuid()
slug        text        UNIQUE NOT NULL   -- e.g. "ivan-petrenko"
name        text        NOT NULL          -- displayed on invitation page
language    text        NOT NULL          -- 'ru' | 'ro'
created_at  timestamptz DEFAULT now()
```

### `rsvp_responses`
```sql
id            uuid        PRIMARY KEY DEFAULT gen_random_uuid()
guest_id      uuid        REFERENCES guests(id)
attending     bool        NOT NULL
guest_count   int         NOT NULL DEFAULT 1
-- reserved fields for future expansion:
meal_pref     text        NULL
transport     bool        NULL
song_request  text        NULL
custom_data   jsonb       NULL      -- extensible without migrations
submitted_at  timestamptz DEFAULT now()
```

### `wishlist_items` *(hidden, reserved for future item reservation feature)*
```sql
id          uuid  PRIMARY KEY DEFAULT gen_random_uuid()
title       text  NOT NULL
amount      int   NULL
link        text  NULL
reserved_by text  NULL
```

### `site_config` *(key-value store, no redeploy needed)*
```sql
key    text  PRIMARY KEY   -- 'wedding_date', 'card_number', 'telegram_link', ...
value  text  NOT NULL
```

**Row Level Security:**
- Admin accounts: full read/write access
- Public: can read their own guest row by slug, insert one RSVP response per guest

---

## Public Site — Invitation Page (`/[slug]`)

### Guest Flow
```
GET /ivan-petrenko
  → page.tsx (Server Component) fetches guest by slug from Supabase
  → calls notFound() if slug not in DB → renders 404 page
  → renders page with guest's language (ru | ro)
```
Note: slug validation happens in the page Server Component, NOT in middleware. Middleware only handles /admin/* auth.

### Sections (top to bottom)

| # | Component | Content |
|---|-----------|---------|
| 1 | `HeroSection` | Couple names, date 23.08.2026, live countdown timer, personalized guest greeting |
| 2 | `LoveStorySection` | Photo gallery / slider — **swappable block** |
| 3 | `TimelineSection` | Wedding day schedule with icons |
| 4 | `LocationSection` | Venue address + Google Maps embed + "Open in Navigator" button |
| 5 | `RSVPSection` | Confirmation form (attending yes/no + guest count) |
| 6 | `WishlistSection` | Card number + copy button / payment link |
| 7 | `TelegramSection` | Link to Telegram group |

### Design System (Minimalism)
- **Palette:** `#FAFAF8` (cream), `#1A1A1A` (near-black), `#C9A96E` (gold accent)
- **Fonts:** Playfair Display (headings) + Inter (body)
- **Layout:** Maximum whitespace, no borders, clean spacing

### Animations (Framer Motion)
- `FadeInUp` on scroll for each section (`viewport: { once: true }`)
- Live countdown timer updating every second
- Smooth photo slider in LoveStory

### i18n
- Language determined from `guests.language` field — fixed per guest, no switcher
- `next-intl` with `ru.json` and `ro.json` dictionaries
- All UI strings (button labels, section titles, form placeholders) translated

---

## Admin Dashboard (`/admin/*`)

### Auth
- Supabase Auth — email/password, 2 accounts (couple)
- `middleware.ts` intercepts all `/admin/*` requests, checks Supabase session cookie
- Both accounts have identical permissions (no roles needed)

### `/admin/login`
- Email + password form
- Redirects to `/admin/guests` on success

### `/admin/guests`
- Table: Name | Slug | Language | URL (with copy button) | RSVP status | Actions (edit/delete)
- "Add guest" button → modal with name, language selector
- Slug auto-generated from name (transliteration), editable
- RSVP column shows: ✅ N people / ⏳ pending / ❌ declined

### `/admin/rsvp`
- Summary bar: Total invited | Confirmed | Declined | Pending
- Table: Guest name | Attending | Count | Response time
- Filter by status (all / confirmed / declined / pending)
- **"⬇ Download CSV"** button — server-generated, no libraries

**CSV export columns:**
```
Guest Name, Slug, Language, Attending, Guest Count, Submitted At
```

---

## Extensibility Notes

These features are explicitly designed for but NOT built initially:

| Feature | How to extend |
|---------|--------------|
| RSVP meal preference | Add `meal_pref` field to form, already in DB |
| RSVP transport | Add `transport` checkbox, already in DB |
| RSVP song request | Add `song_request` field, already in DB |
| Any custom RSVP field | Use `custom_data jsonb` column — no migration needed |
| Wishlist item reservation | `wishlist_items` table already exists, build UI on top |
| LoveStory replacement | `LoveStorySection` is an isolated component, swap freely |

---

## Deployment

- **Vercel** free tier — single project, automatic deploys from `main` branch
- **Environment variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for admin server actions)
- Domain: Vercel subdomain (`*.vercel.app`) initially, custom domain later

---

## Out of Scope

- Docker / containerization
- Redis / caching
- Automated tests
- Headless CMS
- PDF export
- Email/SMS notifications to guests
- Multi-language switcher on public pages
