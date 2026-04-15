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

const PROMPTS = [
  { category: 'RESEARCH', prompts: [
    { n: 1, title: 'MARKET RESEARCH', desc: 'Research AI writing software market — size, CAGR, top players, trends, gaps. Under 600 words, cited sources.' },
    { n: 2, title: 'COMPETITOR DEEP DIVE', desc: 'Break down [COMPETITOR] — features, pricing, G2 complaints, what users praise. Tell me the price point to undercut them.' },
    { n: 3, title: 'TECH STACK AUDIT', desc: 'Audit my tool stack for AI integration opportunities. Lowest-effort automation vs highest-ROI automation.' },
    { n: 4, title: 'CUSTOMER INTERVIEW SCRIPTER', desc: '10 open-ended discovery questions for [CUSTOMER TYPE]. Uncover pain points, willingness to pay, why unsolved.' },
    { n: 5, title: 'REDDIT SENTIMENT ANALYSIS', desc: 'Find 20 Reddit posts on [SUBREDDIT] about [TOPIC]. Common complaints, exact phrases, what solutions are broken.' },
  ]},
  { category: 'OUTREACH', prompts: [
    { n: 6, title: 'COLD EMAIL — GENERAL', desc: 'Write a cold email to [PERSON] about [OFFER]. Subject + 150-word body + CTA + signature.' },
    { n: 7, title: 'COLD EMAIL — PERSONALISED', desc: 'Personalised cold email using their name, company, industry, pain point, what I offer, my credibility.' },
    { n: 8, title: 'LINKEDIN OUTREACH', desc: 'LinkedIn connection request to [PERSON] — personalised opener, 2-sentence value prop, soft CTA. Under 300 chars.' },
    { n: 9, title: 'FOLLOW-UP SEQUENCE', desc: '3-email follow-up for [PROSPECT] who ghosted. Day 3 reminder, Day 7 value add, Day 14 breakup email.' },
    { n: 10, title: 'WARM INTRODUCTION EMAIL', desc: 'Email to [MUTUAL CONNECTION] asking for intro to [RECIPIENT]. Plus the actual forwardable intro email.' },
  ]},
  { category: 'CONTENT', prompts: [
    { n: 11, title: 'X/TWITTER THREAD', desc: 'Convert [CONTENT] into a 10-tweet thread. Self-contained, hook per tweet, sounds like a real person.' },
    { n: 12, title: 'BLOG POST OUTLINE', desc: 'Detailed blog outline for [TOPIC] — hook, 5-7 H2s, data points, conclusion CTA. [WORD COUNT] words.' },
    { n: 13, title: 'VIDEO SCRIPT', desc: '[LENGTH]-minute script for [TOPIC] — 15s hook, 3-5 points with examples, story/case study, CTA.' },
    { n: 14, title: 'NEWSLETTER ISSUE', desc: 'Weekly newsletter: 1 industry take, 1 actionable tip, 1 tool, 1 personal update. 400-600 words.' },
    { n: 15, title: 'GITHUB README', desc: 'README.md for [PROJECT] — Overview, Features, Quick Start, Use Cases, Roadmap, Contributing.' },
  ]},
  { category: 'OPERATIONS', prompts: [
    { n: 16, title: 'PROCESS DOCUMENTATION', desc: 'Document [TASK] step by step — time estimates, tools, failure points, recovery steps.' },
    { n: 17, title: 'SOP WRITING', desc: 'Write an SOP for [TASK] — Purpose, Scope, Materials, Steps, Quality Checklist, Troubleshooting.' },
    { n: 18, title: 'ERROR HANDLING GUIDE', desc: 'What could go wrong at each step of [AUTOMATED WORKFLOW]? Table: Step | Failure | Detection | Fix | Prevention.' },
    { n: 19, title: 'MEETING NOTES → ACTION ITEMS', desc: 'Convert [MEETING NOTES] to: decisions, action items with owners, open questions, 3-sentence summary.' },
    { n: 20, title: 'PROJECT TIMELINE', desc: 'Realistic timeline for [PROJECT] — phases, milestones, dependencies, buffer. [N] hours/week. Deadline: [DATE].' },
  ]},
  { category: 'SALES', prompts: [
    { n: 21, title: 'DISCOVERY CALL QUALIFICATION', desc: '10 qualifying questions for [PROSPECT]. Red flags, green flags, pricing positioning, 3 closing techniques.' },
    { n: 22, title: 'PROPOSAL OUTLINE', desc: 'Proposal for [PROJECT] for [CLIENT] — Problem, Solution, SOW, Timeline, Pricing, Guarantees, CTA. Under 5 pages.' },
    { n: 23, title: 'OBJECTION HANDLING', desc: 'Responses to: too expensive, need to think about it, already working with someone, free first, no time.' },
    { n: 24, title: 'PRICING PAGE COPY', desc: 'Landing page for [SERVICE] at [PRICE] — hero, 3 bullets, social proof, FAQ with 5 objections, CTA.' },
    { n: 25, title: 'REFERRAL REQUEST', desc: 'Ask [CLIENT] for a referral. What I did, result, who they know. 3 versions: text, email, in-person.' },
  ]},
]

