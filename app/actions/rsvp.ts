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

  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select('greeting_text')
    .eq('id', guestId)
    .single()

  if (guestError) return { success: false, error: guestError.message }

  const { error } = await supabase.from('rsvp_responses').insert({
    guest_id:    guestId,
    greeting_text: guest.greeting_text,
    attending,
    guest_count: attending ? guestCount : 0,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/rsvp')
  return { success: true }
}
