'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/guests')
      router.refresh()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-57px)] px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-gray-900 text-center mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-600 rounded transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-600 rounded transition-colors"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? '…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
