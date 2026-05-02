'use server'
import { createClient } from '@/lib/supabase/server'
import { nameToSlug } from '@/lib/utils/slug'
import { revalidatePath } from 'next/cache'

export async function addGuest(
  name: string,
  greetingText: string,
  language: 'ru' | 'ro'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }
  if (!name || !greetingText) return { success: false, error: 'Name and greeting are required' }
  const slug = nameToSlug(name)

  const { error } = await supabase
    .from('guests')
    .insert({ name, slug, greeting_text: greetingText, language })
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/guests')
  return { success: true }
}

export async function deleteGuest(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }
  const { error } = await supabase.from('guests').delete().eq('id', id)
  if (error) return { success: false }
  revalidatePath('/admin/guests')
  return { success: true }
}

export async function updateGuestGreeting(
  id: string,
  greetingText: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }
  if (!greetingText) return { success: false, error: 'Greeting is required' }
  const { error } = await supabase
    .from('guests')
    .update({ greeting_text: greetingText })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/admin/guests')
  return { success: true }
}