const BONUS = [
  { n: 26, q: "What's the one thing about [INDUSTRY] most people miss but is obvious once pointed out?" },
  { n: 27, q: 'Give me 5 podcasts in [NICHE] good for a guest appearance.' },
  { n: 28, q: 'Write 10 headlines for [TYPE OF CONTENT] about [TOPIC]. Provocative, not clever.' },
  { n: 29, q: 'What are the 3 dumbest things people believe about [TOPIC] that are completely wrong?' },
  { n: 30, q: 'Draft a 60-second pitch for [SERVICE] that a 5-year-old would understand.' },
]

function generatePromptsPDF(): Buffer {
  const doc = new PDFDocument({ margin: 50 })
  const chunks: Buffer[] = []

  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  // Cover
  doc.font('Helvetica-Bold')
  doc.fontSize(32)
  doc.fillColor('#10b981')
  doc.text('50 AI AGENT PROMPTS', { align: 'center' })
  doc.moveDown(0.5)

  doc.fontSize(16)
  doc.fillColor('#666666')
  doc.text('THE SHUT UP AND BUILD PACK', { align: 'center' })
  doc.moveDown(1.5)

  doc.fontSize(11)
  doc.fillColor('#888888')
  doc.text('50 working prompts for OpenClaw, Claude, and any AI agent framework.', { align: 'center' })
  doc.text('Copy, paste, and deploy immediately.', { align: 'center' })
  doc.moveDown(0.5)
  doc.text('emvy.ai', { align: 'center' })
  doc.moveDown(2)

  doc.font('Helvetica')
  doc.fontSize(9)
  doc.fillColor('#999999')
  doc.text('EMVY — AI Audit Agency — Perth, Australia', { align: 'center' })

  // Page 2: Table of contents
  doc.addPage()

  doc.font('Helvetica-Bold')
  doc.fontSize(20)
  doc.fillColor('#10b981')
  doc.text('Contents', { align: 'center' })
  doc.moveDown(1)

  doc.font('Helvetica')
  doc.fontSize(11)
  doc.fillColor('#333333')

  let page = 2
  const categories = ['RESEARCH', 'OUTREACH', 'CONTENT', 'OPERATIONS', 'SALES']
  categories.forEach(cat => {
    doc.text(`${cat} — Prompts 1-5`, { indent: 20 })
  })
  doc.text(`BONUS — Prompts 26-30`, { indent: 20 })
  doc.moveDown(2)
  doc.fontSize(9)
  doc.fillColor('#888888')
  doc.text(`PDF generated by EMVY — emvy.ai — Page 1`, { align: 'center' })

  // Prompt pages
  let promptNum = 1
  const allPrompts = PROMPTS.flatMap(cat => cat.prompts)
  allPrompts.forEach((p, i) => {
    doc.addPage()

    doc.font('Helvetica-Bold')
    doc.fontSize(8)
    doc.fillColor('#10b981')
    doc.text(`PROMPT ${p.n} — ${p.category}`)
    doc.moveDown(0.5)

    doc.font('Helvetica-Bold')
    doc.fontSize(18)
    doc.fillColor('#111111')
    doc.text(p.title, { underline: false })
    doc.moveDown(0.8)

    doc.font('Helvetica')
    doc.fontSize(11)
    doc.fillColor('#444444')
    const lines = doc.text(p.desc, { align: 'left', lineGap: 4 })
    void lines

    doc.moveDown(1.5)

    // Fill-in box
    doc.font('Helvetica')
    doc.fontSize(10)
    doc.fillColor('#bbbbbb')
    doc.text('Your version:', { continued: false })
    doc.moveDown(0.3)
    doc.rect(doc.x, doc.y, 495, 120).stroke('#dddddd')
    doc.moveDown(15)

    doc.fontSize(9)
    doc.fillColor('#aaaaaa')
    doc.text(`EMVY — emvy.ai — Prompt ${p.n} of 30`, { align: 'right' })
    promptNum++
  })

  // Bonus prompts page
  doc.addPage()
  doc.font('Helvetica-Bold')
  doc.fontSize(8)
  doc.fillColor('#f59e0b')
  doc.text('BONUS PROMPTS — QUICK-FIRE')
  doc.moveDown(0.5)

  doc.font('Helvetica-Bold')
  doc.fontSize(18)
  doc.fillColor('#111111')
  doc.text('5 Quick-Fire Prompts')
  doc.moveDown(0.8)

  doc.font('Helvetica')
  doc.fontSize(11)
  doc.fillColor('#444444')

  BONUS.forEach(p => {
    doc.font('Helvetica-Bold')
    doc.fillColor('#111111')
    doc.text(`${p.n}. ${p.q}`, { indent: 0 })
    doc.moveDown(0.5)
    doc.font('Helvetica')
    doc.fillColor('#444444')
    doc.text('Your answer:', { indent: 10 })
    doc.moveDown(1.5)
  })

  // Final page
  doc.addPage()
  doc.font('Helvetica-Bold')
  doc.fontSize(24)
  doc.fillColor('#10b981')
  doc.text('Want more?', { align: 'center' })
  doc.moveDown(1)

  doc.font('Helvetica')
  doc.fontSize(12)
  doc.fillColor('#666666')
  doc.text('These prompts are what we use daily at EMVY.', { align: 'center' })
  doc.text('We build AI automation for service businesses.', { align: 'center' })
  doc.moveDown(1.5)

  doc.font('Helvetica-Bold')
  doc.fontSize(14)
  doc.fillColor('#111111')
  doc.text('Book an AI Audit — $1,500', { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(12)
  doc.fillColor('#666666')
  doc.text('emvy.ai', { align: 'center' })
  doc.text('hello@emvy.ai', { align: 'center' })

  doc.end()
  return Buffer.concat(chunks)
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

    const pdfBuffer = generatePromptsPDF()

    await transporter.sendMail({
      from: '"EMVY — Shut Up and Build" <dawnlabsai@gmail.com>',
      to: email,
      subject: 'Your 50 AI Agent Prompts — Shut Up and Build Pack',
      text: `Your 50 AI Agent Prompts are attached.\n\nDownload the PDF and start using these prompts today.\n\nEMVY — AI Audit Agency\nemvy.ai\nhello@emvy.ai`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #030307; color: #f4f4f5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; line-height: 48px; font-size: 24px; color: white; font-weight: bold;">E</div>
            <h1 style="color: #10b981; font-size: 24px; margin: 16px 0 8px;">Your prompts are ready.</h1>
            <p style="color: #71717a; font-size: 14px; margin: 0;">50 AI agent prompts — PDF attached. Copy, paste, and start building.</p>
          </div>
          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 16px; margin: 0 0 12px;">What's inside the PDF:</h2>
            <ul style="color: #a1a1aa; font-size: 14px; margin: 0; padding-left: 20px; line-height: 2;">
              <li>5 Research Agent Prompts (prompts 1-5)</li>
              <li>5 Outreach Agent Prompts (prompts 6-10)</li>
              <li>5 Content Agent Prompts (prompts 11-15)</li>
              <li>5 Operations Agent Prompts (prompts 16-20)</li>
              <li>5 Sales Agent Prompts (prompts 21-25)</li>
              <li>5 Quick-Fire Bonus Prompts (prompts 26-30)</li>
            </ul>
          </div>
          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0;">
              Each prompt has a clear description + a blank space for your version. Print it, fill it in, use it immediately.
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
