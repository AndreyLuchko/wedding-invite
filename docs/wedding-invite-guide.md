# 💍 Платформа для весільних запрошень
### Next.js + Tailwind + Framer Motion

Цей гайд допоможе створити преміальне цифрове запрошення з персоналізацією, анімаціями та системою збору RSVP-відповідей.

---

## 🚀 Технологічний стек

| Категорія | Технологія |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS + Lucide Icons |
| Animations | Framer Motion |
| Components | shadcn/ui |
| Backend/DB | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## 🛠 Крок 1: Ініціалізація проекту

Створіть новий проект та встановіть необхідні залежності для анімацій та форм.

```bash
npx create-next-app@latest wedding-invite --typescript --tailwind --eslint
cd wedding-invite

# Встановлення бібліотек для анімації та UI
npm install framer-motion lucide-react clsx tailwind-merge
npx shadcn-ui@latest init
```

---

## 🎨 Крок 2: Дизайн та типографіка (Преміум стиль)

Для ефекту «Lana Ultra» важливо поєднати класику та мінімалізм. Налаштуйте шрифти у `tailwind.config.ts`:

- Використовуйте **Serif** шрифт (напр., Playfair Display) для заголовків.
- Використовуйте **Sans-serif** (напр., Montserrat або Inter) для основного тексту.

```typescript
// tailwind.config.ts snippet
theme: {
  extend: {
    fontFamily: {
      serif: ['var(--font-playfair)', 'serif'],
      sans: ['var(--font-inter)', 'sans-serif'],
    },
  },
}
```

---

## 👤 Крок 3: Персоналізація через Динамічні Роути

Щоб звертатися до кожного гостя на ім'я, створіть структуру папок: `app/[slug]/page.tsx`.

```typescript
// app/[slug]/page.tsx
export default function WeddingPage({ params }: { params: { slug: string } }) {
  // slug може бути "ivan-ta-olena"
  const guestName = params.slug.replace(/-/g, ' ');

  return (
    <main className="min-h-screen">
      <HeroSection guest={guestName} />
      <Timeline />
      <RSVPForm guestId={params.slug} />
    </main>
  );
}
```

---

## ✨ Крок 4: Додавання "Ultra" анімацій

Використовуйте `framer-motion` для плавного випливання контенту при скролі.

```typescript
"use client";
import { motion } from "framer-motion";

export const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
```

---

## 📝 Крок 5: RSVP Форма та Supabase

Для збору відповідей (хто прийде, алергії, трансфер) налаштуйте Server Actions.

Створіть таблицю в Supabase: `id`, `guest_name`, `status` (bool), `meal_pref`, `transport` (bool).

**Server Action:**

```typescript
// app/actions.ts
'use server'
import { createClient } from '@/utils/supabase/server'

export async function submitRSVP(formData: FormData) {
  const supabase = createClient();
  const data = {
    guest_id: formData.get('guestId'),
    attending: formData.get('attending') === 'true',
    // ... інші поля
  };

  const { error } = await supabase.from('responses').insert([data]);
  return { success: !error };
}
```

---

## 📍 Крок 6: Обов'язкові блоки (Checklist)

| Блок | Що додати |
|------|-----------|
| **Hero** | Фото пари, дата, таймер зворотного відліку |
| **Location** | Віджет Google Maps + кнопка "Відкрити в навігаторі" |
| **Details** | Дрес-код (палітра кольорів), побажання щодо квітів/алкоголю |
| **Schedule** | Таймлайн дня (Церемонія → Фуршет → Банкет) |
| **Wishlist** | Список подарунків або номер картки для "банки" |

---

## 🚢 Крок 7: Деплой та Розсилка

1. Завантажте код на **GitHub**.
2. Підключіть репозиторій до **Vercel**.
3. Додайте Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

**Генерація посилань:**

Створіть простий скрипт або Excel-таблицю, яка додає імена гостей до вашого домену:

```
https://our-wedding.vercel.app/petro-and-mariya
```
