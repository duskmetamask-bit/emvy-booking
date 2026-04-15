'use client'

import { useState } from 'react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const TRADIES = [
  { n: 1,  name: "Westline Electrical Services",   suburb: "Perth Metro", type: "Electrical",  signal: "24/7 emergency, multi-award winning",         website: "www.electricianinperth.com.au" },
  { n: 2,  name: "Acme Electrical & Communication", suburb: "Dianella",    type: "Electrical",  signal: "24/7 emergency, same-day service, free quotes", website: "acmeelectricalwa.com.au" },
  { n: 3,  name: "Metro Electrical Perth",          suburb: "Perth Metro", type: "Electrical",  signal: "24/7 emergency, budget-friendly",             website: "metro-electrical.com.au" },
  { n: 4,  name: "Sarros Electrical",               suburb: "Perth Metro", type: "Electrical",  signal: "Lifetime workmanship guarantee",               website: "www.sarroselectrical.com.au" },
  { n: 5,  name: "Brillare Electrical",              suburb: "Perth Metro", type: "Electrical",  signal: "24/7 emergency, same-day service",            website: "www.brillare.net.au" },
  { n: 6,  name: "Perth Local Plumbing",             suburb: "Perth Metro", type: "Plumbing",    signal: "24/7 emergency, same-day service",            website: "www.perthlocalplumbing.com.au" },
  { n: 7,  name: "Metropolitan Plumbing",            suburb: "Perth Metro", type: "Plumbing",    signal: "No call-out fee, lifetime warranty",          website: "www.skilledtradies.com.au/plumbers/wa/perth/" },
  { n: 8,  name: "The Plumbing and Gas Guys",        suburb: "Balcatta",    type: "Plumbing",    signal: "24/7 emergency",                             website: "1800 087 244" },
  { n: 9,  name: "Plumbers R Us WA",                 suburb: "Perth Metro", type: "Plumbing",    signal: "20+ years, family owned",                     website: "plumbersruswa.com.au" },
  { n: 10, name: "GXR Plumbing",                     suburb: "Perth Metro", type: "Plumbing",    signal: "Free quotes, no call-out fee, same-day",      website: "gxrplumbing.com.au" },
  { n: 11, name: "Everest HVAC & R",                 suburb: "Perth Metro", type: "HVAC",       signal: "24/7 service, emergency response",            website: "www.airconperth.com" },
  { n: 12, name: "Ambience Air",                     suburb: "Perth Metro", type: "HVAC",       signal: "Premium service, energy-efficient systems",    website: "ambienceair.com" },
  { n: 13, name: "WA HVAC",                          suburb: "Perth Metro", type: "HVAC",       signal: "Full-service design to commissioning",        website: "wahvac.com.au" },
  { n: 14, name: "Perth City Air",                   suburb: "Perth Metro", type: "HVAC",       signal: "Installation, whole-home cooling",            website: "www.perthcityair.com.au" },
  { n: 15, name: "Total Air",                        suburb: "Perth Metro", type: "HVAC",       signal: "Family-owned, expert supply & installation",  website: "totalair.com.au" },
  { n: 16, name: "Power Building Company WA",        suburb: "Perth Metro", type: "Builder",     signal: "Residential builder, exceptional craftsmanship", website: "www.powerbuildingcompanywa.com" },
  { n: 17, name: "Oz Home Building",                 suburb: "Perth Metro", type: "Builder",     signal: "Construction, home renovations",              website: "www.ozhomebuilding.com" },
  { n: 18, name: "Summit Homes",                      suburb: "Perth Metro", type: "Builder",     signal: "48+ years, 47,000+ homes built",              website: "www.summithomes.com.au" },
  { n: 19, name: "New House WA",                      suburb: "Perth Metro", type: "Builder",     signal: "40+ years, custom high-quality homes",        website: "www.newhousewa.com.au" },
  { n: 20, name: "Core WA",                           suburb: "Perth Metro", type: "Builder",     signal: "Award-winning, 40 years experience",          website: "www.corewa.com.au" },
]

