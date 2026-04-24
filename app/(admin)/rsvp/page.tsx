import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function RsvpPage() {
  const supabase = await createClient()

  const { data: responses } = await supabase
    .from('rsvp_responses')
    .select('*, guests(name)')
    .order('submitted_at', { ascending: false })

  const { count: totalGuests } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true })

  const confirmed   = (responses ?? []).filter(r =>  r.attending).length
  const declined    = (responses ?? []).filter(r => !r.attending).length
  const pending     = (totalGuests ?? 0) - (responses?.length ?? 0)
  const totalPeople = (responses ?? [])
    .filter(r => r.attending)
    .reduce((sum, r) => sum + r.guest_count, 0)

  const stats = [
    { label: 'Invited',      value: totalGuests ?? 0 },
    { label: 'Confirmed',    value: confirmed },
    { label: 'Declined',     value: declined },
    { label: 'Pending',      value: pending },
    { label: 'Total people', value: totalPeople },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">RSVP Responses</h1>
        <a
          href="/api/export/rsvp"
          download
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm rounded hover:border-gray-500 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-white rounded border p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Guest</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Attending</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">People</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(responses ?? []).map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {(r.guests as { name: string } | null)?.name ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {r.attending
                    ? <span className="text-green-600">✓ Yes</span>
                    : <span className="text-red-400">✗ No</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {r.attending ? r.guest_count : '—'}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(r.submitted_at).toLocaleString('uk-UA')}
                </td>
              </tr>
            ))}
            {(responses ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No responses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
