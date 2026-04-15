import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import PDFDocument from 'pdfkit'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dawnlabsai@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'jhyqagjhlvabdubi',
  },
})

const CATEGORIES = [
  {
    name: 'RESEARCH',
    color: '#10b981',
    prompts: [
      { n: 1, title: 'MARKET RESEARCH', desc: 'Research the AI writing software market for a solo founder considering entry. Return: market size + CAGR, top 5 players, 2 trends a new entrant can ride, most underserved segment, one specific gap. Cite sources. Under 600 words.' },
      { n: 2, title: 'COMPETITOR DEEP DIVE', desc: 'Break down [COMPETITOR]: what their AI does, pricing tiers, 3 most common G2/AppStore complaints with exact quotes, what users praise, retention strategy. Then tell me the price point to undercut them.' },
      { n: 3, title: 'TECH STACK AUDIT', desc: 'Audit my tool stack for AI integration opportunities. Where can AI reduce manual work right now? Lowest-effort automation I could build this week? Highest-ROI automation for a solo operator? 3-item priority list with time estimates.' },
      { n: 4, title: 'CUSTOMER INTERVIEW SCRIPTER', desc: 'Generate 10 open-ended discovery questions for [CUSTOMER TYPE]. Uncover: biggest workflow frustration, what they tried, what they\'d pay, why unsolved. Warm intro + hard-hitting questions toward the end.' },
      { n: 5, title: 'REDDIT SENTIMENT ANALYSIS', desc: 'Find 20 Reddit posts in [SUBREDDIT] about [TOPIC]. 3 most common complaints/desires, exact phrases customers use (for marketing), what solutions they\'re using and what\'s broken, emerging niches.' },
    ],
  },
  {
    name: 'OUTREACH',
    color: '#3b82f6',
    prompts: [
      { n: 6, title: 'COLD EMAIL — GENERAL', desc: 'Write a cold email to [PERSON/TYPE] about [OFFER]. Subject line + 3 alternatives, 150-word conversational body, one clear CTA, signature line.' },
      { n: 7, title: 'COLD EMAIL — PERSONALISED', desc: 'Write a personalised cold email using: their name, company, industry, pain point, what I\'m offering, my credibility. Subject, 150-word body, CTA.' },
      { n: 8, title: 'LINKEDIN OUTREACH', desc: 'Write a LinkedIn connection request to [PERSON]: personalised opener referencing their profile/post, 2-sentence value prop, soft CTA (not "book a call"). Under 300 characters. Include optional follow-up.' },
      { n: 9, title: 'FOLLOW-UP SEQUENCE', desc: 'Write a 3-email follow-up sequence for [PROSPECT] who didn\'t respond. Day 3: reminder. Day 7: value add (something genuinely useful). Day 14: breakup email with urgency. 100-150 words each. Direct, not pushy.' },
      { n: 10, title: 'WARM INTRODUCTION EMAIL', desc: 'Write an email to [MUTUAL CONNECTION] asking for an intro to [RECIPIENT]. Context: why this intro makes sense + what I offer. Plus the actual forwardable intro email they can send directly.' },
    ],
  },
  {
    name: 'CONTENT',
    color: '#8b5cf6',
    prompts: [
      { n: 11, title: 'X/TWITTER THREAD', desc: 'Convert [CONTENT] into a 10-tweet thread. Each tweet: self-contained, ends with a hook for the next tweet, minimal hashtags, sounds like a real person. Include a scroll-stopping opening tweet.' },
      { n: 12, title: 'BLOG POST OUTLINE', desc: 'Generate a detailed blog outline for [TOPIC]: hook, 5-7 H2 sections with 2-3 bullets each, suggested stats/data points, conclusion with CTA. Target: [WORD COUNT] words. Audience: [AUDIENCE].' },
      { n: 13, title: 'VIDEO SCRIPT', desc: 'Write a [LENGTH]-minute video script for [TOPIC]: 15-second hook, 3-5 key points with examples, a story or case study, call to action. Format: [HOST]: [DIALOGUE] with [VISUAL NOTES].' },
      { n: 14, title: 'NEWSLETTER ISSUE', desc: 'Write a weekly newsletter for [AUDIENCE]: 1 major industry development with your take, 1 actionable tip they can use this week, 1 tool worth knowing, 1 personal update. Conversational, 400-600 words. Subject line + preview text.' },
      { n: 15, title: 'GITHUB README', desc: 'Write a compelling README.md for [PROJECT]: Overview, Features, Quick Start, Use Cases, Roadmap, Contributing. Honest — don\'t oversell. Technical audience but not condescending.' },
    ],
  },
  {
    name: 'OPERATIONS',
    color: '#f59e0b',
    prompts: [
      { n: 16, title: 'PROCESS DOCUMENTATION', desc: 'Document my current workflow for [TASK] step by step. Format: numbered steps, time estimates per step, tools used, common failure points, how to recover. For a new team member or AI agent picking this up.' },
      { n: 17, title: 'SOP WRITING', desc: 'Write a Standard Operating Procedure for [TASK]: Purpose, Scope, Materials Needed, Step-by-Step Instructions, Quality Checklist, Troubleshooting Guide. For a competent person who\'s never done this specific task.' },
      { n: 18, title: 'ERROR HANDLING GUIDE', desc: 'I\'m building an automated workflow for [TASK]. What could go wrong at each step? For each failure: What happens, How to detect, How to fix, How to prevent. Table format: Step | Failure | Detection | Fix | Prevention.' },
      { n: 19, title: 'MEETING NOTES → ACTION ITEMS', desc: 'Convert these meeting notes into: Key decisions made, Action items with owners and deadlines, Questions to resolve before next meeting, A 3-sentence executive summary. [PASTE NOTES HERE]' },
      { n: 20, title: 'PROJECT TIMELINE', desc: 'Generate a realistic project timeline for [PROJECT TYPE]: phases, milestones, time estimates, dependencies (what must be done before what), buffer for unexpected delays. Working [N] hours/week. Deadline: [DATE].' },
    ],
  },
  {
    name: 'SALES',
    color: '#ef4444',
    prompts: [
      { n: 21, title: 'DISCOVERY CALL QUALIFICATION', desc: 'I\'m about to jump on a discovery call with [PROSPECT TYPE]. Give me: 10 qualifying questions, red flags meaning I should not take this client, green flags meaning this is ideal, how to position pricing without underselling, 3 closing techniques.' },
      { n: 22, title: 'PROPOSAL OUTLINE', desc: 'Write a proposal outline for [PROJECT] for [CLIENT]: Problem Statement, Proposed Solution, Scope of Work, Timeline, Pricing with payment terms, Guarantees/Risks, CTA. Keep it under 5 pages.' },
      { n: 23, title: 'OBJECTION HANDLING', desc: 'Generate responses to these objections for [SERVICE]: (1) "It\'s too expensive", (2) "I need to think about it", (3) "We\'re already working with someone", (4) "Can you do it for free first?", (5) "I don\'t have time right now". 2-3 sentences each. Reframe, don\'t argue.' },
      { n: 24, title: 'PRICING PAGE COPY', desc: 'Write landing page copy for [SERVICE] at [PRICE]: hero headline + subheadline, 3 benefit bullets, social proof placeholder, FAQ with 5 real objections, urgency element (without being fake), CTA. Audience: [AUDIENCE]. Tone: [TONE].' },
      { n: 25, title: 'REFERRAL REQUEST', desc: 'Write a message asking [CLIENT] for a referral. Context: what I did for them, what the result was, why they might know someone who'd benefit. 3 versions: text message, email, in-person talking points.' },
    ],
  },
]

const BONUS = [
  { n: 26, q: '"What\'s the one thing about [INDUSTRY] that most people miss but is obvious once pointed out?"' },
  { n: 27, q: '"Give me 5 names of podcasts in [NICHE] that would be good for a guest appearance."' },
  { n: 28, q: '"Write 10 headlines for a [TYPE OF CONTENT] about [TOPIC]. Make them provocative, not clever."' },
  { n: 29, q: '"What are the 3 dumbest things people believe about [INDUSTRY/TOPIC] that are completely wrong?"' },
  { n: 30, q: '"Draft a 60-second pitch for [YOUR SERVICE] that a 5-year-old would understand."' },
]

async function generatePromptsPDF(): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  const chunks: Buffer[] = []

  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  // ── Cover Page ──────────────────────────────────────────────
  doc.font('Helvetica-Bold')
  doc.fontSize(34)
  doc.fillColor('#10b981')
  doc.text('50 AI AGENT PROMPTS', { align: 'center' })
  doc.moveDown(0.5)

  doc.fontSize(16)
  doc.fillColor('#666666')
  doc.text('THE SHUT UP AND BUILD PACK', { align: 'center' })
  doc.moveDown(2)

  doc.font('Helvetica')
  doc.fontSize(11)
  doc.fillColor('#888888')
  doc.text('50 working prompts for OpenClaw, Claude,', { align: 'center' })
  doc.text('ChatGPT, and any AI agent framework.', { align: 'center' })
  doc.moveDown(0.5)
  doc.text('Copy, paste, and deploy immediately.', { align: 'center' })
  doc.moveDown(2)

  doc.fontSize(10)
  doc.fillColor('#aaaaaa')
  doc.text('emvy.ai', { align: 'center' })
  doc.moveDown(3)

  doc.fontSize(9)
  doc.fillColor('#cccccc')
  doc.text('EMVY — AI Audit Agency — Perth, Australia', { align: 'center' })
  doc.text('hello@emvy.ai', { align: 'center' })

  // ── Table of Contents ──────────────────────────────────────
  doc.addPage()
  doc.font('Helvetica-Bold')
  doc.fontSize(22)
  doc.fillColor('#10b981')
  doc.text('Contents', { align: 'center' })
  doc.moveDown(1.2)

  CATEGORIES.forEach(cat => {
    doc.font('Helvetica-Bold')
    doc.fontSize(11)
    doc.fillColor('#333333')
    doc.text(cat.name, { indent: 30 })
    doc.moveDown(0.3)

    doc.font('Helvetica')
    doc.fontSize(9)
    doc.fillColor('#888888')
    cat.prompts.forEach(p => {
      doc.text(`Prompt ${p.n}: ${p.title}`, { indent: 40 })
    })
    doc.moveDown(0.8)
  })

  doc.moveDown(0.5)
  doc.fontSize(9)
  doc.fillColor('#aaaaaa')
  doc.text('Bonus: Quick-Fire Prompts 26–30', { indent: 30 })

  // ── Prompt Pages ────────────────────────────────────────────
  CATEGORIES.forEach(cat => {
    cat.prompts.forEach(p => {
      doc.addPage()

      // Category tag
      doc.font('Helvetica-Bold')
      doc.fontSize(8)
      doc.fillColor(cat.color)
      doc.text(`${cat.name}  •  PROMPT ${p.n}`, { lineGap: 0 })
      doc.moveDown(0.5)

      // Title
      doc.font('Helvetica-Bold')
      doc.fontSize(18)
      doc.fillColor('#111111')
      doc.text(p.title)
      doc.moveDown(0.6)

      // Description
      doc.font('Helvetica')
      doc.fontSize(10.5)
      doc.fillColor('#444444')
      doc.text(p.desc, { lineGap: 3 })
      doc.moveDown(1.2)

      // Fill-in box
      doc.font('Helvetica')
      doc.fontSize(9)
      doc.fillColor('#bbbbbb')
      doc.text('YOUR VERSION', { continued: false })
      doc.moveDown(0.3)
      doc.rect(doc.x, doc.y, 495, 110).stroke('#dddddd')
      doc.moveDown(13)

      // Footer
      doc.fontSize(8)
      doc.fillColor('#cccccc')
      doc.text('EMVY — emvy.ai', { align: 'left' })
      doc.text(`${p.n} of 30`, { align: 'right' })
    })
  })

  // ── Bonus Prompts Page ─────────────────────────────────────
  doc.addPage()
  doc.font('Helvetica-Bold')
  doc.fontSize(8)
  doc.fillColor('#f59e0b')
  doc.text('BONUS  •  QUICK-FIRE PROMPTS')
  doc.moveDown(0.5)

  doc.font('Helvetica-Bold')
  doc.fontSize(20)
  doc.fillColor('#111111')
  doc.text('5 Quick-Fire Prompts')
  doc.moveDown(1)

  BONUS.forEach(p => {
    doc.font('Helvetica-Bold')
    doc.fontSize(10)
    doc.fillColor('#333333')
    doc.text(`${p.n}. ${p.q}`)
    doc.moveDown(0.4)

    doc.font('Helvetica')
    doc.fontSize(9)
    doc.fillColor('#bbbbbb')
    doc.text('Your answer:', { indent: 10 })
    doc.moveDown(1.2)
  })

  // ── CTA Page ───────────────────────────────────────────────
  doc.addPage()
  doc.font('Helvetica-Bold')
  doc.fontSize(26)
  doc.fillColor('#10b981')
  doc.text('Want more?', { align: 'center' })
  doc.moveDown(1.5)

  doc.font('Helvetica')
  doc.fontSize(12)
  doc.fillColor('#666666')
  doc.text('These prompts are what we use daily at EMVY.', { align: 'center' })
  doc.text('We build AI automation for service businesses.', { align: 'center' })
  doc.moveDown(2)

  doc.font('Helvetica-Bold')
  doc.fontSize(15)
  doc.fillColor('#111111')
  doc.text('Book an AI Audit — $1,500', { align: 'center' })
  doc.moveDown(0.8)

  doc.fontSize(11)
  doc.fillColor('#888888')
  doc.text('emvy.ai', { align: 'center' })
  doc.text('hello@emvy.ai', { align: 'center' })

  // End and wait for stream to finish
  return new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.end()
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const pdfBuffer = await generatePromptsPDF()

    await transporter.sendMail({
      from: '"EMVY — Shut Up and Build" <dawnlabsai@gmail.com>',
      to: email,
      subject: 'Your 50 AI Agent Prompts — Shut Up and Build Pack',
      text: `Your 50 AI Agent Prompts are attached as a PDF.\n\nDownload it, print it, fill it in, and start using these prompts today.\n\nEMVY — AI Audit Agency\nemvy.ai\nhello@emvy.ai`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #030307; color: #f4f4f5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; line-height: 48px; font-size: 24px; color: white; font-weight: bold;">E</div>
            <h1 style="color: #10b981; font-size: 24px; margin: 16px 0 8px;">Your prompts are ready.</h1>
            <p style="color: #71717a; font-size: 14px; margin: 0;">50 AI agent prompts — PDF attached. Print it, fill it in, start building.</p>
          </div>
          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 16px; margin: 0 0 12px;">What's inside:</h2>
            <ul style="color: #a1a1aa; font-size: 14px; margin: 0; padding-left: 20px; line-height: 2;">
              <li>5 Research Agent Prompts (prompts 1–5)</li>
              <li>5 Outreach Agent Prompts (prompts 6–10)</li>
              <li>5 Content Agent Prompts (prompts 11–15)</li>
              <li>5 Operations Agent Prompts (prompts 16–20)</li>
              <li>5 Sales Agent Prompts (prompts 21–25)</li>
              <li>5 Quick-Fire Bonus Prompts (prompts 26–30)</li>
            </ul>
          </div>
          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
              Each prompt has a clear description + a blank fill-in box. Print it, write your version, use it immediately.
            </p>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://emvy-booking.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Book an AI Audit — $1,500</a>
          </div>
          <p style="color: #52525b; font-size: 12px; text-align: center; margin: 0;">EMVY — AI Audit Agency — Perth, Australia<br>dawnlabsai@gmail.com</p>
        </div>
      `,
      attachments: [
        {
          filename: '50-AI-Agent-Prompts-SHUT-UP-AND-BUILD.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead magnet error:', error)
    return NextResponse.json({ error: 'Something went wrong. Email us at dawnlabsai@gmail.com' }, { status: 500 })
  }
}
