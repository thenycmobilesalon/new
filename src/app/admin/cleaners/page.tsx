'use client'

import { useState, useEffect, useRef } from 'react'

import SidePanel from '@/components/SidePanel'
import AddressAutocomplete from '@/components/AddressAutocomplete'

// Compress image client-side before upload (max 1200px, JPEG quality 0.8)
function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    // Skip if already small enough
    if (file.size < 500_000) { resolve(file); return }
    const img = new Image()
    img.onload = () => {
      const MAX = 1200
      let w = img.width, h = img.height
      if (w > MAX || h > MAX) {
        const scale = Math.min(MAX / w, MAX / h)
        w = Math.round(w * scale)
        h = Math.round(h * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      canvas.toBlob((blob) => {
        resolve(blob ? new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }) : file)
      }, 'image/jpeg', 0.8)
    }
    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}

interface Schedule {
  [day: string]: { start: string; end: string } | null
}

interface Stylist {
  id: string
  name: string
  email: string
  phone: string
  address: string | null
  working_days: string[]
  schedule: Schedule | null
  unavailable_dates: string[]
  pin: string | null
  hourly_rate: number | null
  active: boolean
  priority: number | null
  photo_url: string | null
  max_jobs_per_day?: number | null
  service_zones?: string[]
  has_car?: boolean
  home_by_time?: string
  created_at?: string
}

interface Application {
  id: string
  name: string
  email: string | null
  phone: string
  specialty: string | null
  borough: string | null
  instagram: string | null
  experience: string | null
  availability: string | null
  message: string | null
  resume_url: string | null
  video_url: string | null
  status: string
  created_at: string
}

interface CeoApplication {
  id: string
  name: string
  email: string
  phone: string
  linkedin_url: string
  location: string
  current_title: string | null
  current_company: string | null
  years_experience: string
  marketplace_background: string
  other_platforms: string | null
  pl_experience: string
  team_size: string
  biggest_scale: string
  why_sweat_equity: string
  plan_30_60_90: string
  anything_else: string | null
  video_url: string
  resume_url: string | null
  status: string
  created_at: string
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = [
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM'
]

export default function StylistsPage() {
  useEffect(() => { document.title = 'Team | The NYC Mobile Salon' }, []);
  const [activeTab, setActiveTab] = useState<'team' | 'applications' | 'ops-manager'>('team')
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [ceoApplications, setCeoApplications] = useState<CeoApplication[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    unit: '',
    working_days: [] as string[],
    schedule: {} as Schedule,
    unavailable_dates: [] as string[],
    pin: '',
    hourly_rate: 25,
    active: true,
    photo_url: '' as string,
    max_jobs_per_day: null as number | null,
    service_zones: [] as string[],
    has_car: false,
    home_by_time: '18:00',
  })
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [newDateOff, setNewDateOff] = useState('')
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  useEffect(() => {
    loadStylists()
    loadApplications()
    loadCeoApplications()
  }, [])

  const loadStylists = async () => {
    const res = await fetch('/api/cleaners')
    if (res.ok) {
      const data = await res.json()
      // Show all stylists (active first, then inactive)
      setStylists(data.sort((a: Stylist, b: Stylist) => Number(b.active) - Number(a.active)))
    }
  }

  const loadApplications = async () => {
    try {
      const res = await fetch('/api/admin?tab=applications')
      if (res.ok) {
        const json = await res.json()
        setApplications(json.data || [])
      }
    } catch (err) {
      console.error('Failed to load applications:', err)
    }
  }

  const loadCeoApplications = async () => {
    try {
      const res = await fetch('/api/admin?tab=ceo_applications')
      if (res.ok) {
        const json = await res.json()
        setCeoApplications(json.data || [])
      }
    } catch (err) {
      console.error('Failed to load CEO applications:', err)
    }
  }