const EMAIL_TEMPLATES = [
  {
    id: 1,
    name: "General Admin Overload",
    subject: "Quick question about your admin",
    body: `Hi [Name],

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help [electricians/plumbers/HVAC techs/builders] turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

[Book a 15-min call] — we've got availability Thursday and Friday this week.

Cheers,
[Your Name]`,
    useFor: "General businesses, no specific signal",
  },
  {
    id: 2,
    name: "Missed Calls on the Job",
    subject: "Saw your ad — quick question",
    body: `Hi [Name],

Here's a reality check:

Every time you're on a roof, under a sink, or elbow-deep in a job — your phone's probably ringing in your ute.

And every missed call is a quote someone else just picked up.

We help Perth tradies fix their phone situation so jobs don't slip through the cracks. Not a fancy app — just a better way to catch every lead and follow up without it taking over your life.

Worth 10 minutes?

[Jump on a quick call] — I've got Thursday afternoon free.

Cheers,
[Your Name]`,
    useFor: "24/7 emergency, same-day service",
  },
  {
    id: 3,
    name: "Quote Follow-Up / Losing Deals",
    subject: "Quick question about your quotes",
    body: `Hi [Name],

Real talk — how many quotes do you reckon you've sent this year that just never got a reply?

The hard truth is most tradies send the quote and move on. Meanwhile the customer's already picked someone else because they followed up.

We help Perth tradies build a simple follow-up system so you're not leaving money on the table. Not pushy — just a way to stay in the picture without adding hours to your day.

Keen to hear how it works?

[Grab a 15-min chat]

Cheers,
[Your Name]`,
    useFor: "Free quotes, no call-out fee",
  },
  {
    id: 4,
    name: "Personalised Signal Email",
    subject: "Saw your [specific signal] — one question",
    body: `Hi [Name],

Noticed on your site that you offer [SAME-DAY SERVICE / 24-7 EMERGENCY / FREE QUOTES].

That's a solid differentiator — but it only works if you're actually catching every call and getting quotes out fast.

We help [electricians/plumbers/HVAC techs/builders] in Perth tidy up their leads process so [same-day service / 24-7 response] actually converts to jobs, not just lost voicemails.

Happy to show you what we've seen work for tradies in [SUBURB]?

[Let's chat for 10 mins]

Cheers,
[Your Name]`,
    useFor: "Any specific signal you can reference",
  },
  {
    id: 5,
    name: "Follow-Up (3 Days Later)",
    subject: "One more thing",
    body: `Hi [Name],

Chasing you because I sent a note a few days ago and it might've got buried.

Not going to pretend this is a sales pitch you'll love — but the stuff we do for Perth tradies is genuinely useful if you're sick of admin eating your nights and weekends.

Still worth 10 minutes if you're curious.

[Here — find a time that works]

No pressure,
[Your Name]`,
    useFor: "Follow-up after no response",
  },
]

// ─── FULLY PERSONALISED EMAILS ───────────────────────────────────────────────

