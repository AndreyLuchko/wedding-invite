import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { GuestsTable } from '@/components/admin/GuestsTable'
import type { GuestWithRsvp } from '@/lib/types'

export default async function GuestsPage() {
  const supabase     = await createClient()
  const headersList  = await headers()
  const host         = headersList.get('host') ?? 'localhost:3000'
  const protocol     = host.includes('localhost') ? 'http' : 'https'
  const baseUrl      = `${protocol}://${host}`

  const [{ data: guests, error }, { data: rsvps }] = await Promise.all([
    supabase.from('guests').select('*').order('created_at', { ascending: false }),
    supabase.from('rsvp_responses').select('*'),
  ])

  if (error) console.error('Failed to load guests:', error.message)

  const guestsWithRsvp: GuestWithRsvp[] = (guests ?? []).map(g => ({
    ...g,
    rsvp_responses: (rsvps ?? []).filter(r => r.guest_id === g.id),
  }))

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <GuestsTable guests={guestsWithRsvp} baseUrl={baseUrl} />
    </div>
  )
}
