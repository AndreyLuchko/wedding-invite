import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => ({
  locale: 'ru',
  messages: (await import('../lib/i18n/ru.json')).default,
}))
