import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data } = await supabase
    .from('rsvp_responses')
    .select('attending, guest_count, transport, submitted_at, guests(name, slug, language, greeting_text)')
    .order('submitted_at', { ascending: false })

  const escapeCsv = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`

  const header = 'Guest Name,Greeting,Slug,Language,Attending,Guest Count,Transfer,Submitted At'
  const rows = (data ?? []).map(r => {
    const g = r.guests as unknown as { name: string; slug: string; language: string; greeting_text: string } | null
    return [
      escapeCsv(g?.name ?? ''),
      escapeCsv(g?.greeting_text ?? ''),
      g?.slug ?? '',
      g?.language ?? '',
      r.attending ? 'Yes' : 'No',
      r.guest_count,
      r.transport === true ? 'Yes' : r.transport === false ? 'No' : '',
      new Date(r.submitted_at).toLocaleString('uk-UA'),
    ].join(',')
  })

  const needsTransfer = (data ?? [])
    .filter(r => r.transport === true)
    .reduce((sum, r) => sum + r.guest_count, 0)

  const summary = `,,,,,,Total needing transfer,${needsTransfer}`

  return new NextResponse([header, ...rows, '', summary].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rsvp-responses.csv"',
    },
  })
}
