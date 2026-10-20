# Wedding Invite

A personalized digital wedding invitation platform. Every guest gets their own invitation page with a
personal greeting in their language, can RSVP in a couple of taps, and the couple manages the guest
list and responses from a protected admin panel.

Built for a real wedding and used by real guests.

## Features

**Guest-facing invitation (`/[slug]`)**

- Personal page per guest — URL slug generated from the guest's name (with Cyrillic transliteration)
- Bilingual: Russian / Romanian, language set per guest (`next-intl`)
- Sections: hero, personal greeting, venue & map, dress code, day timeline, RSVP, gift wishlist,
  Telegram group, countdown to the date
- Mobile-first layout, Framer Motion scroll animations, background music player

**RSVP**

- Attending / not attending, number of guests, transfer needed
- One response per guest — enforced both in the Server Action and by a `UNIQUE` constraint in the database

**Admin panel (`/admin`)**

- Protected with Supabase Auth; route guarding in Next.js middleware
- Add / delete guests, edit personal greetings
- View all RSVP responses
- CSV export of responses, with a total of guests needing transfer

## Tech stack

| Layer     | Tools                                                                            |
| --------- | -------------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript |
| UI        | Tailwind CSS 4, shadcn/ui, Framer Motion, Lucide icons                           |
| i18n      | next-intl                                                                        |
| Backend   | Supabase — PostgreSQL, Auth, Row Level Security, SQL migrations                  |
| Hosting   | Vercel                                                                           |

## Project structure

```
app/
  (public)/[slug]/   personalized invitation page
  admin/             login + protected guests / RSVP pages
  actions/           Server Actions (guests, RSVP)
  api/export/rsvp/   CSV export route
components/
  sections/          invitation page sections
  admin/             admin UI
lib/
  supabase/          browser / server / admin clients
  i18n/              ru.json, ro.json
supabase/migrations/ database schema
middleware.ts        admin route protection
```

## Running locally

1. Create a Supabase project and apply the SQL files in `supabase/migrations/` in order.
2. Create `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # server-only, used by Server Actions
   ```

3. Create an admin user in Supabase Auth, then:

   ```bash
   npm install
   npm run dev
   ```

   Admin panel: http://localhost:3000/admin
