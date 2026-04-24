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

  const { data: guests } = await supabase
    .from('guests')
    .select('*, rsvp_responses(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <GuestsTable guests={(guests as GuestWithRsvp[]) ?? []} baseUrl={baseUrl} />
    </div>
  )
}