const EMAILS: Record<number, { subject: string; body: string }> = {
  1: {
    subject: "Saw your ad — quick question",
    body: `Hi there,

Here's a reality check:

Every time you're on a roof, under a switchboard, or elbow-deep in a job — your phone's probably ringing in your ute.

And every missed call is a quote someone else just picked up.

We help Perth electricians fix their phone situation so jobs don't slip through the cracks. Not a fancy app — just a better way to catch every lead and follow up without it taking over your life.

Worth 10 minutes?

**[Jump on a quick call](https://emvy-booking.vercel.app)** — I've got Thursday afternoon free.

Cheers,
Dusk`,
  },
  2: {
    subject: "Saw your same-day service — one question",
    body: `Hi there,

Noticed on your site that you offer same-day service for Dianella and surrounding areas.

That's a solid differentiator — but it only works if you're actually catching every call and getting quotes out fast.

We help electricians in Perth tidy up their leads process so same-day service actually converts to jobs, not just lost voicemails.

Happy to show you what we've seen work for tradies in Dianella?

**[Let's chat for 10 mins](https://emvy-booking.vercel.app)**

Cheers,
Dusk`,
  },
  3: {
    subject: "Saw your ad — quick question",
    body: `Hi there,

Here's a reality check:

Every time you're on a roof, under a switchboard, or elbow-deep in a job — your phone's probably ringing in your ute.

And every missed call is a quote someone else just picked up.

We help Perth electricians fix their phone situation so jobs don't slip through the cracks. Not a fancy app — just a better way to catch every lead and follow up without it taking over your life.

Worth 10 minutes?

**[Jump on a quick call](https://emvy-booking.vercel.app)** — I've got Thursday afternoon free.

Cheers,
Dusk`,
  },
  4: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help electricians turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  5: {
    subject: "Saw your same-day service — one question",
    body: `Hi there,

Noticed on your site that you offer same-day service for Perth Metro.

That's a solid differentiator — but it only works if you're actually catching every call and getting quotes out fast.

We help electricians in Perth tidy up their leads process so same-day service actually converts to jobs, not just lost voicemails.

Happy to show you what we've seen work for tradies in Perth?

**[Let's chat for 10 mins](https://emvy-booking.vercel.app)**

Cheers,
Dusk`,
  },
  6: {
    subject: "Saw your same-day service — one question",
    body: `Hi there,

Noticed on your site that you offer same-day service for Perth Metro.

That's a solid differentiator — but it only works if you're actually catching every call and getting quotes out fast.

We help plumbers in Perth tidy up their leads process so same-day service actually converts to jobs, not just lost voicemails.

Happy to show you what we've seen work for tradies in Perth?

**[Let's chat for 10 mins](https://emvy-booking.vercel.app)**

Cheers,
Dusk`,
  },
  7: {
    subject: "Quick question about your quotes",
    body: `Hi there,

Real talk — how many quotes do you reckon you've sent this year that just never got a reply?

The hard truth is most tradies send the quote and move on. Meanwhile the customer's already picked someone else because they followed up.

We help Perth plumbers build a simple follow-up system so you're not leaving money on the table. Not pushy — just a way to stay in the picture without adding hours to your day.

Keen to hear how it works?

**[Grab a 15-min chat](https://emvy-booking.vercel.app)**

Cheers,
Dusk`,
  },
  8: {
    subject: "Saw your ad — quick question",
    body: `Hi there,

Here's a reality check:

Every time you're on a job, under a sink, or elbow-deep in a repair — your phone's probably ringing in your ute.

And every missed call is a quote someone else just picked up.

We help Perth plumbers fix their phone situation so jobs don't slip through the cracks. Not a fancy app — just a better way to catch every lead and follow up without it taking over your life.

Worth 10 minutes?

**[Jump on a quick call](https://emvy-booking.vercel.app)** — I've got Thursday afternoon free.

Cheers,
Dusk`,
  },
  9: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help plumbers turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  10: {
    subject: "Saw your same-day service — one question",
    body: `Hi there,

Noticed on your site that you offer same-day service for Perth Metro.

That's a solid differentiator — but it only works if you're actually catching every call and getting quotes out fast.

We help plumbers in Perth tidy up their leads process so same-day service actually converts to jobs, not just lost voicemails.

Happy to show you what we've seen work for tradies in Perth?

**[Let's chat for 10 mins](https://emvy-booking.vercel.app)**

Cheers,
Dusk`,
  },
  11: {
    subject: "Saw your ad — quick question",
    body: `Hi there,

Here's a reality check:

Every time you're on a job, elbow-deep in a unit, or responding to an emergency call — your phone's probably ringing in your ute.

And every missed call is a quote someone else just picked up.

We help Perth HVAC technicians fix their phone situation so jobs don't slip through the cracks. Not a fancy app — just a better way to catch every lead and follow up without it taking over your life.

Worth 10 minutes?

**[Jump on a quick call](https://emvy-booking.vercel.app)** — I've got Thursday afternoon free.

Cheers,
Dusk`,
  },
  12: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help HVAC technicians turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  13: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help HVAC technicians turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  14: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help HVAC technicians turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  15: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help HVAC technicians turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  16: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help builders turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  17: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help builders turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  18: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help builders turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  19: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help builders turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
  20: {
    subject: "Quick question about your admin",
    body: `Hi there,

I'll keep this short.

Most tradies I talk to in Perth are flat out doing the actual work — then they get home and spend 2 hours on quotes, invoices and chasing payments.

That's not why you got into your trade.

We help builders turn their admin into a system that runs itself. No fluff, no big software packages — just fixing what's broken so you stop bleeding time.

Worth a quick chat?

**[Book a 15-min call](https://emvy-booking.vercel.app)** — we've got availability Thursday and Friday this week.

Cheers,
Dusk`,
  },
}

