import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data } = await supabase
    .from('rsvp_responses')
    .select('attending, guest_count, submitted_at, guests(name, slug, language)')
    .order('submitted_at', { ascending: true })

  const header = 'Guest Name,Slug,Language,Attending,Guest Count,Submitted At'
  const rows = (data ?? []).map(r => {
    const g = r.guests as unknown as { name: string; slug: string; language: string } | null
    return [
      `"${(g?.name ?? '').replace(/"/g, '""')}"`,
      g?.slug ?? '',
      g?.language ?? '',
      r.attending ? 'Yes' : 'No',
      r.guest_count,
      new Date(r.submitted_at).toLocaleString('uk-UA'),
    ].join(',')
  })

  return new NextResponse([header, ...rows].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rsvp-responses.csv"',
    },
  })
}
