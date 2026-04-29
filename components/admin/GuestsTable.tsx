'use client'
import { useState } from 'react'
import { Copy, Check, Trash2, Plus, X, Pencil } from 'lucide-react'
import { addGuest, deleteGuest, updateGuest } from '@/app/actions/guests'
import type { GuestWithRsvp } from '@/lib/types'

interface GuestsTableProps {
  guests: GuestWithRsvp[]
  baseUrl: string
}

interface EditingGuest {
  id: string
  name: string
  language: 'ru' | 'ro'
}

export function GuestsTable({ guests, baseUrl }: GuestsTableProps) {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [showForm, setShowForm]     = useState(false)
  const [newName, setNewName]       = useState('')
  const [newLang, setNewLang]       = useState<'ru' | 'ro'>('ru')
  const [adding, setAdding]         = useState(false)
  const [addError, setAddError]     = useState('')

  const [editing, setEditing]       = useState<EditingGuest | null>(null)
  const [editName, setEditName]     = useState('')
  const [editLang, setEditLang]     = useState<'ru' | 'ro'>('ru')
  const [saving, setSaving]         = useState(false)
  const [editError, setEditError]   = useState('')

  async function handleCopy(slug: string) {
    await navigator.clipboard.writeText(`${baseUrl}/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  async function handleAdd(e: React.SyntheticEvent) {
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

  function openEdit(g: GuestWithRsvp) {
    setEditing({ id: g.id, name: g.name, language: g.language as 'ru' | 'ro' })
    setEditName(g.name)
    setEditLang(g.language as 'ru' | 'ro')
    setEditError('')
  }

  function closeEdit() {
    setEditing(null)
    setEditError('')
  }

  async function handleSaveEdit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    setEditError('')
    const result = await updateGuest(editing.id, editName.trim(), editLang)
    if (!result.success) {
      setEditError(result.error ?? 'Error updating guest')
      setSaving(false)
      return
    }
    setSaving(false)
    closeEdit()
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(g)}
                        className="hidden text-gray-300 hover:text-blue-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id, g.name)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

      {editing && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={e => { if (e.target === e.currentTarget) closeEdit() }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Edit Guest</h2>
              <button onClick={closeEdit} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  autoFocus
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded outline-none focus:border-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
                <select
                  value={editLang}
                  onChange={e => setEditLang(e.target.value as 'ru' | 'ro')}
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded"
                >
                  <option value="ru">Russian</option>
                  <option value="ro">Romanian</option>
                </select>
              </div>
              {editError && <p className="text-red-500 text-xs">{editError}</p>}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 text-sm rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gray-900 text-white py-2 text-sm rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
                >
                  {saving ? '…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