function getSignalType(signal: string): number {
  if (signal.includes("24/7")) return 2
  if (signal.includes("same-day") || signal.includes("free quotes") || signal.includes("no call-out")) return 3
  return 1
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
        active
          ? 'bg-[#10b981] text-white'
          : 'text-[#a1a1aa] hover:text-white hover:bg-[#1a1a25]'
      }`}
    >
      {children}
    </button>
  )
}

function StatusBadge({ sent }: { sent: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      sent ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-[#27272a] text-[#71717a]'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${sent ? 'bg-[#10b981]' : 'bg-[#52525b]'}`} />
      {sent ? 'Ready to send' : 'Not started'}
    </span>
  )
}

// ─── TAB: PROSPECT LIST ──────────────────────────────────────────────────────

function ProspectListTab() {
  const [filter, setFilter] = useState('All')
  const types = ['All', 'Electrical', 'Plumbing', 'HVAC', 'Builder']
  const filtered = filter === 'All' ? TRADIES : TRADIES.filter(t => t.type === filter)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm text-[#71717a]">Filter:</span>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === t
                ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30'
                : 'bg-[#0d0d14] text-[#71717a] border border-[#1a1a25] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
        <span className="text-xs text-[#52525b] ml-auto">{filtered.length} businesses</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#1a1a25]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1a1a25] bg-[#0d0d14]/50">
              <th className="text-left px-4 py-3 text-[#71717a] font-medium text-xs uppercase tracking-wider">#</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium text-xs uppercase tracking-wider">Business</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium text-xs uppercase tracking-wider hidden md:table-cell">Suburb</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium text-xs uppercase tracking-wider">Signal</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Template</th>
              <th className="text-left px-4 py-3 text-[#71717a] font-medium text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.n} className="border-b border-[#1a1a25]/50 hover:bg-[#0d0d14]/30 transition-colors">
                <td className="px-4 py-3 text-[#52525b] font-mono">{t.n}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{t.name}</div>
                  <div className="text-xs text-[#52525b] hidden md:block">{t.website}</div>
                </td>
                <td className="px-4 py-3 text-[#a1a1aa] hidden md:table-cell">{t.suburb}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    t.type === 'Electrical' ? 'bg-yellow-500/10 text-yellow-400' :
                    t.type === 'Plumbing'   ? 'bg-blue-500/10 text-blue-400' :
                    t.type === 'HVAC'       ? 'bg-cyan-500/10 text-cyan-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>{t.type}</span>
                </td>
                <td className="px-4 py-3 max-w-[200px]">
                  <span className="text-[#a1a1aa] text-xs">{t.signal}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-[#10b981]">Email {getSignalType(t.signal)}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge sent={false} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── TAB: EMAIL TEMPLATES ────────────────────────────────────────────────────

function EmailTemplatesTab() {
  const [selected, setSelected] = useState(1)

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="space-y-2">
        {EMAIL_TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selected === t.id
                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-white'
                : 'bg-[#0d0d14] border-[#1a1a25] text-[#a1a1aa] hover:border-[#2a2a3a]'
            }`}
          >
            <div className="font-medium text-sm mb-1">Email {t.id}: {t.name}</div>
            <div className="text-xs text-[#71717a]">{t.useFor}</div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-2">
        {EMAIL_TEMPLATES.filter(t => t.id === selected).map(t => (
          <div key={t.id} className="space-y-4">
            <div className="gradient-border p-5">
              <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider mb-2">Subject Line</div>
              <div className="text-white font-mono text-sm">{t.subject}</div>
            </div>
            <div className="gradient-border p-5">
              <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider mb-2">Email Body</div>
              <pre className="text-[#d4d4d8] text-sm whitespace-pre-wrap font-sans leading-relaxed">{t.body}</pre>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(`Subject: ${t.subject}\n\n${t.body}`)}
                className="btn-primary text-sm px-5 py-2.5"
              >
                <span>Copy Email</span>
              </button>
              <span className="text-xs text-[#71717a]">Replace [Name], [Your Name], [SUBURB] before sending</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TAB: PERSONALISED EMAILS ───────────────────────────────────────────────

function PersonalisedTab() {
  const [selected, setSelected] = useState(1)
  const t = TRADIES.find(t => t.n === selected)!
  const email = EMAILS[selected]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        {TRADIES.map(t => (
          <button
            key={t.n}
            onClick={() => setSelected(t.n)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
              selected === t.n
                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#34d399]'
                : 'bg-[#0d0d14] border-[#1a1a25] text-[#71717a] hover:text-white'
            }`}
          >
            {t.n}. {t.name.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: tradie info */}
        <div className="lg:col-span-2 gradient-border p-5">
          <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider mb-3">Target</div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#52525b]">Business</div>
              <div className="text-white font-medium">{t.name}</div>
            </div>
            <div>
              <div className="text-xs text-[#52525b]">Suburb</div>
              <div className="text-[#a1a1aa] text-sm">{t.suburb}</div>
            </div>
            <div>
              <div className="text-xs text-[#52525b]">Type</div>
              <div className="text-[#a1a1aa] text-sm">{t.type}</div>
            </div>
            <div>
              <div className="text-xs text-[#52525b]">Signal</div>
              <div className="text-[#10b981] text-sm">{t.signal}</div>
            </div>
            <div>
              <div className="text-xs text-[#52525b]">Website</div>
              <div className="text-[#a1a1aa] text-sm">{t.website}</div>
            </div>
            <div>
              <div className="text-xs text-[#52525b]">Use Template</div>
              <div className="text-[#34d399] text-sm">Email {getSignalType(t.signal)} — {EMAIL_TEMPLATES[getSignalType(t.signal) - 1].name}</div>
            </div>
          </div>
        </div>

        {/* Right: email */}
        <div className="lg:col-span-3">
          {email ? (
            <div className="space-y-4">
              <div className="gradient-border p-5">
                <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider mb-2">Subject</div>
                <div className="text-white font-mono text-sm">{email.subject}</div>
              </div>
              <div className="gradient-border p-5">
                <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider mb-2">Body</div>
                <pre className="text-[#d4d4d8] text-sm whitespace-pre-wrap font-sans leading-relaxed">{email.body}</pre>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`)}
                className="btn-primary"
              >
                <span>Copy to Send</span>
              </button>
            </div>
          ) : (
            <div className="gradient-border p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <div className="text-white font-semibold mb-2">Personalised email #{t.n}</div>
              <div className="text-[#71717a] text-sm mb-4">
                <strong>{t.name}</strong> — {t.signal}
              </div>
              <div className="text-xs text-[#52525b] mb-4">
                Use: <span className="text-[#10b981]">Email {getSignalType(t.signal)}</span> template
              </div>
              <div className="text-left text-xs text-[#71717a] bg-[#0d0d14] rounded-xl p-4">
                <div className="font-medium text-[#a1a1aa] mb-2">Quick personalisation:</div>
                <div className="space-y-1 text-[#52525b]">
                  <div>• Replace [Name] with owner's first name</div>
                  <div>• Reference their specific signal naturally</div>
                  <div>• Replace [SUBURB] with {t.suburb}</div>
                  <div>• Replace [Your Name] with Dusk</div>
                  <div>• Link CTA to: emvy-booking.vercel.app</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── TAB: SEND SETUP ─────────────────────────────────────────────────────────

function SendSetupTab() {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
      <div className="gradient-border p-6">
        <div className="text-lg font-bold text-white mb-4">Gmail SMTP</div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[#1a1a25]">
            <span className="text-[#71717a]">From</span>
            <span className="text-white font-mono">dawnlabsai@gmail.com</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#1a1a25]">
            <span className="text-[#71717a]">App Password</span>
            <span className="text-white font-mono">wrankndsznzwjiksia</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#1a1a25]">
            <span className="text-[#71717a]">SMTP Server</span>
            <span className="text-white font-mono">smtp.gmail.com:587</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[#71717a]">Daily Limit</span>
            <span className="text-[#f59e0b] font-medium">500 emails/day</span>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-xs text-[#f59e0b]">
          Gmail limit: 500/day. Send in batches of 20-30 with 2-3 min gaps between.
        </div>
      </div>

      <div className="gradient-border p-6">
        <div className="text-lg font-bold text-white mb-4">Booking Link</div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[#1a1a25]">
            <span className="text-[#71717a]">Website</span>
            <a href="https://emvy-booking.vercel.app" target="_blank" className="text-[#34d399] font-mono text-xs hover:underline">emvy-booking.vercel.app</a>
          </div>
          <div className="flex justify-between py-2 border-b border-[#1a1a25]">
            <span className="text-[#71717a]">Email</span>
            <span className="text-white font-mono">hello@emvy.ai</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[#71717a]">Brand</span>
            <span className="text-white">"Shut Up and Build"</span>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 text-xs text-[#34d399]">
          Replace [Book a 15-min call] with the booking link in every email.
        </div>
      </div>

      <div className="gradient-border p-6">
        <div className="text-lg font-bold text-white mb-4">Testing Checklist</div>
        <div className="space-y-2 text-sm">
          {[
            "Send test to your own email first",
            "Check how it looks in inbox (mobile + desktop)",
            "Verify booking link works end-to-end",
            "Test the booking form submits correctly",
            "Confirm email arrives in inbox (not spam)",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[#1a1a25]/50">
              <span className="w-6 h-6 rounded border border-[#2a2a3a] flex-shrink-0" />
              <span className="text-[#a1a1aa]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gradient-border p-6">
        <div className="text-lg font-bold text-white mb-4">Sending Schedule</div>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#1a1a25]">
            <div className="text-white font-medium mb-1">Today — Test</div>
            <div className="text-[#71717a] text-xs">Send 1 test email to yourself</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#1a1a25]">
            <div className="text-white font-medium mb-1">Day 1 — Batch 1</div>
            <div className="text-[#71717a] text-xs">Send to tradies 1–5 (morning)</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#1a1a25]">
            <div className="text-white font-medium mb-1">Day 2 — Batch 2</div>
            <div className="text-[#71717a] text-xs">Send to tradies 6–10 (morning)</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#1a1a25]">
            <div className="text-white font-medium mb-1">Day 4 — Follow-up</div>
            <div className="text-[#71717a] text-xs">Email 5 (follow-up) to non-responders</div>
          </div>
          <div className="p-3 rounded-xl bg-[#0d0d14] border border-[#1a1a25]">
            <div className="text-white font-medium mb-1">Day 7 — Batch 3</div>
            <div className="text-[#71717a] text-xs">Send to tradies 11–15</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function FunnelPage() {
  const [tab, setTab] = useState('prospects')

  const tabs = [
    { id: 'prospects',   label: 'Prospect List',  icon: '📋' },
    { id: 'templates',   label: 'Email Templates', icon: '✉️' },
    { id: 'personal',   label: 'Personalised Emails', icon: '🎯' },
    { id: 'send',       label: 'Send Setup', icon: '🚀' },
  ]

  return (
    <div className="min-h-screen bg-[#030307]">
      {/* Header */}
      <div className="border-b border-[#1a1a25] bg-[#0d0d14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <span className="text-white font-bold">EMVY — Tradie Funnel</span>
                <span className="text-xs text-[#71717a] ml-2">Shut Up and Build</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#71717a]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              Live
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(t => (
              <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
                <span className="mr-1.5">{t.icon}</span>{t.label}
              </TabButton>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {tab === 'prospects'  && <ProspectListTab />}
        {tab === 'templates'  && <EmailTemplatesTab />}
        {tab === 'personal'   && <PersonalisedTab />}
        {tab === 'send'       && <SendSetupTab />}
      </div>
    </div>
  )
}
