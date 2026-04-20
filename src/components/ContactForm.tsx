'use client'
import { useState } from 'react'

const formatPhone = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3)
  return '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3, 6) + '-' + cleaned.slice(6, 10)
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setDone(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 font-display text-2xl font-bold text-slate-800">Message Sent!</h3>
        <p className="text-slate-500">
          Thanks, {form.name.split(' ')[0]}. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg text-charcoal text-base focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1'

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-purple-100 bg-white p-5 sm:p-8 space-y-5">
      <div>
        <label className={labelClass}>Full Name *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="Your full name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className={labelClass}>Phone <span className="text-gray-300">(optional)</span></label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
            className={inputClass}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Message *</label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={inputClass}
          rows={5}
          placeholder="How can we help?"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-full bg-purple-600 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-purple-700 disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
