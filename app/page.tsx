'use client'

import { useState, useEffect } from 'react'

// Availability config
const AVAILABILITY = {
  timezone: 'Australia/Perth',
  days: [1, 2, 3, 4, 5],
  slots: [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  ],
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function isWeekday(day: number, month: number, year: number) {
  const d = new Date(year, month, day)
  return AVAILABILITY.days.includes(d.getDay())
}

function formatDate(day: number, month: number, year: number) {
  const d = new Date(year, month, day)
  return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })
}

function DatePicker({ selectedDate, onSelect }: { selectedDate: number | null; onSelect: (day: number) => void }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [hoveredDate, setHoveredDate] = useState<number | null>(null)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const todayDay = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-AU', {
    month: 'long',
    year: 'numeric',
  })

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isPast = (day: number) => {
    if (viewYear < todayYear) return true
    if (viewYear === todayYear && viewMonth < todayMonth) return true
    if (viewYear === todayYear && viewMonth === todayMonth && day < todayDay) return true
    return false
  }

  return (
    <div className="bg-[#0a0a10] border border-[#1a1a2e] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-[#12121a] border border-[#1a1a2e] text-[#71717a] hover:text-white hover:border-[#252538] transition-all flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-white font-semibold">{monthLabel}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-[#12121a] border border-[#1a1a2e] text-[#71717a] hover:text-white hover:border-[#252538] transition-all flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-xs text-[#52525b] font-medium py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const available = isWeekday(day, viewMonth, viewYear) && !isPast(day)
          const selected = selectedDate === day
          const hovered = hoveredDate === day && available
          return (
            <button
              key={day}
              onClick={() => available && onSelect(day)}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              disabled={!available}
              className={`
                h-10 rounded-xl text-sm font-medium transition-all duration-200
                ${!available ? 'text-[#27272a] cursor-not-allowed' : ''}
                ${selected ? 'bg-gradient-to-br from-[#7c5cff] to-[#6b4ed9] text-white shadow-lg shadow-[#7c5cff]/30' : ''}
                ${hovered && !selected ? 'bg-[#1a1a2e] text-white' : ''}
                ${available && !selected && !hovered ? 'text-[#a1a1aa] hover:text-white' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-5 mt-5 pt-5 border-t border-[#1a1a2e]">
        <span className="flex items-center gap-2 text-xs text-[#71717a]">
          <span className="w-3 h-3 rounded bg-gradient-to-br from-[#7c5cff] to-[#6b4ed9]" /> Selected
        </span>
        <span className="flex items-center gap-2 text-xs text-[#71717a]">
          <span className="w-3 h-3 rounded bg-[#1a1a2e]" /> Available
        </span>
      </div>
    </div>
  )
}

export default function BookingPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', goal: '' })
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleDateSelect = (day: number) => {
    setSelectedDate(day)
    setSelectedSlot(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) {
      setMessage('Please select a date and time slot.')
      setStatus('error')
      return
    }

    setStatus('loading')

    const bookingData = {
      ...form,
      date: formatDate(selectedDate, selectedMonth, selectedYear),
      time: selectedSlot,
      timezone: AVAILABILITY.timezone,
      submittedAt: new Date().toISOString(),
    }

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      if (!res.ok) throw new Error('Failed to submit')
      setStatus('success')
      setMessage(`You're booked for ${bookingData.date} at ${selectedSlot} AWST. Check your email for confirmation.`)
      setForm({ name: '', email: '', company: '', goal: '' })
      setSelectedDate(null)
      setSelectedSlot(null)
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Email us directly at hello@emvy.ai')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const testimonials = [
    { name: 'Marcus Chen', role: 'Director', company: 'Perth Legal Partners', quote: "The discovery call alone was worth it — we identified three automation opportunities we'd been ignoring for months." },
    { name: 'Sarah O\'Brien', role: 'Practice Manager', company: 'Mount Lawley Physio', quote: "EMVY's team understood healthcare compliance constraints that previous agencies completely missed. That's rare." },
    { name: 'James Kumar', role: 'Founder', company: 'Kumar Accounting', quote: "Booked the call expecting a pitch. Got a genuine audit of our workflows. Walked away with actionable steps same day." },
  ]

  const stats = [
    { value: '$1.5K', label: 'Audit Investment' },
    { value: '48hr', label: 'Delivery' },
    { value: '94%', label: 'Client Retention' },
  ]

  return (
    <div className="min-h-screen relative">
      {/* Ambient background */}
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="grid-pattern" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-[#1a1a2e]/50 py-5 px-6 backdrop-blur-sm bg-[#030307]/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#6b4ed9] flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">EMVY</span>
                <span className="hidden sm:inline text-xs text-[#71717a] ml-2">AI Audit Agency</span>
              </div>
            </div>
            <a href="mailto:hello@emvy.ai" className="text-sm text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="hidden sm:inline">hello@emvy.ai</span>
            </a>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
          {/* Hero */}
          <div className={`text-center mb-20 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c5cff]/10 border border-[#7c5cff]/20 text-[#a78bfa] text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-[#7c5cff] animate-pulse" />
              Free · 15 Minutes · No Commitment
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Book Your Free
              <br />
              <span className="gradient-text">AI Discovery Call</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-relaxed">
              See exactly where AI can transform your business. We diagnose the gaps, reveal the quick wins, and show you exactly what an EMVY audit covers.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#71717a]">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                No sales pitch
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Actionable insights
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Perth-based team
              </span>
            </div>
          </div>

          {/* Stats bar */}
          <div className={`grid grid-cols-3 gap-4 max-w-xl mx-auto mb-20 ${mounted ? 'animate-slide-up stagger-1' : 'opacity-0'}`}>
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a2e] backdrop-blur-sm">
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-[#71717a]">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* What to expect */}
          <div className={`mb-20 ${mounted ? 'animate-slide-up stagger-2' : 'opacity-0'}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">What Happens on the Call</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { num: '01', title: 'Map Your AI Gaps', desc: "We'll identify where AI can eliminate bottlenecks in your business right now." },
                { num: '02', title: 'Quick Wins', desc: 'Leave the call with at least 1 actionable AI strategy you can implement immediately.' },
                { num: '03', title: 'Audit Breakdown', desc: "Understand exactly what a $1,500 EMVY audit covers — and what it doesn't." },
                { num: '04', title: 'Honest Assessment', desc: "If we're not a fit, we'll tell you and point you somewhere useful." },
              ].map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a2e] backdrop-blur-sm card-hover">
                  <div className="text-4xl font-bold text-[#1a1a2e] group-hover:text-[#7c5cff]/20 transition-colors mb-4">{item.num}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#71717a] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className={`mb-20 ${mounted ? 'animate-slide-up stagger-3' : 'opacity-0'}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">What Clients Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a2e] backdrop-blur-sm card-hover">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-[#d4d4d8] mb-4 leading-relaxed">"{t.quote}"</p>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-[#71717a] text-xs">{t.role}, {t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form Section */}
          <div className={`${mounted ? 'animate-slide-up stagger-4' : 'opacity-0'}`} id="book">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Discover Your AI Opportunities?</h2>
              <p className="text-[#a1a1aa]">Fill in your details and pick a time that works for you.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="gradient-border p-8 md:p-10 glow">
                {status === 'success' ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">You're Booked!</h2>
                    <p className="text-[#a1a1aa] text-lg mb-6">{message}</p>
                    <button onClick={() => setStatus('idle')} className="text-[#7c5cff] hover:text-[#9d85ff] transition-colors text-sm">
                      ← Book another call
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Your Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} required placeholder="Sarah Mitchell" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Email Address *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="sarah@company.com.au" className="input-field" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Company Name</label>
                      <input name="company" value={form.company} onChange={handleChange} placeholder="Acme PTY LTD" className="input-field" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#a1a1aa] mb-2">What are you hoping to achieve with AI? *</label>
                      <textarea name="goal" value={form.goal} onChange={handleChange} required rows={3} placeholder="e.g. Automate customer support, reduce manual data entry, build an AI agent for bookings..." className="input-field resize-none" />
                    </div>

                    {/* Scheduler */}
                    <div>
                      <label className="block text-sm font-medium text-[#a1a1aa] mb-4">Select a Date & Time *</label>
                      <div className="grid md:grid-cols-2 gap-6">
                        <DatePicker selectedDate={selectedDate} onSelect={handleDateSelect} />
                        <div>
                          {selectedDate ? (
                            <div className="bg-[#0a0a10] border border-[#1a1a2e] rounded-2xl p-6 h-full">
                              <p className="text-white font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#7c5cff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {formatDate(selectedDate, selectedMonth, selectedYear)}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {AVAILABILITY.slots.map(slot => (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`
                                      py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200
                                      ${selectedSlot === slot
                                        ? 'bg-gradient-to-br from-[#7c5cff] to-[#6b4ed9] text-white shadow-lg shadow-[#7c5cff]/30'
                                        : 'bg-[#12121a] border border-[#1a1a2e] text-[#a1a1aa] hover:text-white hover:border-[#252538]'}
                                    `}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                              {selectedSlot && (
                                <div className="mt-4 p-3 rounded-xl bg-[#7c5cff]/10 border border-[#7c5cff]/20">
                                  <p className="text-[#a78bfa] text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {selectedSlot} AWST selected
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-[#0a0a10] border border-[#1a1a2e] rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
                              <svg className="w-12 h-12 text-[#27272a] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              <p className="text-[#52525b] text-sm">Select a date to see<br />available times</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {status === 'error' && message && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{message}</div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading' || !selectedDate || !selectedSlot}
                      className="btn-primary w-full text-lg"
                    >
                      <span>{status === 'loading' ? 'Booking...' : 'Book My Free Discovery Call'}</span>
                    </button>

                    <p className="text-center text-[#71717a] text-sm">
                      By booking, you agree to receive one email confirmation. No spam, ever.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Alternative contact */}
          <div className={`text-center mt-12 ${mounted ? 'animate-slide-up stagger-5' : 'opacity-0'}`}>
            <p className="text-[#71717a]">
              Prefer to email directly?{' '}
              <a href="mailto:hello@emvy.ai" className="text-[#a78bfa] hover:text-white transition-colors font-medium">
                hello@emvy.ai
              </a>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1a1a2e]/50 py-10 px-6 backdrop-blur-sm bg-[#030307]/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#6b4ed9] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-white font-semibold">EMVY</span>
                <span className="text-[#52525b]">— AI Audit Agency</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#71717a]">
                <a href="mailto:hello@emvy.ai" className="hover:text-white transition-colors">hello@emvy.ai</a>
                <span className="text-[#27272a]">|</span>
                <span>Perth, Australia</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#1a1a2e]/50 text-center text-xs text-[#52525b]">
              © {new Date().getFullYear()} EMVY. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
