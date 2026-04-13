'use client'

import { useState } from 'react'

export default function BookingPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    goal: '',
    preferredTime: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setStatus('success')
      setMessage("You're booked. We'll be in touch within 24 hours to confirm your time.")
      setForm({ name: '', email: '', company: '', goal: '', preferredTime: '' })
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try emailing us directly at hello@emvy.ai')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#1e1e2e] py-5 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-white tracking-tight">EMVY</span>
            <span className="text-xs text-[#71717a] ml-2">AI Audit Agency</span>
          </div>
          <a href="https://ai-agent-playbook-landing.vercel.app" className="text-sm text-[#6c63ff] hover:text-[#5a52d5] transition-colors">
            Back to Playbook
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-[#6c63ff]/10 text-[#6c63ff] text-xs font-semibold mb-4">
            FREE · 15-20 MINUTES · NO SALES PRESSURE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Book Your Free<br />
            <span className="text-[#6c63ff]">AI Discovery Call</span>
          </h1>
          <p className="text-[#71717a] text-lg max-w-xl mx-auto">
            See exactly where AI can transform your business. We diagnose the gaps, show you the quick wins, and outline what an EMVY audit actually covers.
          </p>
        </div>

        {/* What to expect */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {[
            {
              icon: '🔍',
              title: 'Diagnose Your AI Gaps',
              desc: "We'll map out where AI could eliminate bottlenecks in your business right now."
            },
            {
              icon: '🚀',
              title: 'Quick Wins You Can Use Today',
              desc: 'Leave the call with at least 1 actionable AI strategy you can implement immediately.'
            },
            {
              icon: '📋',
              title: 'See the Full Audit Scope',
              desc: "Understand exactly what a $1,500 EMVY audit covers — and what it doesn't."
            },
            {
              icon: '🎯',
              title: 'No Commitment',
              desc: "This isn't a sales call. If we're not a fit, we'll tell you and point you somewhere useful."
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="text-white font-semibold mb-1">{item.title}</h3>
              <p className="text-[#71717a] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-white mb-2">You're on the list</h2>
              <p className="text-[#71717a]">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#71717a] mb-2">Your Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Sarah Mitchell"
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#6c63ff] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#71717a] mb-2">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="sarah@company.com"
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#6c63ff] transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-[#71717a] mb-2">Company Name</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Acme PTY LTD"
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#6c63ff] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#71717a] mb-2">Preferred Time</label>
                  <select
                    name="preferredTime"
                    value={form.preferredTime}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#6c63ff] transition-colors"
                  >
                    <option value="">Select a time</option>
                    <option value="morning-awst">Morning (AWST — Perth)</option>
                    <option value="midday-awst">Midday (AWST — Perth)</option>
                    <option value="afternoon-awst">Afternoon (AWST — Perth)</option>
                    <option value="flexible">Flexible / Any time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#71717a] mb-2">
                  What are you hoping to achieve with AI? *
                </label>
                <textarea
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="e.g. Automate our customer support, reduce manual data entry, build an AI agent to handle bookings..."
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#6c63ff] transition-colors resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="text-red-400 text-sm">{message}</div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#6c63ff] hover:bg-[#5a52d5] disabled:opacity-50 text-white font-semibold py-4 rounded-lg transition-colors"
              >
                {status === 'loading' ? 'Booking...' : 'Book My Free Discovery Call →'}
              </button>
            </form>
          )}
        </div>

        {/* Alternative */}
        <div className="text-center mt-8">
          <p className="text-[#71717a] text-sm">
            Or just email us directly:{' '}
            <a href="mailto:hello@emvy.ai" className="text-[#6c63ff] hover:underline">
              hello@emvy.ai
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-8 px-6 mt-16">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#71717a] text-sm">
            <span className="font-bold text-white">EMVY</span> — AI Audit Agency
          </div>
          <div className="text-[#3f3f46] text-xs">
            Shut Up and Build
          </div>
        </div>
      </footer>
    </div>
  )
}
