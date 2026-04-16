'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#030307] text-zinc-100 overflow-x-hidden">
      {/* Ambient Background */}
      <div className="ambient-bg" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1a1a25]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-lg">EMVY</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => scrollToSection('what-we-do')} className="text-sm text-zinc-400 hover:text-white transition-colors hidden md:block">What We Do</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm text-zinc-400 hover:text-white transition-colors hidden md:block">How It Works</button>
            <button onClick={() => scrollToSection('services')} className="text-sm text-zinc-400 hover:text-white transition-colors hidden md:block">Services</button>
            <a
              href="https://cal.com/jake-emvy/15-min-ai-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-3 px-5"
            >
              <span>Book a Call</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`badge mb-8 inline-flex ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
            <span className="badge-dot" />
            <span>AI-Powered Admin Automation</span>
          </div>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${mounted ? 'animate-slide-up stagger-1' : 'opacity-0'}`}>
            We Fix Your <span className="gradient-text">Admin</span> with AI
          </h1>

          <p className={`text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed ${mounted ? 'animate-slide-up stagger-2' : 'opacity-0'}`}>
            For tradies, clinics, and service businesses — AI that handles your calls, bookings, and follow-ups. No more admin drowning.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${mounted ? 'animate-slide-up stagger-3' : 'opacity-0'}`}>
            <a
              href="https://cal.com/jake-emvy/15-min-ai-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg py-4 px-8 w-full sm:w-auto"
            >
              <span>Book a Free 15-Min Chat</span>
            </a>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-zinc-400 hover:text-white transition-colors py-3 px-6 text-sm flex items-center gap-2"
            >
              See How It Works
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mx-auto" />
          </div>

          <div className="space-y-8">
            <div className="gradient-border p-8 card-hover">
              <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
                You spend hours every week on admin that could run itself: quotes, follow-ups, bookings, phone calls.
              </p>
            </div>

            <div className="gradient-border p-8 card-hover">
              <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
                We find exactly where AI can help your business, build it, and keep it running.
              </p>
            </div>

            <div className="gradient-border p-8 card-hover">
              <p className="text-lg md:text-xl text-zinc-300 leading-relaxed">
                No jargon. No big software packages. Just fixing what&apos;s broken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-[#030307] to-[#050510]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="gradient-border p-8 card-hover text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold gradient-text">01</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Audit</h3>
              <p className="text-zinc-400 leading-relaxed">
                We map your current workflows and identify exactly where AI can save you time and money.
              </p>
            </div>

            {/* Step 02 */}
            <div className="gradient-border p-8 card-hover text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold gradient-text">02</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Build</h3>
              <p className="text-zinc-400 leading-relaxed">
                We build the AI agents and automations — phone answering, booking, follow-ups, admin.
              </p>
            </div>

            {/* Step 03 */}
            <div className="gradient-border p-8 card-hover text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold gradient-text">03</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Support</h3>
              <p className="text-zinc-400 leading-relaxed">
                We monitor, optimize, and add new automation as your business grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Actually Build</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Phone Receptionist */}
            <div className="gradient-border p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Phone Receptionist</h3>
              <p className="text-zinc-400 leading-relaxed">
                Answers calls, qualifies enquiries, books appointments — 24/7 without lifting a finger.
              </p>
            </div>

            {/* Automated Follow-ups */}
            <div className="gradient-border p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Follow-ups</h3>
              <p className="text-zinc-400 leading-relaxed">
                Quote reminders, appointment confirmations, SMS and email — sent automatically.
              </p>
            </div>

            {/* Admin Automation */}
            <div className="gradient-border p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Admin Automation</h3>
              <p className="text-zinc-400 leading-relaxed">
                Data entry, scheduling, internal workflows — the boring stuff done in seconds.
              </p>
            </div>

            {/* AI Voice Agents */}
            <div className="gradient-border p-8 card-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Voice Agents</h3>
              <p className="text-zinc-400 leading-relaxed">
                Phone-based AI that handles enquiries without human intervention — ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Call Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#050510] to-[#030307]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gradient-border p-12 glow">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See If We&apos;re a Fit</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              15 minutes. No pitch. We&apos;ll tell you honestly if AI makes sense for your business.
            </p>
            <a
              href="https://cal.com/jake-emvy/15-min-ai-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg py-4 px-8 inline-block w-full sm:w-auto"
            >
              <span>Book a Free 15-Min Call</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#1a1a25]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-semibold text-lg">EMVY</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-zinc-500">
              <a href="mailto:hello@emvy.ai" className="hover:text-emerald-400 transition-colors">hello@emvy.ai</a>
              <span>&quot;Shut Up and Build&quot;</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
