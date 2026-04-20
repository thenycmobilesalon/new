'use client'

import { useEffect, useState } from 'react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  service: string
  borough: string
  preferred_date: string | null
  message: string | null
  status: 'new' | 'contacted' | 'booked' | 'cancelled'
  created_at: string
}

const STATUSES: Lead['status'][] = ['new', 'contacted', 'booked', 'cancelled']

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function RequestsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<Lead['status'] | 'all'>('all')

  const fetchLeads = () => {
    setLoading(true)
    setError(null)
    fetch('/api/requests')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load (${r.status})`)
        return r.json()
      })
      .then(d => setLeads(d.leads || []))
      .catch(e => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLeads() }, [])

  const updateStatus = async (id: string, status: Lead['status']) => {
    setUpdating(id)
    await fetch('/api/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    setUpdating(null)
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error} <button onClick={fetchLeads} className="underline ml-2">Retry</button></div>

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    booked: leads.filter(l => l.status === 'booked').length,
    cancelled: leads.filter(l => l.status === 'cancelled').length,
  }

  return (
    <main className="p-3 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1E2A4A] tracking-tight">Requests</h2>
        <p className="text-gray-400 text-xs mt-0.5">{leads.length} total website form submissions</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', ...STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg border ${filter === s ? 'bg-[#1E2A4A] text-white border-[#1E2A4A]' : 'bg-white text-[#1E2A4A]/60 border-gray-200 hover:border-[#A8F0DC]'}`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No requests.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-left text-[10px] font-bold tracking-wider uppercase text-[#1E2A4A]/50 whitespace-nowrap">
              <tr>
                <th className="px-3 py-2.5 w-10">#</th>
                <th className="px-3 py-2.5">Name</th>
                <th className="px-3 py-2.5">Phone</th>
                <th className="px-3 py-2.5">Email</th>
                <th className="px-3 py-2.5">Service</th>
                <th className="px-3 py-2.5">Area</th>
                <th className="px-3 py-2.5">Preferred</th>
                <th className="px-3 py-2.5">Message</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5 text-right">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((l, i) => (
                <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-2 text-xs text-gray-400">{i + 1}</td>
                  <td className="px-3 py-2 text-[#1E2A4A] font-medium whitespace-nowrap">{l.name}</td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap"><a href={`tel:${l.phone}`} className="hover:underline">{l.phone}</a></td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap"><a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a></td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{l.service}</td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{l.borough}</td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{l.preferred_date || '—'}</td>
                  <td className="px-3 py-2 text-gray-500 max-w-[260px] truncate" title={l.message || ''}>{l.message || '—'}</td>
                  <td className="px-3 py-2">
                    <select
                      value={l.status}
                      disabled={updating === l.id}
                      onChange={(e) => updateStatus(l.id, e.target.value as Lead['status'])}
                      className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-400 whitespace-nowrap">{timeAgo(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
