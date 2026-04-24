'use client'
import { useState } from 'react'
import { Copy, Check, Trash2, Plus, X } from 'lucide-react'
import { addGuest, deleteGuest } from '@/app/actions/guests'
import type { GuestWithRsvp } from '@/lib/types'

interface GuestsTableProps {
  guests: GuestWithRsvp[]
  baseUrl: string
}

export function GuestsTable({ guests, baseUrl }: GuestsTableProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [showForm, setShowForm]     = useState(false)
  const [newName, setNewName]       = useState('')
  const [newLang, setNewLang]       = useState<'ru' | 'ro'>('ru')
  const [adding, setAdding]         = useState(false)
  const [addError, setAddError]     = useState('')

  async function handleCopy(slug: string) {
    await navigator.clipboard.writeText(`${baseUrl}/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    setAddError('')
    const result = await addGuest(newName.trim(), newLang)
    if (!result.success) {
      setAddError(result.error ?? 'Error adding guest')
      setAdding(false)
      return
    }
    setNewName('')
    setAdding(false)
    setShowForm(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This also removes their RSVP response.`)) return
    await deleteGuest(id)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Guests <span className="text-gray-400 text-lg font-normal">({guests.length})</span>
        </h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm rounded hover:bg-gray-700 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add guest'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex gap-3 mb-6 p-4 bg-white rounded border">
          <input
            type="text"
            placeholder="Full name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
            className="flex-1 border border-gray-300 px-3 py-2 text-sm rounded outline-none focus:border-gray-500"
          />
          <select
            value={newLang}
            onChange={e => setNewLang(e.target.value as 'ru' | 'ro')}
            className="border border-gray-300 px-3 py-2 text-sm rounded"
          >
            <option value="ru">Russian</option>
            <option value="ro">Romanian</option>
          </select>
          <button
            type="submit"
            disabled={adding}
            className="bg-gray-900 text-white px-4 py-2 text-sm rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            {adding ? '…' : 'Add'}
          </button>
          {addError && <p className="text-red-500 text-xs self-center">{addError}</p>}
        </form>
      )}

      <div className="bg-white rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Lang</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">URL</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">RSVP</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {guests.map(g => {
              const rsvp = g.rsvp_responses?.[0]
              return (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{g.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs uppercase">{g.language}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleCopy(g.slug)}
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <span className="text-xs">/{g.slug}</span>
                      {copiedSlug === g.slug
                        ? <Check className="w-3 h-3 text-green-500" />
                        : <Copy className="w-3 h-3" />
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {!rsvp && <span className="text-gray-400 text-xs">Pending</span>}
                    {rsvp?.attending === true  && <span className="text-green-600 text-xs">✓ {rsvp.guest_count} person(s)</span>}
                    {rsvp?.attending === false && <span className="text-red-400 text-xs">✗ Declined</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(g.id, g.name)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {guests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                  No guests yet. Add your first guest above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