  const handleCeoStatus = async (id: string, status: string) => {
    if (status === 'rejected' && !confirm('Reject this application?')) return
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, table: 'ceo_applications', status })
    })
    loadCeoApplications()
  }

  const handlePhotoUpload = async (rawFile: File, stylistId?: string) => {
    setUploadingPhoto(true)
    try {
      const file = await compressImage(rawFile)
      const formData = new FormData()
      formData.append('file', file)
      if (stylistId) formData.append('cleaner_id', stylistId)
      const res = await fetch('/api/cleaners/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setForm(f => ({ ...f, photo_url: data.url }))
        if (stylistId) loadStylists()
      } else {
        alert(data.error || 'Failed to upload photo')
      }
    } catch (err) {
      alert('Failed to upload photo: ' + (err instanceof Error ? err.message : 'unknown error'))
    }
    setUploadingPhoto(false)
  }

  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fullAddress = form.unit
      ? `${form.address}, ${form.unit}`
      : form.address

    // Strip past dates from unavailable_dates
    const today = new Date().toISOString().split('T')[0]
    const futureDates = form.unavailable_dates.filter(d => d >= today)

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: fullAddress || null,
      working_days: form.working_days,
      schedule: form.schedule,
      unavailable_dates: futureDates,
      pin: form.pin,
      hourly_rate: form.hourly_rate,
      active: form.active,
      photo_url: form.photo_url || null,
      max_jobs_per_day: form.max_jobs_per_day || null,
      service_zones: form.service_zones,
      has_car: form.has_car,
      home_by_time: form.home_by_time,
    }

    let error: string | null = null
    if (editingId) {
      const res = await fetch(`/api/cleaners/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json()
        error = err.error || 'Failed to update'
      }
    } else {
      const res = await fetch('/api/cleaners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json()
        error = err.error || 'Failed to create'
      } else if (form.email) {
        fetch('/api/send-booking-emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'cleaner-welcome', cleaner: { name: form.name, email: form.email, pin: form.pin, phone: form.phone } })
        })
      }
    }

    if (error) {
      alert('Error saving: ' + error)
      return
    }

    setShowModal(false)
    setEditingId(null)
    setForm({ name: '', email: '', phone: '', address: '', unit: '', working_days: [], schedule: {}, unavailable_dates: [], pin: '', hourly_rate: 25, active: true, photo_url: '', max_jobs_per_day: null, service_zones: [], has_car: false, home_by_time: '18:00' })
    setNewDateOff('')
    loadStylists()
  }

  const handleEdit = (stylist: Stylist) => {
    setEditingId(stylist.id)
    setForm({
      name: stylist.name,
      email: stylist.email || '',
      phone: stylist.phone,
      address: stylist.address || '',
      unit: '',
      working_days: stylist.working_days || [],
      schedule: stylist.schedule || {},
      unavailable_dates: stylist.unavailable_dates || [],
      pin: stylist.pin || '',
      hourly_rate: stylist.hourly_rate || 25,
      active: stylist.active,
      photo_url: stylist.photo_url || '',
      max_jobs_per_day: stylist.max_jobs_per_day || null,
      service_zones: stylist.service_zones || [],
      has_car: stylist.has_car || false,
      home_by_time: stylist.home_by_time || '18:00',
    })
    setNewDateOff('')
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Permanently delete this team member? This cannot be undone.')) {
      const res = await fetch(`/api/cleaners/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadStylists()
      } else {
        const err = await res.json()
        alert('Error: ' + (err.error || 'Failed to delete'))
      }
    }
  }

  const handleApproveApplication = async (app: Application) => {
    // Create stylist from application
    const pin = generatePin()
    const res = await fetch('/api/cleaners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: app.name,
        email: app.email,
        phone: app.phone,
        address: app.borough || '',
        pin,
        hourly_rate: 25,
        active: true,
        working_days: [],
        schedule: {},
        photo_url: '',
        service_zones: (app as any).service_zones || [],
        has_car: (app as any).has_car || false,
      })
    })

    if (!res.ok) {
      const err = await res.json()
      alert('Error creating stylist: ' + (err.error || 'Failed'))
      return
    }

    // Update application status
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: app.id, table: 'applications', status: 'hired' })
    })

    // Send welcome email
    if (app.email) {
      fetch('/api/send-booking-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cleaner-welcome', cleaner: { name: app.name, email: app.email, pin, phone: app.phone } })
      })
    }

    loadStylists()
    loadApplications()
  }

  const handleRejectApplication = async (id: string) => {
    if (!confirm('Reject this application?')) return
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, table: 'applications', status: 'rejected' })
    })
    loadApplications()
  }

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Delete this application permanently?')) return
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, table: 'applications', status: 'rejected' })
    })
    loadApplications()
  }

  const toggleDay = (day: string) => {
    if (form.working_days.includes(day)) {
      setForm({
        ...form,
        working_days: form.working_days.filter(d => d !== day),
        schedule: { ...form.schedule, [day]: null }
      })
    } else {
      setForm({
        ...form,
        working_days: [...form.working_days, day],
        schedule: { ...form.schedule, [day]: { start: '9:00 AM', end: '5:00 PM' } }
      })
    }
  }

  const updateSchedule = (day: string, field: 'start' | 'end', value: string) => {
    const current = form.schedule[day] || { start: '9:00 AM', end: '5:00 PM' }
    setForm({
      ...form,
      schedule: {
        ...form.schedule,
        [day]: {
          start: field === 'start' ? value : current.start,
          end: field === 'end' ? value : current.end
        }
      }
    })
  }

  const handlePhoneChange = (phone: string) => {
    setForm({ ...form, phone })
  }

  const formatScheduleDisplay = (stylist: Stylist) => {
    if (!stylist.schedule || Object.keys(stylist.schedule).length === 0) {
      return stylist.working_days?.join(', ') || '-'
    }

    const activeDays = DAYS.filter(d => stylist.schedule?.[d])
    if (activeDays.length === 0) return '-'

    const firstDay = stylist.schedule[activeDays[0]]
    const allSame = activeDays.every(d =>
      stylist.schedule?.[d]?.start === firstDay?.start &&
      stylist.schedule?.[d]?.end === firstDay?.end
    )

    if (allSame && firstDay) {
      return `${activeDays.join(', ')} (${firstDay.start}-${firstDay.end})`
    }

    return activeDays.map(d => {
      const s = stylist.schedule?.[d]
      return s ? `${d} ${s.start}-${s.end}` : d
    }).join(', ')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getScheduleDays = (stylist: Stylist) => {
    if (!stylist.schedule || Object.keys(stylist.schedule).length === 0) {
      return stylist.working_days || []
    }
    return DAYS.filter(d => stylist.schedule?.[d])
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'Z')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (draggedId !== id) {
      setDragOverId(id)
    }
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const draggedIndex = stylists.findIndex(c => c.id === draggedId)
    const targetIndex = stylists.findIndex(c => c.id === targetId)

    // Reorder locally
    const newStylists = [...stylists]
    const [draggedItem] = newStylists.splice(draggedIndex, 1)
    newStylists.splice(targetIndex, 0, draggedItem)
    setStylists(newStylists)

    // Save new priorities to API
    const priorities = newStylists.map((c, i) => ({ id: c.id, priority: i + 1 }))
    await fetch('/api/cleaners/priority', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priorities })
    })

    setDraggedId(null)
    setDragOverId(null)
  }

  const pendingApps = applications.filter(a => a.status === 'new' || a.status === 'pending')

  return (
    <>
      <main className="p-3 md:p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-[#1E2A4A]">Team</h2>
          <button
            onClick={() => {
              setEditingId(null)
              setForm({ name: '', email: '', phone: '', address: '', unit: '', working_days: [], schedule: {}, unavailable_dates: [], pin: generatePin(), hourly_rate: 25, active: true, photo_url: '', max_jobs_per_day: null, service_zones: [], has_car: false, home_by_time: '18:00' })
              setShowModal(true)
            }}
            className="px-4 py-2 bg-[#1E2A4A] text-white rounded-lg hover:bg-[#1E2A4A]/90"
          >
            Add Team Member
          </button>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          Team portal: <a href="https://www.thenycmobilesalon.com/team" target="_blank" className="text-[#1E2A4A] hover:underline py-2 inline-block">thenycmobilesalon.com/team</a> ·
          Client portal: <a href="https://www.thenycmobilesalon.com/book" target="_blank" className="text-[#1E2A4A] hover:underline ml-1 py-2 inline-block">thenycmobilesalon.com/book</a> ·
          Apply form: <a href="https://www.thenycmobilesalon.com/apply" target="_blank" className="text-[#1E2A4A] hover:underline ml-1 py-2 inline-block">thenycmobilesalon.com/apply</a> ·
          Ops Admin: <a href="https://www.thenycmobilesalon.com/apply/operations-coordinator" target="_blank" className="text-[#1E2A4A] hover:underline ml-1 py-2 inline-block">thenycmobilesalon.com/apply/operations-coordinator</a>
        </div>
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('team')}
            className={`pb-3 px-1 ${activeTab === 'team' ? 'border-b-2 border-[#1E2A4A] font-semibold' : 'text-gray-500'}`}
          >
            Team ({stylists.filter(c => c.active).length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 px-1 ${activeTab === 'applications' ? 'border-b-2 border-[#1E2A4A] font-semibold' : 'text-gray-500'}`}
          >
            Applications {pendingApps.length > 0 && <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">{pendingApps.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('ops-manager')}
            className={`pb-3 px-1 ${activeTab === 'ops-manager' ? 'border-b-2 border-[#1E2A4A] font-semibold' : 'text-gray-500'}`}
          >
            Founding CEO {ceoApplications.filter(a => a.status === 'new').length > 0 && <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">{ceoApplications.filter(a => a.status === 'new').length}</span>}
          </button>
        </div>

        {activeTab === 'ops-manager' ? (
          <div className="space-y-4">
            {ceoApplications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No Founding CEO applications yet. Share the link: <a href="https://www.thenycmobilesalon.com/founding-ceo" className="text-[#1E2A4A]">thenycmobilesalon.com/founding-ceo</a>
              </div>
            ) : (
              <>
                {ceoApplications.filter(a => a.status === 'new').length > 0 && (
                  <div className="bg-white rounded-lg border border-orange-200">
                    <div className="p-4 border-b bg-orange-50">
                      <h3 className="font-semibold text-[#1E2A4A]">New Founding CEO Applications ({ceoApplications.filter(a => a.status === 'new').length})</h3>
                    </div>
                    <div className="divide-y">
                      {ceoApplications.filter(a => a.status === 'new').map(app => (
                        <div key={app.id} className="p-5">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline flex-wrap gap-2">
                                <p className="font-semibold text-lg text-[#1E2A4A]">{app.name}</p>
                                <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">LinkedIn ↗</a>
                              </div>
                              <p className="text-sm text-gray-600 mt-0.5">{app.phone} · <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a></p>
                              <p className="text-sm text-gray-500 mt-0.5">📍 {app.location.replace(/-/g, ' ')}</p>

                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
                                {app.current_title && app.current_company && (
                                  <span><strong>Role:</strong> {app.current_title} @ {app.current_company}</span>
                                )}
                                <span><strong>Marketplace:</strong> {app.marketplace_background}</span>
                                {app.other_platforms && <span><strong>Also:</strong> {app.other_platforms}</span>}
                                <span><strong>Years:</strong> {app.years_experience}</span>
                                <span><strong>P&amp;L:</strong> {app.pl_experience.replace(/-/g, ' ')}</span>
                                <span><strong>Team led:</strong> {app.team_size}</span>
                              </div>

                              <details className="mt-3">
                                <summary className="text-sm font-semibold text-[#1E2A4A] cursor-pointer hover:text-blue-700">Biggest platform scaled ▸</summary>
                                <p className="mt-2 p-3 bg-purple-50 border-l-4 border-purple-300 text-sm text-gray-700 whitespace-pre-wrap">{app.biggest_scale}</p>
                              </details>

                              <details className="mt-2">
                                <summary className="text-sm font-semibold text-[#1E2A4A] cursor-pointer hover:text-blue-700">Why sweat equity ▸</summary>
                                <p className="mt-2 p-3 bg-purple-50 border-l-4 border-purple-300 text-sm text-gray-700 whitespace-pre-wrap">{app.why_sweat_equity}</p>
                              </details>

                              <details className="mt-2">
                                <summary className="text-sm font-semibold text-[#1E2A4A] cursor-pointer hover:text-blue-700">30 / 60 / 90 plan ▸</summary>
                                <p className="mt-2 p-3 bg-purple-50 border-l-4 border-purple-300 text-sm text-gray-700 whitespace-pre-wrap">{app.plan_30_60_90}</p>
                              </details>

                              {app.anything_else && (
                                <details className="mt-2">
                                  <summary className="text-sm font-semibold text-[#1E2A4A] cursor-pointer hover:text-blue-700">Other notes ▸</summary>
                                  <p className="mt-2 p-3 bg-gray-50 border-l-4 border-gray-300 text-sm text-gray-700 whitespace-pre-wrap">{app.anything_else}</p>
                                </details>
                              )}

                              <div className="flex gap-2 mt-3">
                                {app.video_url && (
                                  <a href={app.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100">
                                    🎥 Watch Video Intro
                                  </a>
                                )}
                                {app.resume_url && (
                                  <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded text-xs hover:bg-green-100">
                                    📄 Resume
                                  </a>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-2">Applied {formatDate(app.created_at)}</p>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleCeoStatus(app.id, 'reviewing')}
                                className="px-3 py-2.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                              >
                                Mark Reviewing
                              </button>
                              <button
                                onClick={() => handleCeoStatus(app.id, 'first_call')}
                                className="px-3 py-2.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 whitespace-nowrap"
                              >
                                First Call Booked
                              </button>
                              <button
                                onClick={() => handleCeoStatus(app.id, 'rejected')}
                                className="px-3 py-2.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 whitespace-nowrap"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ceoApplications.filter(a => a.status !== 'new').length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-[#1E2A4A]">Past / In Process ({ceoApplications.filter(a => a.status !== 'new').length})</h3>
                    </div>
                    <div className="divide-y">
                      {ceoApplications.filter(a => a.status !== 'new').map(app => (
                        <div key={app.id} className="p-4 flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#1E2A4A]">{app.name} · <span className="text-sm text-gray-500 font-normal">{app.marketplace_background}</span></p>
                            <p className="text-sm text-gray-500">{app.phone} · {app.email}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {app.video_url && (
                              <a href={app.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline">🎥 Video</a>
                            )}
                            {app.resume_url && (
                              <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs hover:underline">📄 Resume</a>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                              app.status === 'rejected' || app.status === 'withdrawn' ? 'bg-red-100 text-red-700' :
                              app.status === 'hired' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : activeTab === 'team' ? (
          stylists.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No team members yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {stylists.map((c) => (
                <div
                  key={c.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, c.id)}
                  onDragOver={(e) => handleDragOver(e, c.id)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, c.id)}
                  className={`bg-white rounded-xl border border-gray-200 p-5 cursor-move transition-all hover:shadow-md hover:border-gray-300 ${
                    draggedId === c.id ? 'opacity-50 scale-95' : ''
                  } ${dragOverId === c.id ? 'border-[#A8F0DC] bg-[#A8F0DC]/5 shadow-md' : ''} ${!c.active ? 'opacity-60' : ''}`}
                >
                  {/* Card Header: Avatar + Name + Status */}
                  <div className="flex items-start gap-3 mb-4">
                    {c.photo_url ? (
                      <img
                        src={c.photo_url}
                        alt={c.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#1E2A4A] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">{getInitials(c.name)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1E2A4A] text-sm truncate">{c.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-block w-2 h-2 rounded-full ${c.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className={`text-xs ${c.active ? 'text-green-700' : 'text-gray-500'}`}>
                          {c.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    {/* Drag handle */}
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Phone</p>
                      <p className="text-xs text-[#1E2A4A] font-medium mt-0.5">{c.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Rate</p>
                      <p className="text-xs text-[#1E2A4A] font-medium mt-0.5">${(c.hourly_rate || 25).toFixed(2)}/hr</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">PIN</p>
                      <p className="text-xs text-[#1E2A4A] font-mono mt-0.5">{c.pin || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Days</p>
                      <p className="text-xs text-[#1E2A4A] font-medium mt-0.5">
                        {getScheduleDays(c).length > 0 ? `${getScheduleDays(c).length} days/wk` : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Schedule Bar */}
                  <div className="flex gap-0.5 mb-4">
                    {DAYS.map(day => {
                      const isActive = getScheduleDays(c).includes(day)
                      return (
                        <div
                          key={day}
                          className={`flex-1 text-center py-1 rounded text-xs font-medium ${
                            isActive ? 'bg-[#1E2A4A] text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                          title={isActive && c.schedule?.[day] ? `${c.schedule[day]!.start} - ${c.schedule[day]!.end}` : undefined}
                        >
                          {day.charAt(0)}
                        </div>
                      )
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => handleEdit(c)}
                      className="flex-1 px-3 py-2.5 text-xs font-medium text-[#1E2A4A] bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-2.5 text-xs font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4">
            {pendingApps.length === 0 && applications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No applications yet. Share the apply link: <a href="https://www.thenycmobilesalon.com/apply" className="text-[#1E2A4A]">thenycmobilesalon.com/apply</a>
              </div>
            ) : (
              <>
                {pendingApps.length > 0 && (
                  <div className="bg-white rounded-lg border border-orange-200">
                    <div className="p-4 border-b bg-orange-50">
                      <h3 className="font-semibold text-[#1E2A4A]">Pending Applications ({pendingApps.length})</h3>
                    </div>
                    <div className="divide-y">
                      {pendingApps.map(app => (
                        <div key={app.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              { false ? (
                                <img src="" alt={app.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-lg">
                                  👤
                                </div>
                              )}
                            <div>
                              <p className="font-semibold text-[#1E2A4A]">{app.name}</p>
                              {app.specialty && <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{app.specialty}</span>}
                              <p className="text-sm text-gray-600 mt-1">{app.phone} · {app.email || 'No email'}</p>
                              {app.borough && <p className="text-sm text-gray-500">📍 {app.borough}</p>}
                              {app.instagram && <p className="text-sm text-purple-600">@{app.instagram}</p>}
                              <p className="text-sm text-gray-500 mt-1">
                                {app.experience && <span className="mr-3">Experience: {app.experience}</span>}
                                {app.availability && <span>Availability: {app.availability}</span>}
                              </p>
                              {app.message && <p className="text-sm text-gray-500 mt-1 italic">&quot;{app.message}&quot;</p>}
                              <div className="flex gap-2 mt-1">
                                {app.resume_url && <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">Resume</a>}
                                {app.video_url && <a href={app.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-600 underline">Video</a>}
                              </div>
                              <p className="text-xs text-gray-400 mt-2">Applied {formatDate(app.created_at)}</p>
                            </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveApplication(app)}
                                className="px-3 py-2.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                Approve & Add
                              </button>
                              <button
                                onClick={() => handleRejectApplication(app.id)}
                                className="px-3 py-2.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => { if (confirm('Delete this application?')) handleDeleteApplication(app.id) }}
                                className="px-3 py-2.5 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {applications.filter(a => a.status !== 'new' && a.status !== 'pending').length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-[#1E2A4A]">Past Applications</h3>
                    </div>
                    <div className="divide-y">
                      {applications.filter(a => a.status !== 'new' && a.status !== 'pending').map(app => (
                        <div key={app.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[#1E2A4A]">{app.name}</p>
                            <div className="flex gap-2 items-center">
                              {app.specialty && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{app.specialty}</span>}
                              <p className="text-sm text-gray-500">{app.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {app.status}
                            </span>
                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              className="text-gray-400 hover:text-red-600 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </main>

      {showModal && (
        <SidePanel open={showModal} onClose={() => { setShowModal(false); setEditingId(null) }} title={`${editingId ? 'Edit' : 'Add'} Team Member`} width="max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] focus:ring-2 focus:ring-[#1E2A4A] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] focus:ring-2 focus:ring-[#1E2A4A] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="2125551234"
                  required
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] focus:ring-2 focus:ring-[#1E2A4A] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Address</label>
                <AddressAutocomplete
                  value={form.address}
                  onChange={(val) => setForm({ ...form, address: val })}
                  placeholder="123 Main St, Brooklyn, NY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] focus:ring-2 focus:ring-[#1E2A4A] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Unit / Apt</label>
                <input
                  type="text"
                  placeholder="Apt 4B"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] focus:ring-2 focus:ring-[#1E2A4A] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Photo</label>
                <div className="flex items-center gap-3">
                  {form.photo_url ? (
                    <img src={form.photo_url} alt="Photo" className="w-16 h-16 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-xl">
                      👤
                    </div>
                  )}
                  <div>
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-[#1E2A4A] hover:bg-gray-50 disabled:opacity-50"
                    >
                      {uploadingPhoto ? 'Uploading...' : form.photo_url ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handlePhotoUpload(file, editingId || undefined)
                        e.target.value = ''
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1E2A4A] mb-1">PIN</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="6-digit PIN"
                      value={form.pin}
                      onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] font-mono text-center tracking-widest"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, pin: generatePin() })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                      title="Generate new PIN"
                    >
                      🔄
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For team portal login</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Hourly Rate</label>
                  <div className="flex items-center">
                    <span className="text-[#1E2A4A] text-lg mr-1">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="99.99"
                      value={form.hourly_rate}
                      onChange={(e) => setForm({ ...form, hourly_rate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] text-center font-mono"
                      placeholder="25.00"
                    />
                    <span className="text-[#1E2A4A] ml-1">/hr</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Pay rate per hour worked</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Max Jobs/Day</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.max_jobs_per_day || ''}
                    onChange={(e) => setForm({ ...form, max_jobs_per_day: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A]"
                    placeholder="Unlimited"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank for unlimited</p>
                </div>
              </div>

              {/* Car + Home By */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={form.has_car} onChange={(e) => setForm({ ...form, has_car: e.target.checked })} className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-[#1E2A4A]">Drives</span>
                </label>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Home by</label>
                  <input type="time" value={form.home_by_time} onChange={(e) => setForm({ ...form, home_by_time: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-[#1E2A4A]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-2">Schedule</label>
                <p className="text-xs text-gray-500 mb-3">Select working days, then set hours</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        form.working_days.includes(day)
                          ? 'bg-[#1E2A4A] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {form.working_days.length > 0 && (
                  <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                    {DAYS.filter(d => form.working_days.includes(d)).map(day => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="w-10 text-sm font-medium text-[#1E2A4A]">{day}</span>
                        <select
                          value={form.schedule[day]?.start || '9:00 AM'}
                          onChange={(e) => updateSchedule(day, 'start', e.target.value)}
                          className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm text-[#1E2A4A] bg-white"
                        >
                          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <span className="text-gray-400">to</span>
                        <select
                          value={form.schedule[day]?.end || '5:00 PM'}
                          onChange={(e) => updateSchedule(day, 'end', e.target.value)}
                          className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm text-[#1E2A4A] bg-white"
                        >
                          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-2">Days Off</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={newDateOff}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewDateOff(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newDateOff) return
                      const today = new Date().toISOString().split('T')[0]
                      if (newDateOff < today) return
                      if (!form.unavailable_dates.includes(newDateOff)) {
                        setForm({ ...form, unavailable_dates: [...form.unavailable_dates, newDateOff].sort() })
                      }
                      setNewDateOff('')
                    }}
                    className="px-4 py-2 bg-gray-100 text-[#1E2A4A] rounded-lg font-medium hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {form.unavailable_dates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.unavailable_dates.map(date => (
                      <span key={date} className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                        {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, unavailable_dates: form.unavailable_dates.filter(d => d !== date) })}
                          className="ml-1 text-red-400 hover:text-red-600 font-bold"
                        >&times;</button>
                      </span>
                    ))}
                  </div>
                )}
                {form.unavailable_dates.length === 0 && (
                  <p className="text-xs text-gray-500">No days off scheduled</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E2A4A] mb-1">Status</label>
                <select
                  value={form.active ? 'active' : 'inactive'}
                  onChange={(e) => setForm({ ...form, active: e.target.value === 'active' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] focus:ring-2 focus:ring-[#1E2A4A] outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingId(null) }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-[#1E2A4A] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1E2A4A] text-white rounded-lg hover:bg-[#1E2A4A]/90"
                >
                  Save
                </button>
              </div>
            </form>
        </SidePanel>
      )}
    </>
  )
}
