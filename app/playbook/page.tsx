'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PlaybookPage() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const existing = JSON.parse(localStorage.getItem('playbook_signups') || '[]')
      existing.push({ email, date: new Date().toISOString() })
      localStorage.setItem('playbook_signups', JSON.stringify(existing))
    } catch {}
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
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
              <Link href="/" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">Back to Home</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399] text-sm font-medium mb-8">
              Free Download
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              The <span className="gradient-text">AI Agent Playbook</span>
            </h1>
            <p className="text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-4 leading-relaxed">
              A complete, practical guide to setting up your own AI agent system. Setup instructions, working cron job examples, copy-paste templates, and step-by-step walkthroughs.
            </p>
            <p className="text-green-400 font-medium">
              1,000+ lines. Free forever. No credit card required.
            </p>
          </div>

          {/* What's Inside */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { num: 'Part 1', title: 'Setup Guide', desc: 'Vault structure, Telegram connection, and the three parts every AI agent system needs.' },
                { num: 'Part 2', title: 'Cron Jobs & Automation', desc: '5 working cron job examples with full prompts. Morning briefings, evening reviews, weekly recaps.' },
                { num: 'Part 3', title: 'Step-by-Step Walkthroughs', desc: 'Build your first automation in 20 minutes. Lead research in 30. Content pipeline in an hour.' },
                { num: 'Part 4', title: 'File Templates', desc: '5 copy-paste templates: Profile, Project Brief, Weekly Review, ICP, and Content Calendar.' },
              ].map((card) => (
                <div key={card.num} className="p-6 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a25] text-left">
                  <div className="text-xs font-bold text-[#10b981] uppercase tracking-widest mb-2">{card.num}</div>
                  <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
              <div className="p-6 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a25] text-left sm:col-span-2">
                <div className="text-xs font-bold text-[#10b981] uppercase tracking-widest mb-2">Part 5</div>
                <h3 className="text-white font-semibold mb-2">Quick Reference</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">Cron syntax cheat sheet, delivery destinations, most-used OpenClaw commands, and troubleshooting for 5 common problems.</p>
              </div>
            </div>
          </div>

          <hr className="border-[#1a1a25] mb-16 max-w-3xl mx-auto" />

          {/* How It Works */}
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">How to Use This Playbook</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { icon: '📄', title: 'Pick a Guide', desc: 'Start with the 20-minute setup guide or jump to whatever you need.' },
                { icon: '📋', title: 'Copy the Prompts', desc: 'Every cron job and template is ready to copy and paste. No editing needed.' },
                { icon: '🚀', title: 'Run It', desc: 'Set up your agent once. It runs on autopilot from there.' },
              ].map((step) => (
                <div key={step.title} className="text-center">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                  <p className="text-[#71717a] text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Email Capture */}
          <div className="max-w-md mx-auto">
            <div className="gradient-border p-8 md:p-10 text-center">
              {!submitted ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">Get Free Access</h2>
                  <p className="text-[#a1a1aa] text-sm mb-8">Enter your email. We'll show you the link. That's it.</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourbusiness.com"
                      required
                      className="input-field w-full text-left"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full"
                    >
                      {loading ? 'Getting your link...' : 'Get the Playbook'}
                    </button>
                  </form>
                  <p className="text-[#52525b] text-xs">No spam. No BS. You're in, you're out.</p>
                </>
              ) : (
                <div className="py-4">
                  <div className="w-16 h-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-2">You're In</h3>
                  <p className="text-[#a1a1aa] text-sm mb-6">Here's your playbook. Bookmark it — you'll keep coming back.</p>
                  <a
                    href="https://ai-agent-playbook-teal.vercel.app/playbook/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#10b981] hover:bg-[#059669] text-white font-bold text-base py-3.5 px-8 rounded-xl transition-all hover:-translate-y-0.5"
                  >
                    Open the AI Agent Playbook →
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Social Proof */}
          <div className="max-w-2xl mx-auto mt-16 space-y-4">
            <div className="p-6 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a25]">
              <p className="text-[#d4d4d8] text-sm leading-relaxed mb-3">
                "I had an AI agent running my morning briefings within 20 minutes of downloading this. The setup guide actually works — most stuff online doesn't."
              </p>
              <p className="text-[#52525b] text-xs">— S. Chen, Perth tradie, 3 employees</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#0d0d14]/50 border border-[#1a1a25]">
              <p className="text-[#d4d4d8] text-sm leading-relaxed mb-3">
                "Finally something practical. Not another 10,000-word guide about 'AI is the future.' Just the actual steps to get it running."
              </p>
              <p className="text-[#52525b] text-xs">— R. Patel, Hobart accountant, solo practice</p>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="border-t border-[#1a1a25]/50 py-8 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-xs font-bold text-[#10b981] tracking-widest uppercase mb-2">EMVY</div>
            <p className="text-[#52525b] text-xs">AI automation for small businesses.</p>
          </div>
        </footer>
      </div>

      <style>{`
        .input-field {
          background: rgba(13, 13, 20, 0.8);
          border: 1px solid #1a1a25;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 16px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .input-field::placeholder { color: #71717a; }
        .input-field:focus { border-color: #10b981; }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
          text-decoration: none;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .gradient-border {
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 24px;
          background: rgba(13, 13, 20, 0.6);
          backdrop-filter: blur(12px);
        }
        .ambient-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }
        .ambient-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%);
          top: -200px; right: -100px;
        }
        .ambient-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%);
          bottom: -100px; left: -100px;
        }
        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  )
}
