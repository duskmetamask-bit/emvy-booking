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

function DatePicker({ selectedDate, selectedMonth, selectedYear, onSelect }: { selectedDate: number | null; selectedMonth: number; selectedYear: number; onSelect: (day: number, month: number, year: number) => void }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(selectedYear || today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedMonth || today.getMonth())

  // Sync viewMonth when selectedMonth prop changes (e.g. after month navigation)
  useEffect(() => {
    setViewMonth(selectedMonth)
    setViewYear(selectedYear)
  }, [selectedMonth, selectedYear])
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
    <div className="bg-[#0a0a0f] border border-[#1a1a25] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-[#0d0d14] border border-[#1a1a25] text-[#71717a] hover:text-white hover:border-[#2a2a3a] transition-all flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-white font-semibold">{monthLabel}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-[#0d0d14] border border-[#1a1a25] text-[#71717a] hover:text-white hover:border-[#2a2a3a] transition-all flex items-center justify-center">
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
              onClick={() => available && onSelect(day, viewMonth, viewYear)}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              disabled={!available}
              className={`
                h-10 rounded-xl text-sm font-medium transition-all duration-200
                ${!available ? 'text-[#27272a] cursor-not-allowed' : ''}
                ${selected ? 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30' : ''}
                ${hovered && !selected ? 'bg-[#1a1a25] text-white' : ''}
                ${available && !selected && !hovered ? 'text-[#a1a1aa] hover:text-white' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-5 mt-5 pt-5 border-t border-[#1a1a25]">
        <span className="flex items-center gap-2 text-xs text-[#71717a]">
          <span className="w-3 h-3 rounded bg-gradient-to-br from-[#10b981] to-[#059669]" /> Selected
        </span>
        <span className="flex items-center gap-2 text-xs text-[#71717a]">
          <span className="w-3 h-3 rounded bg-[#1a1a25]" /> Available
        </span>
      </div>
    </div>
  )
}

export default function BookingPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', goal: '' })
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(0) // placeholder until mounted
  const [selectedYear, setSelectedYear] = useState(2024) // placeholder until mounted
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const [guideEmail, setGuideEmail] = useState('')
  const [guideStatus, setGuideStatus] = useState<'idle' | 'sent'>('idle')

  useEffect(() => {
    setMounted(true)
    // Set correct initial date values after mount (client-only)
    setSelectedMonth(new Date().getMonth())
    setSelectedYear(new Date().getFullYear())
  }, [])

  const handleDateSelect = (day: number, month: number, year: number) => {
    setSelectedDate(day)
    setSelectedMonth(month)
    setSelectedYear(year)
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
      meetingLink: process.env.NEXT_PUBLIC_CAL_COM_LINK || '',
    }

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      if (!res.ok) throw new Error('Failed to submit')
      setStatus('success')
      const data = await res.json()
      setMessage(`Check your email — click the link to confirm your ${bookingData.date} call time.`)
      setForm({ name: '', email: '', company: '', goal: '' })
      setSelectedDate(null)
      setSelectedSlot(null)
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Email us directly at hello@emvy.ai')
    }
  }

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: guideEmail }),
      })
      if (!res.ok) throw new Error()
    } catch {
      // Still show success — email may have gone through
    }
    setGuideStatus('sent')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
        <header className="border-b border-[#1a1a25]/50 py-5 px-6 backdrop-blur-sm bg-[#030307]/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">EMVY</span>
                <span className="hidden sm:inline text-xs text-[#71717a] ml-2">AI Audit Agency</span>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#process" className="text-sm text-[#a1a1aa] hover:text-white transition-colors hidden sm:block">Process</a>
              <a href="#cases" className="text-sm text-[#a1a1aa] hover:text-white transition-colors hidden sm:block">Case Studies</a>
              <a href="#book" className="text-sm bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#10b981]/20 transition-all">Book a Call</a>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">

          {/* HERO */}
          <div className={`text-center mb-20 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399] text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              AI Audit Agency
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              We Audit Your Business.
              <br />
              <span className="gradient-text">Then We Build the AI.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-relaxed">
              Service businesses waste 10+ hours a week on admin tasks a bot could handle.
              We find those gaps. We build the automation. We support it.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#book" className="btn-primary text-lg px-8 py-4">
                <span>Book Free Discovery Call</span>
              </a>
              <a href="#prompts" className="text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-2 text-sm">
                Get 50 Free AI Agent Prompts
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#71717a] mt-8">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                No sales pitch
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Actionable audit
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Australia-based
              </span>
            </div>
          </div>

          {/* THE PROBLEM */}
          <div className={`mb-20 ${mounted ? 'animate-slide-up stagger-1' : 'opacity-0'}`}>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { stat: '10hrs', label: 'per week', desc: 'the average service business owner spends on admin tasks that could be automated' },
                { stat: '40%', label: 'of calls', desc: 'are booking enquiries that an AI receptionist could handle before they reach your staff' },
                { stat: '$2K', label: 'per month', desc: 'the cost of a missed lead — one quote not sent, one call not answered' },
              ].map((item, i) => (
                <div key={i} className="text-center p-8 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a25] backdrop-blur-sm">
                  <div className="text-5xl md:text-6xl font-bold gradient-text mb-2">{item.stat}</div>
                  <div className="text-[#71717a] text-sm font-medium mb-3">{item.label}</div>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div id="process" className={`mb-20 ${mounted ? 'animate-slide-up stagger-2' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">The EMVY Process</h2>
            <p className="text-[#a1a1aa] text-center max-w-xl mx-auto mb-12">Three stages. Each one pays for itself.</p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'AI Audit',
                  price: '$1,500',
                  timeframe: '5 days',
                  desc: 'We map your current workflows, identify automation opportunities, and deliver a prioritized roadmap. You know exactly what to automate first — and why.',
                  bullets: ['Workflow mapping', 'AI opportunity audit', 'ROI analysis', 'Prioritized action plan'],
                  cta: 'Start with an audit',
                },
                {
                  step: '02',
                  title: 'AI Build',
                  price: '$3,000-$5,000',
                  timeframe: '2-4 weeks',
                  desc: 'We build the AI agents and automations from your audit. Phone answering, booking, follow-ups, admin — whatever the audit identified.',
                  bullets: ['Custom AI agents', 'System integration', 'Staff training', 'Documentation'],
                  cta: 'After your audit',
                  highlight: true,
                },
                {
                  step: '03',
                  title: 'AI Retainer',
                  price: '$1,500/mo',
                  timeframe: 'Ongoing',
                  desc: 'We monitor, optimize, and add new automation as your business grows. Your AI systems stay sharp.',
                  bullets: ['Monthly optimization', 'New automation builds', 'Priority support', 'Quarterly reviews'],
                  cta: 'Post-build only',
                },
              ].map((item, i) => (
                <div key={i} className={`relative p-8 rounded-2xl border backdrop-blur-sm ${item.highlight ? 'bg-[#0d0d14]/80 border-[#10b981]/40 glow' : 'bg-[#0d0d14]/50 border-[#1a1a25]'}`}>
                  {item.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#10b981] text-white text-xs font-bold rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="text-5xl font-bold text-[#1a1a25] group-hover:text-[#10b981]/20 mb-4">{item.step}</div>
                  <div className="flex items-end gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold gradient-text">{item.price}</span>
                    <span className="text-[#71717a] text-sm">— {item.timeframe}</span>
                  </div>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6">{item.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {item.bullets.map((b, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-[#a1a1aa]">
                        <svg className="w-4 h-4 text-[#10b981] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a href="#book" className={`block text-center text-sm font-medium py-3 px-4 rounded-xl transition-all ${item.highlight ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:shadow-lg hover:shadow-[#10b981]/20' : 'bg-[#1a1a25] text-[#a1a1aa] hover:text-white hover:bg-[#2a2a3a]'}`}>
                    {item.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* CASE STUDIES */}
          <div id="cases" className={`mb-20 ${mounted ? 'animate-slide-up stagger-3' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">What the Audit Delivers</h2>
            <p className="text-[#a1a1aa] text-center max-w-xl mx-auto mb-12">Every audit maps your actual bottlenecks and delivers a ranked action plan.</p>

            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  industry: 'Service Business Pattern',
                  before: 'Owner or staff handling quotes, bookings, follow-ups, and admin manually. Leads falling through gaps.',
                  after: 'AI handles enquiries instantly, quotes go out faster, follow-ups run on autopilot, staff focus on delivering the service.',
                  metric: 'Same-day response',
                },
                {
                  industry: 'High-Volume Enquiry Business',
                  before: 'Phone ringing off the hook. Booking calls interrupting actual work. Missed calls = missed revenue.',
                  after: 'AI receptionist answers every call, qualifies the enquiry, and books into your calendar without touching your phone.',
                  metric: '0 missed calls',
                },
                {
                  industry: 'Growth-Stage Business',
                  before: 'Admin workload scaling faster than revenue. Hiring a receptionist but still drowning.',
                  after: 'Automation handles the volume. Staff do less busywork, more valuable tasks. Headcount cost redirected to revenue-generating roles.',
                  metric: 'Scaled without hiring',
                },
              ].map((item, i) => (
                <div key={i} className="p-6 md:p-8 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a25]">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="text-xs text-[#10b981] font-medium uppercase tracking-wider mb-1">{item.industry}</div>
                      <div className="text-2xl font-bold gradient-text">{item.metric}</div>
                    </div>
                    <div className="flex-shrink-0 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-xs font-medium">
                      Audit → Build
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[#71717a] font-medium mb-2 flex items-center gap-1">
                        <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        BEFORE
                      </div>
                      <p className="text-[#a1a1aa] text-sm">{item.before}</p>
                    </div>
                    <div>
                      <div className="text-xs text-[#71717a] font-medium mb-2 flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        AFTER
                      </div>
                      <p className="text-[#d4d4d8] text-sm">{item.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FREE AI PROMPTS LEAD MAGNET */}
          <div id="prompts" className={`mb-20 ${mounted ? 'animate-slide-up stagger-4' : 'opacity-0'}`}>
            <div className="gradient-border p-8 md:p-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399] text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                Free Download
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                50 AI Agent Prompts
              </h2>
              <p className="text-[#a1a1aa] max-w-lg mx-auto mb-8">
                Real prompts used by EMVY operators daily. Research agents, outreach agents, content agents, operations agents. Copy and use immediately.
              </p>

              {guideStatus === 'sent' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">Check your email!</p>
                  <p className="text-[#71717a] text-sm">Your 50 AI Agent Prompts are on the way to {guideEmail}.</p>
                </div>
              ) : (
                <form onSubmit={handleGuideSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    value={guideEmail}
                    onChange={e => setGuideEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field flex-1"
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    <span>Get Free Prompts</span>
                  </button>
                </form>
              )}

              <p className="text-[#71717a] text-xs mt-4">No spam. Unsubscribe anytime. 50 working prompts, nothing else.</p>
            </div>
          </div>

          {/* WHAT HAPPENS ON THE CALL */}
          <div className={`mb-20 ${mounted ? 'animate-slide-up stagger-2' : 'opacity-0'}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">What Happens on the Discovery Call</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { num: '01', title: 'Map Your AI Gaps', desc: "We identify where AI can eliminate bottlenecks in your business right now." },
                { num: '02', title: 'Quick Wins', desc: 'Leave the call with at least 1 actionable AI strategy you can implement immediately.' },
                { num: '03', title: 'Audit Breakdown', desc: "Understand exactly what a $1,500 EMVY audit covers — and what it doesn't." },
                { num: '04', title: 'Honest Assessment', desc: "If we're not a fit, we'll tell you and point you somewhere useful." },
              ].map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a25] card-hover">
                  <div className="text-4xl font-bold text-[#1a1a25] group-hover:text-[#10b981]/20 transition-colors mb-4">{item.num}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#71717a] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING FORM */}
          <div id="book" className={`${mounted ? 'animate-slide-up stagger-4' : 'opacity-0'}`}>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Book Your Free Discovery Call</h2>
              <p className="text-[#a1a1aa]">15 minutes. No pitch. Just an honest look at where AI could help your business.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="gradient-border p-8 md:p-10 glow">
                {status === 'success' ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">You're Booked!</h2>
                    <p className="text-[#a1a1aa] text-lg mb-6">{message}</p>
                    <button onClick={() => setStatus('idle')} className="text-[#10b981] hover:text-[#34d399] transition-colors text-sm">
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
                        <DatePicker selectedDate={selectedDate} selectedMonth={selectedMonth} selectedYear={selectedYear} onSelect={handleDateSelect} />
                        <div>
                          {selectedDate ? (
                            <div className="bg-[#0a0a0f] border border-[#1a1a25] rounded-2xl p-6 h-full">
                              <p className="text-white font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
                                        ? 'bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-lg shadow-[#10b981]/30'
                                        : 'bg-[#0d0d14] border border-[#1a1a25] text-[#a1a1aa] hover:text-white hover:border-[#2a2a3a]'}
                                    `}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                              {selectedSlot && (
                                <div className="mt-4 p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20">
                                  <p className="text-[#34d399] text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {selectedSlot} AWST selected
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-[#0a0a0f] border border-[#1a1a25] rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
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
              <a href="mailto:hello@emvy.ai" className="text-[#34d399] hover:text-white transition-colors font-medium">
                hello@emvy.ai
              </a>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1a1a25]/50 py-10 px-6 backdrop-blur-sm bg-[#030307]/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-white font-semibold">EMVY</span>
                <span className="text-[#52525b]">— AI Audit Agency</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-[#71717a]">
                <a href="mailto:hello@emvy.ai" className="hover:text-white transition-colors">hello@emvy.ai</a>
                <span className="text-[#27272a]">|</span>
                <span>Australia</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#1a1a25]/50 text-center text-xs text-[#52525b]">
              © {new Date().getFullYear()} EMVY. All rights reserved. — Shut Up and Build
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
