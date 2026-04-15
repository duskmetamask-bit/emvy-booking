import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

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
    colorRgb: [0.047, 0.725, 0.506],
    prompts: [
      { n: 1, title: 'MARKET RESEARCH', desc: 'Research the AI writing software market for a solo founder considering entry. Return: market size + CAGR, top 5 players, 2 trends a new entrant can ride, most underserved segment, one specific gap. Cite sources. Under 600 words.' },
      { n: 2, title: 'COMPETITOR DEEP DIVE', desc: 'Break down [COMPETITOR]: what their AI does, pricing tiers, 3 most common G2/AppStore complaints with exact quotes, what users praise, retention strategy. Tell me the price point to undercut them.' },
      { n: 3, title: 'TECH STACK AUDIT', desc: 'Audit my tool stack for AI integration opportunities. Where can AI reduce manual work right now? Lowest-effort automation I could build this week? Highest-ROI automation for a solo operator? 3-item priority list with time estimates.' },
      { n: 4, title: 'CUSTOMER INTERVIEW SCRIPTER', desc: "Generate 10 open-ended discovery questions for [CUSTOMER TYPE]. Uncover: biggest workflow frustration, what they tried, what they'd pay, why unsolved. Warm intro + hard-hitting questions toward the end." },
      { n: 5, title: 'REDDIT SENTIMENT ANALYSIS', desc: 'Find 20 Reddit posts in [SUBREDDIT] about [TOPIC]. 3 most common complaints/desires, exact phrases customers use (for marketing), what solutions they\'re using and what\'s broken, emerging niches.' },
    ],
  },
  {
    name: 'OUTREACH',
    colorRgb: [0.231, 0.510, 0.965],
    prompts: [
      { n: 6, title: 'COLD EMAIL — GENERAL', desc: 'Write a cold email to [PERSON/TYPE] about [OFFER]. Subject line + 3 alternatives, 150-word conversational body, one clear CTA, signature line.' },
      { n: 7, title: 'COLD EMAIL — PERSONALISED', desc: 'Write a personalised cold email using: their name, company, industry, pain point, what I\'m offering, my credibility. Subject, 150-word body, CTA.' },
      { n: 8, title: 'LINKEDIN OUTREACH', desc: 'Write a LinkedIn connection request to [PERSON]: personalised opener referencing their profile/post, 2-sentence value prop, soft CTA (not "book a call"). Under 300 characters. Include optional follow-up.' },
      { n: 9, title: 'FOLLOW-UP SEQUENCE', desc: "Write a 3-email follow-up sequence for [PROSPECT] who didn't respond. Day 3: reminder. Day 7: value add (something genuinely useful). Day 14: breakup email with urgency. 100-150 words each. Direct, not pushy." },
      { n: 10, title: 'WARM INTRODUCTION EMAIL', desc: "Write an email to [MUTUAL CONNECTION] asking for an intro to [RECIPIENT]. Context: why this intro makes sense + what I offer. Plus the actual forwardable intro email they can send directly." },
    ],
  },
  {
    name: 'CONTENT',
    colorRgb: [0.545, 0.361, 0.965],
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
    colorRgb: [0.961, 0.620, 0.043],
    prompts: [
      { n: 16, title: 'PROCESS DOCUMENTATION', desc: 'Document my current workflow for [TASK] step by step. Format: numbered steps, time estimates per step, tools used, common failure points, how to recover. For a new team member or AI agent picking this up.' },
      { n: 17, title: 'SOP WRITING', desc: 'Write a Standard Operating Procedure for [TASK]: Purpose, Scope, Materials Needed, Step-by-Step Instructions, Quality Checklist, Troubleshooting Guide. For a competent person who\'s never done this specific task.' },
      { n: 18, title: 'ERROR HANDLING GUIDE', desc: "I\'m building an automated workflow for [TASK]. What could go wrong at each step? For each failure: What happens, How to detect, How to fix, How to prevent. Table format: Step | Failure | Detection | Fix | Prevention." },
      { n: 19, title: 'MEETING NOTES TO ACTION ITEMS', desc: "Convert these meeting notes into: Key decisions made, Action items with owners and deadlines, Questions to resolve before next meeting, A 3-sentence executive summary. [PASTE NOTES HERE]" },
      { n: 20, title: 'PROJECT TIMELINE', desc: "Generate a realistic project timeline for [PROJECT TYPE]: phases, milestones, time estimates, dependencies (what must be done before what), buffer for unexpected delays. Working [N] hours/week. Deadline: [DATE]." },
    ],
  },
  {
    name: 'SALES',
    colorRgb: [0.937, 0.267, 0.267],
    prompts: [
      { n: 21, title: 'DISCOVERY CALL QUALIFICATION', desc: "I\'m about to jump on a discovery call with [PROSPECT TYPE]. Give me: 10 qualifying questions, red flags meaning I should not take this client, green flags meaning this is ideal, how to position pricing without underselling, 3 closing techniques." },
      { n: 22, title: 'PROPOSAL OUTLINE', desc: 'Write a proposal outline for [PROJECT] for [CLIENT]: Problem Statement, Proposed Solution, Scope of Work, Timeline, Pricing with payment terms, Guarantees/Risks, CTA. Keep it under 5 pages.' },
      { n: 23, title: 'OBJECTION HANDLING', desc: "Generate responses to these objections for [SERVICE]: (1) \"It's too expensive\", (2) \"I need to think about it\", (3) \"We're already working with someone\", (4) \"Can you do it for free first?\", (5) \"I don't have time right now\". 2-3 sentences each. Reframe, don't argue." },
      { n: 24, title: 'PRICING PAGE COPY', desc: 'Write landing page copy for [SERVICE] at [PRICE]: hero headline + subheadline, 3 benefit bullets, social proof placeholder, FAQ with 5 real objections, urgency element (without being fake), CTA. Audience: [AUDIENCE]. Tone: [TONE].' },
      { n: 25, title: 'REFERRAL REQUEST', desc: "Write a message asking [CLIENT] for a referral. Context: what I did for them, what the result was, why they might know someone who'd benefit. 3 versions: text message, email, in-person talking points." },
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

const MARGIN = 60
const PAGE_W = 595  // A4
const PAGE_H = 842
const CONTENT_W = PAGE_W - MARGIN * 2
const EMVY_GREEN = rgb(0.047, 0.725, 0.506)
const DARK = rgb(0.067, 0.067, 0.090)
const GRAY = rgb(0.4, 0.4, 0.4)
const LIGHT_GRAY = rgb(0.7, 0.7, 0.7)
const LINE_H = 14

function wrapText(text: string, fontSize: number, maxWidth: number, font: any): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    const width = font.widthOfTextAtSize(test, fontSize)
    if (width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

async function generatePromptsPDF(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helvB = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let page = pdfDoc.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN

  function checkPage(needed: number) {
    if (y - needed < MARGIN) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H])
      y = PAGE_H - MARGIN
    }
  }

  function drawFooter(pageNum: number) {
    page.drawText('EMVY — emvy.ai', {
      x: MARGIN, y: 30, size: 8, font: helv, color: LIGHT_GRAY,
    })
    page.drawText(`${pageNum} of 30`, {
      x: PAGE_W - MARGIN - helv.widthOfTextAtSize(`${pageNum} of 30`, 8), y: 30, size: 8, font: helv, color: LIGHT_GRAY,
    })
  }

  // ── Cover ────────────────────────────────────────────────
  const titleW = helvB.widthOfTextAtSize('50 AI AGENT PROMPTS', 32)
  page.drawText('50 AI AGENT PROMPTS', {
    x: (PAGE_W - titleW) / 2, y, size: 32, font: helvB, color: EMVY_GREEN,
  })
  y -= 50

  const subW = helv.widthOfTextAtSize('THE SHUT UP AND BUILD PACK', 14)
  page.drawText('THE SHUT UP AND BUILD PACK', {
    x: (PAGE_W - subW) / 2, y, size: 14, font: helv, color: GRAY,
  })
  y -= 60

  const lines1 = [
    '50 working prompts for OpenClaw, Claude,',
    'ChatGPT, and any AI agent framework.',
    'Copy, paste, and deploy immediately.',
  ]
  for (const l of lines1) {
    const w = helv.widthOfTextAtSize(l, 10)
    page.drawText(l, { x: (PAGE_W - w) / 2, y, size: 10, font: helv, color: GRAY })
    y -= 16
  }
  y -= 20

  const emvyW = helvB.widthOfTextAtSize('emvy.ai', 12)
  page.drawText('emvy.ai', { x: (PAGE_W - emvyW) / 2, y, size: 12, font: helvB, color: DARK })
  y -= 60

  const footLines = ['EMVY — AI Audit Agency — Perth, Australia', 'hello@emvy.ai']
  for (const fl of footLines) {
    const fw = helv.widthOfTextAtSize(fl, 9)
    page.drawText(fl, { x: (PAGE_W - fw) / 2, y, size: 9, font: helv, color: LIGHT_GRAY })
    y -= 13
  }

  // ── TOC ──────────────────────────────────────────────────
  page = pdfDoc.addPage([PAGE_W, PAGE_H])
  y = PAGE_H - MARGIN
  const tocTitleW = helvB.widthOfTextAtSize('Contents', 20)
  page.drawText('Contents', { x: (PAGE_W - tocTitleW) / 2, y, size: 20, font: helvB, color: EMVY_GREEN })
  y -= 40

  for (const cat of CATEGORIES) {
    page.drawText(cat.name, { x: MARGIN, y, size: 11, font: helvB, color: DARK })
    y -= 16
    for (const p of cat.prompts) {
      page.drawText(`Prompt ${p.n}: ${p.title}`, { x: MARGIN + 20, y, size: 9, font: helv, color: GRAY })
      y -= 13
    }
    y -= 10
  }

  page.drawText('Bonus: Quick-Fire Prompts 26–30', { x: MARGIN + 20, y, size: 9, font: helv, color: GRAY })
  y -= 30
  page.drawText(`EMVY — emvy.ai`, { x: MARGIN, y, size: 8, font: helv, color: LIGHT_GRAY })

  // ── Prompt Pages ─────────────────────────────────────────
  let promptPageNum = 1
  for (const cat of CATEGORIES) {
    for (const p of cat.prompts) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H])
      y = PAGE_H - MARGIN

      const [cr, cg, cb] = cat.colorRgb
      const catColor = rgb(cr, cg, cb)
      page.drawText(`${cat.name}  •  PROMPT ${p.n}`, { x: MARGIN, y, size: 8, font: helvB, color: catColor })
      y -= 22

      const titleW2 = helvB.widthOfTextAtSize(p.title, 17)
      page.drawText(p.title, { x: MARGIN, y, size: 17, font: helvB, color: DARK })
      y -= 24

      const descLines = wrapText(p.desc, 10, CONTENT_W, helv)
      for (const dl of descLines) {
        page.drawText(dl, { x: MARGIN, y, size: 10, font: helv, color: GRAY })
        y -= LINE_H
      }
      y -= 20

      page.drawText('YOUR VERSION', { x: MARGIN, y, size: 9, font: helv, color: LIGHT_GRAY })
      y -= 14

      // Box
      page.drawRectangle({
        x: MARGIN, y: y - 80,
        width: CONTENT_W, height: 80,
        borderColor: LIGHT_GRAY, borderWidth: 0.5,
      })
      y -= 100

      drawFooter(promptPageNum)
      promptPageNum++
    }
  }

  // ── Bonus Page ──────────────────────────────────────────
  page = pdfDoc.addPage([PAGE_W, PAGE_H])
  y = PAGE_H - MARGIN

  page.drawText('BONUS  •  QUICK-FIRE PROMPTS', { x: MARGIN, y, size: 8, font: helvB, color: rgb(0.961, 0.620, 0.043) })
  y -= 25
  page.drawText('5 Quick-Fire Prompts', { x: MARGIN, y, size: 17, font: helvB, color: DARK })
  y -= 30

  for (const bp of BONUS) {
    const ql = wrapText(`${bp.n}. ${bp.q}`, 10, CONTENT_W, helvB)
    for (const ql1 of ql) {
      page.drawText(ql1, { x: MARGIN, y, size: 10, font: helvB, color: DARK })
      y -= 14
    }
    y -= 4
    page.drawText('Your answer:', { x: MARGIN + 10, y, size: 9, font: helv, color: LIGHT_GRAY })
    y -= 80

    checkPage(0)
  }

  // ── CTA Page ─────────────────────────────────────────────
  page = pdfDoc.addPage([PAGE_W, PAGE_H])
  y = PAGE_H / 2 + 40

  const wantW = helvB.widthOfTextAtSize('Want more?', 24)
  page.drawText('Want more?', { x: (PAGE_W - wantW) / 2, y, size: 24, font: helvB, color: EMVY_GREEN })
  y -= 40

  const ctaLines = [
    'These prompts are what we use daily at EMVY.',
    'We build AI automation for service businesses.',
  ]
  for (const cl of ctaLines) {
    const cw = helv.widthOfTextAtSize(cl, 11)
    page.drawText(cl, { x: (PAGE_W - cw) / 2, y, size: 11, font: helv, color: GRAY })
    y -= 17
  }
  y -= 30

  const auditW = helvB.widthOfTextAtSize('Book an AI Audit — $1,500', 14)
  page.drawText('Book an AI Audit — $1,500', { x: (PAGE_W - auditW) / 2, y, size: 14, font: helvB, color: DARK })
  y -= 25

  for (const fl of ['emvy.ai', 'hello@emvy.ai']) {
    const fw = helv.widthOfTextAtSize(fl, 10)
    page.drawText(fl, { x: (PAGE_W - fw) / 2, y, size: 10, font: helv, color: GRAY })
    y -= 14
  }

  return pdfDoc.save()
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

    const pdfBytes = await generatePromptsPDF()

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
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://emvy-booking.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Book an AI Audit — $1,500</a>
          </div>
          <p style="color: #52525b; font-size: 12px; text-align: center; margin: 0;">EMVY — AI Audit Agency — Perth, Australia<br>dawnlabsai@gmail.com</p>
        </div>
      `,
      attachments: [
        {
          filename: '50-AI-Agent-Prompts-SHUT-UP-AND-BUILD.pdf',
          content: Buffer.from(pdfBytes),
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
