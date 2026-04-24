'use server'
import { createClient } from '@/lib/supabase/server'
import { nameToSlug } from '@/lib/utils/slug'
import { revalidatePath } from 'next/cache'

export async function addGuest(
  name: string,
  language: 'ru' | 'ro'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }
  const slug = nameToSlug(name)

  const { error } = await supabase.from('guests').insert({ name, slug, language })
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
