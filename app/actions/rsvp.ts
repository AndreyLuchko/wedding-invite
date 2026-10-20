'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_GUESTS = 10

export async function submitRsvp(
  guestId: string,
  attending: boolean,
  guestCount: number,
  needsTransport: boolean | null
): Promise<{ success: boolean; error?: string }> {
  // Server Actions are public endpoints — validate everything the client sends.
  if (
    typeof guestId !== 'string' || !UUID_RE.test(guestId) ||
    typeof attending !== 'boolean' ||
    (attending && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > MAX_GUESTS)) ||
    (needsTransport !== null && typeof needsTransport !== 'boolean')
  ) {
    return { success: false, error: 'invalid_input' }
  }

  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('rsvp_responses')
    .select('id')
    .eq('guest_id', guestId)
    .maybeSingle()

  if (existing) return { success: false, error: 'already_submitted' }

  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select('greeting_text')
    .eq('id', guestId)
    .maybeSingle()

  if (guestError || !guest) return { success: false, error: 'not_found' }

  const { error } = await supabase.from('rsvp_responses').insert({
    guest_id:    guestId,
    greeting_text: guest.greeting_text,
    attending,
    guest_count: attending ? guestCount : 0,
    transport:   attending ? needsTransport : null,
  })

  // 23505 = unique_violation: a concurrent submit won the race (see migration 004)
  if (error?.code === '23505') return { success: false, error: 'already_submitted' }
  if (error) return { success: false, error: 'save_failed' }

  revalidatePath('/admin/rsvp')
  revalidatePath('/admin/guests')
  return { success: true }
}
