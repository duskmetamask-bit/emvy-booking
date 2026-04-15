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

// ── 35 Real Prompts from the Vault ────────────────────────────────────────────
// Prompts 36-50: Add your own based on highest-use workflows

const PROMPTS = [
  {
    category: 'RESEARCH',
    color: [0.047, 0.725, 0.506],
    items: [
      { n: 1, title: 'MARKET RESEARCH', prompt: 'Research [TOPIC] and return:\n1. Market size and growth rate\n2. Top 5 players and their positioning\n3. Key trends driving the market\n4. Underserved customer segments\n5. 3 opportunities for a new entrant\n\nFormat as a structured report. Cite sources. Be specific, not vague.' },
      { n: 2, title: 'COMPETITOR DEEP DIVE', prompt: 'Do a detailed breakdown of [COMPETITOR]. I need:\n- Their core product/service and who it\'s for\n- Their pricing model and any data on conversion\n- Their marketing channels and what\'s working\n- Their weaknesses and where they lose customers\n- 5 things I could do better or differently\n\nUse only real data from their website, reviews, and public sources.' },
      { n: 3, title: 'TECH STACK AUDIT', prompt: 'Analyse the technology stack of [COMPANY/WEBSITE]. Identify:\n- What tools and platforms they\'re using\n- Any AI or automation in their stack\n- Their likely monthly tool spend\n- Gaps where they\'re probably wasting time or money\n- Specific opportunities to automate or improve\n\nBe specific with tool names. No guessing.' },
      { n: 4, title: 'REDDIT SENTIMENT ANALYSIS', prompt: 'Search Reddit and forums for real opinions about [PRODUCT/SERVICE/TOPIC].\nReturn:\n- 10 most upvoted complaints\n- 10 most upvoted praise points\n- Common misconceptions people have\n- The #1 thing people wish was different\n- Verbatim quotes I can use for copy (with source)\n\nBe honest about sentiment. Don\'t cherry-pick.' },
      { n: 5, title: 'DAILY NEWS BRIEF', prompt: 'Act as my analyst. For [INDUSTRY/NICHE] today:\n1. 3 most important news items (with source links)\n2. What each means for my business\n3. One action I should take based on this\n\nKeep it under 200 words. Prioritise signal over noise.' },
    ],
  },
  {
    category: 'OUTREACH',
    color: [0.231, 0.510, 0.965],
    items: [
      { n: 6, title: 'COLD EMAIL', prompt: 'Write a cold email for [COMPANY].\nContext: [1-2 SENTENCES ABOUT THEIR BUSINESS OR RECENT ACTIVITY].\nGoal: Get a 15-minute discovery call.\nTone: Direct, no fluff, pattern-interrupting.\nLength: Under 100 words.\nInclude: Subject line, preview text, body, sign-off.\n\nDon\'t use: "I hope this email finds you", "I wanted to reach out", generic AI references.' },
      { n: 7, title: 'LINKEDIN OUTREACH', prompt: 'Write a LinkedIn connection request for [PERSON].\nContext: [THEIR ROLE, COMPANY, OR RECENT POST].\nGoal: Start a conversation that leads to a call.\nLength: Under 150 characters (LinkedIn limit).\n\nBe specific. Not: "I\'d love to connect." Yes: "Saw your post on [TOPIC] — your take on [SPECIFIC THING] is different from most. Would love to chat."' },
      { n: 8, title: 'FOLLOW-UP SEQUENCE', prompt: 'Write a 3-email follow-up sequence for someone who opened my first email but didn\'t reply.\nEmail 1 (Day 4): Acknowledge without pressure\nEmail 2 (Day 8): Add new value or angle\nEmail 3 (Day 14): Final close or transfer to nurture\n\nEach under 80 words. Conversational tone. No attachments.' },
      { n: 9, title: 'WARM INTRO EMAIL', prompt: 'Write an intro email for me to send to [RECIPIENT] on behalf of [SENDER].\nContext: [SENDER\'S SITUATION AND WHY THEY\'RE INTERESTED IN TALKING TO ME].\nGoal: Make the introduction feel natural, not transactional.\nLength: Under 80 words.' },
      { n: 10, title: 'EMAIL PERSONALISATION AT SCALE', prompt: 'Given this data about [COMPANY]:\n- [BULLET: 1-2 SENTENCES OF RESEARCH]\n- [BULLET: RECENT ACTIVITY OR POST]\n- [BULLET: THEIR PAIN POINT]\n\nWrite 5 personalised opening lines for cold emails. Each must reference something specific — not generic praise.' },
    ],
  },
  {
    category: 'CONTENT',
    color: [0.545, 0.361, 0.965],
    items: [
      { n: 11, title: 'X/TWITTER THREAD', prompt: 'Write a [NUMBER]-tweet thread on [TOPIC] in the "Shut Up and Build" voice.\n- Hook in tweet 1 (pattern interrupt, not a question)\n- Tweet 2: The core insight (the "so what")\n- Tweets 3-6: Supporting points with examples or data\n- Final tweet: CTA or question to drive engagement\n\nTone: Direct, no corporate language, dry wit allowed.\nNo hashtags in the body. Keep each tweet under 200 characters.' },
      { n: 12, title: 'LINKEDIN POST', prompt: 'Write a LinkedIn post on [TOPIC].\n- First line: Must stop the scroll (controversial take, bold claim, or specific number)\n- Body: 3-4 paragraphs, conversational, no jargon\n- End: A question that drives comments OR a soft CTA\n\nLength: 150-300 words. No bullet points in the body.\nTone: Thoughtful founder, not corporate.' },
      { n: 13, title: 'BLOG OUTLINE', prompt: 'Create a detailed outline for a blog post: "[EXACT TITLE]".\nFormat:\n- Hook (why this matters right now)\n- 5-7 H2 sections with 2-3 sub-points each\n- Each section: what to cover, what NOT to cover\n- Conclusion: what the reader does next\n\nInclude a meta-description (under 155 chars) and 3 suggested title variants.' },
      { n: 14, title: 'YOUTUBE DESCRIPTION', prompt: 'Write a YouTube video description for: [VIDEO TITLE AND TOPIC].\nInclude:\n- First 150 chars: Hook that sells the video (no "in this video")\n- 5 bullet timestamps with cliffhangers\n- Key links and resources mentioned\n- CTA to subscribe (non-generic)\n- 5 relevant hashtags (not the obvious ones)\n\nTone: Helpful, direct, not salesy.' },
      { n: 15, title: 'NEWSLETTER ISSUE', prompt: 'Write a weekly newsletter issue for [AUDIENCE].\nTheme: [WHETHER IT\'S CURATED NEWS, A DEEP DIVE, OR PERSONAL UPDATE]\nSections:\n1. Opening hook (1 paragraph, personal voice)\n2. Main content (curated or original)\n3. One tool, tip, or resource worth knowing\n4. What\'s next / closing thought\n\nLength: 400-600 words. Include subject line and preview text.' },
    ],
  },
  {
    category: 'ANALYSIS',
    color: [0.937, 0.267, 0.267],
    items: [
      { n: 16, title: 'BUSINESS METRICS AUDIT', prompt: 'Review this data for [COMPANY/PROJECT]:\n[PASTE DATA: revenue, costs, traffic, conversion rates, etc.]\n\nIdentify:\n1. The most alarming metric (why it\'s a problem)\n2. The most promising metric (how to exploit it)\n3. The single most impactful thing to fix first\n4. Quick wins (things that cost little but move the needle)\n\nBe brutally specific. No "worth looking into" — say exactly what to do.' },
      { n: 17, title: 'DECISION ANALYSIS', prompt: 'Help me decide: [YES/NO DECISION — e.g. "Should I hire a VA?"]\n\nArguments for:\n- [LIST]\n\nArguments against:\n- [LIST]\n\nWhat I\'m assuming (that might be wrong):\n- [LIST]\n\nWhat someone who made this decision and regretted it would say:\n- [LIST]\n\nWhat someone who made this and was glad would say:\n- [LIST]\n\nYour recommendation and why (be direct, don\'t hedge):' },
      { n: 18, title: 'PRICING STRATEGY', prompt: 'Analyse my current pricing for [PRODUCT/SERVICE]:\nCurrent price: $[AMOUNT]\nCompetitors charge: $[RANGE]\nMy costs: $[APPROXIMATE]\n\nQuestions:\n1. Am I underpriced or overpriced relative to value delivered?\n2. What price point would maximise revenue without losing too many customers?\n3. What\'s the strongest objection to a price increase?\n4. How should I frame the price to justify it?\n\nBe direct. Tell me if I\'m leaving money on the table.' },
      { n: 19, title: 'TRAFFIC DROP DIAGNOSIS', prompt: 'My [WEBSITE/CHANNEL] traffic dropped by [X%] over the past [TIMEFRAME].\nPossible causes:\n- [LIST ANY CHANGES YOU MADE OR SUSPECT]\n\nWhat actually happened and what to do about it.' },
      { n: 20, title: 'RISK ASSESSMENT', prompt: 'I\'m considering [ACTION/DECISION].\nRun a risk assessment covering:\n1. What\'s the worst case? (Be specific, not "it could fail")\n2. How likely is the worst case? (1-10)\n3. What\'s the upside if it works?\n4. How do I reduce the downside?\n5. Should I do this? Yes/no with reasoning.\n\nBe blunt. I don\'t want reassurance, I want accuracy.' },
    ],
  },
  {
    category: 'CODING/BUILD',
    color: [0.961, 0.620, 0.043],
    items: [
      { n: 21, title: 'SCRIPT SPEC', prompt: 'I need to build [WHAT IT DOES].\nRequirements:\n- [SPECIFIC FUNCTIONALITY]\n- [INPUTS AND OUTPUTS]\n- [TECH STACK IF RELEVANT]\n\nWrite a full specification for this before writing any code. Include:\n- User stories\n- Data flow\n- Edge cases\n- Success criteria\n\nFormat as a README.md.' },
      { n: 22, title: 'CODE REVIEW', prompt: 'Review this code and identify:\n1. Bugs or security issues (with severity)\n2. Performance problems\n3. Code quality issues\n4. One thing done really well\n\n[PASTE CODE]\n\nReturn a prioritised list of issues. Be specific about what\'s wrong and where.' },
      { n: 23, title: 'API INTEGRATION PLAN', prompt: 'I want to connect [SERVICE A] to [SERVICE B].\nUse case: [WHAT THIS ACHIEVES]\nMy technical level: [NON-TECHNICAL / CAN READ CODE / CAN BUILD / CAN DEBUG]\n\nExplain:\n1. How the integration works (simple terms)\n2. What I need to set it up\n3. Estimated time to implement\n4. Any tools or services that make this easier\n\nFormat as a step-by-step even non-technical people can follow.' },
      { n: 24, title: 'NO-CODE TOOL RECOMMENDATION', prompt: 'I need to automate: [DESCRIBE THE WORKFLOW]\nCurrent setup: [WHAT TOOLS YOU\'RE USING]\nBudget: $[AMOUNT/MONTH]\nTechnical ability: [LEVEL]\n\nRecommend the best no-code or low-code tool for this specific use case.\nInclude:\n- Why this tool and not alternatives\n- What it costs\n- One limitation to know about\n- A rough implementation time estimate' },
      { n: 25, title: 'DEBUG REQUEST', prompt: 'I\'m getting this error:\n[PASTE ERROR]\n\nThe code is at [GITHUB LINK OR PASTE]\nI tried: [WHAT YOU\'VE ALREADY ATTEMPTED]\nEnvironment: [TECH CONTEXT]\n\nWhat\'s wrong and how do I fix it? Be specific.' },
    ],
  },
  {
    category: 'OPERATIONS',
    color: [0.047, 0.725, 0.506],
    items: [
      { n: 26, title: 'SOP WRITER', prompt: 'Write a Standard Operating Procedure (SOP) for: [TASK NAME].\nFormat:\n1. Objective — one sentence on what this process achieves\n2. When to use it — trigger or context\n3. Step-by-step instructions (numbered, action-verb first)\n4. Decision points — what to do if [COMMON ISSUE]\n5. What "done" looks like — quality check\n\nMake it readable in 3 minutes. An intern should be able to follow this without asking questions.' },
      { n: 27, title: 'MEETING NOTES TO ACTION ITEMS', prompt: 'Convert these meeting notes into:\n1. 3-5 prioritised action items (who does what, by when)\n2. Decisions made (with rationale)\n3. Open questions still outstanding\n4. One thing to escalate if unresolved by next meeting\n\n[PASTE MEETING NOTES]\n\nBe specific. "Follow up" is not an action item. "Email [person] by Friday re: [topic]" is.' },
      { n: 28, title: 'EMAIL INBOX ZERO SYSTEM', prompt: 'Design an inbox zero system for my workflow.\nMy situation:\n- [NUMBER] emails/day average\n- [YOUR ROLE — founder/executive/ops]\n- Biggest inbox problem: [TOO MANY / NO PRIORITY / NEWSLETTERS / CLIENT EMAILS]\n\nCreate:\n1. A folder structure\n2. A daily processing routine (under 30 minutes)\n3. Rules/filters to set up\n4. What to do with each category of email\n\nKeep it practical. I don\'t want a complicated system.' },
      { n: 29, title: 'WEEKLY REVIEW TEMPLATE', prompt: 'Design a 30-minute weekly review for [YOUR ROLE/GOALS].\nInclude:\n1. What to measure this week\n2. 5 questions to answer\n3. What to decide vs. what to delegate\n4. What to carry forward vs. what to drop\n5. The one thing that matters most next week\n\nFormat as a checklist. Under 30 minutes to complete.' },
      { n: 30, title: 'PROJECT KICKOFF BRIEF', prompt: 'Create a project kickoff brief for: [PROJECT NAME].\nInclude:\n1. Why we\'re doing this (one sentence, be honest)\n2. Success criteria (specific, measurable)\n3. Who\'s involved and who\'s accountable\n4. Timeline and milestones\n5. What could go wrong and how we\'ll know early\n6. How we\'ll communicate (channels and frequency)\n\nFormat as a one-pager. Maximum 1 page.' },
    ],
  },
  {
    category: 'BONUS — HIGHEST ROI',
    color: [0.545, 0.361, 0.965],
    items: [
      { n: 31, title: 'FIRST DRAFT DISSECTOR', prompt: 'Take this first draft of [TYPE OF CONTENT] and tell me:\n1. Does it have a clear point? (If not, what\'s missing?)\n2. Is the first line strong enough to hook?\n3. Is it longer than it needs to be? (Cut 20% is usually right)\n4. Does the ending justify the opening?\n5. One specific thing that would make it 10x better\n\n[PASTE DRAFT]\n\nBe brutal. Don\'t tell me it\'s "pretty good." Find what\'s wrong.' },
      { n: 32, title: 'IDEA STRESS TEST', prompt: 'I\'m thinking of [IDEA/PLAN].\nStress test it hard. For each:\n- What could make this fail?\n- Who has tried this before and how did it go?\n- What\'s the 80/20 version that takes 20% of the effort?\n- What am I not seeing?\n\nGive me your real assessment, not validation.' },
      { n: 33, title: 'EXPLAIN LIKE I\'M 5', prompt: 'Explain [COMPLEX TOPIC] to me like I\'m a smart 10-year-old.\nInclude:\n- One analogy that makes it click\n- Why I should care\n- One thing most people get wrong about it\n- What to Google to learn more\n\n[TOPIC]:' },
      { n: 34, title: 'MORNING DECISION FILTER', prompt: 'I have [NUMBER] things to do today. I can only do [NUMBER].\nThings:\n[LIST]\n\nApply this filter:\n1. Which has the highest leverage on my real goal?\n2. Which will I regret not doing?\n3. Which can someone else do?\n4. Which should I kill entirely?\n\nGive me a prioritised list and tell me what to cut.' },
      { n: 35, title: 'EXIT INTERVIEW ANALYST', prompt: '[EMPLOYEE NAME] just left. Exit interview notes:\n[PASTE NOTES]\n\nTell me:\n1. What actually went wrong (not what\'s on the surface)\n2. Was this preventable?\n3. What do I change so this doesn\'t happen again?\n4. Should I backfill this role or restructure?\n\nBe honest about my part in this.' },
    ],
  },
]

const PAGE_W = 595
const PAGE_H = 842
const MARGIN = 55
const CONTENT_W = PAGE_W - MARGIN * 2
const EMVY = rgb(0.047, 0.725, 0.506)
const DARK = rgb(0.08, 0.08, 0.10)
const GRAY = rgb(0.40, 0.40, 0.44)
const LIGHT = rgb(0.75, 0.75, 0.78)
const LINE = 13

async function generatePDF(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helvB = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let page = pdfDoc.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN

  function newPage() {
    page = pdfDoc.addPage([PAGE_W, PAGE_H])
    y = PAGE_H - MARGIN
  }

  function checkPage(h: number) {
    if (y - h < MARGIN) newPage()
  }

  function drawText(text: string, x: number, size: number, font: any, color: any) {
    page.drawText(text, { x, y, size, font, color })
  }

  function textWidth(text: string, size: number, font: any) {
    return font.widthOfTextAtSize(text, size)
  }

  function centered(text: string, size: number, font: any, color: any, yOffset = 0) {
    const w = textWidth(text, size, font)
    page.drawText(text, { x: (PAGE_W - w) / 2, y: y + yOffset, size, font, color })
  }

  // ── Cover ──────────────────────────────────────────────────────
  centered('50 AI AGENT PROMPTS', 30, helvB, EMVY, 0)
  y -= 46
  centered('THE SHUT UP AND BUILD PACK', 13, helv, GRAY, 0)
  y -= 50

  for (const line of [
    '50 working prompts for OpenClaw, Claude,',
    'ChatGPT, and any AI agent framework.',
    'Copy, paste, and deploy immediately.',
  ]) {
    centered(line, 10, helv, GRAY, 0)
    y -= 16
  }
  y -= 16
  centered('emvy.ai', 12, helvB, DARK, 0)
  y -= 50

  for (const line of ['EMVY — AI Audit Agency — Perth, Australia', 'hello@emvy.ai']) {
    centered(line, 9, helv, LIGHT, 0)
    y -= 13
  }

  // ── TOC ───────────────────────────────────────────────────────
  newPage()
  centered('Contents', 18, helvB, EMVY, 0)
  y -= 36

  for (const cat of PROMPTS) {
    const [r, g, b] = cat.color
    page.drawText(cat.category, { x: MARGIN, y, size: 10, font: helvB, color: rgb(r, g, b) })
    y -= 14
    for (const p of cat.items) {
      page.drawText(`${p.n}. ${p.title}`, { x: MARGIN + 16, y, size: 8.5, font: helv, color: GRAY })
      y -= 12
    }
    y -= 8
  }

  y -= 10
  page.drawText('36–50: ADD YOUR OWN based on highest-use workflows', { x: MARGIN + 16, y, size: 8.5, font: helv, color: LIGHT })

  // ── Prompt Pages ─────────────────────────────────────────────
  for (const cat of PROMPTS) {
    for (const p of cat.items) {
      newPage()
      const [r, g, b] = cat.color

      // Category + number
      page.drawText(`${cat.category}  \u2022  PROMPT ${p.n}`, { x: MARGIN, y, size: 7.5, font: helvB, color: rgb(r, g, b) })
      y -= 20

      // Title
      page.drawText(p.title, { x: MARGIN, y, size: 16, font: helvB, color: DARK })
      y -= 20

      // Prompt text — split by newlines
      const lines = p.prompt.split('\n')
      for (const raw of lines) {
        checkPage(LINE + 4)
        const stripped = raw.replace(/^\s+|\s+$/g, '')
        if (stripped === '') {
          y -= 6
          continue
        }
        // Indent handling
        const indent = raw.startsWith(' ') ? 14 : 0
        const x = MARGIN + indent

        // Bold the "Arguments for/against", headers
        const isHeader = /^(Arguments|For|Against|What|Your|\d+\.)/.test(stripped) && stripped.length < 60
        const font = isHeader ? helvB : helv
        const size = isHeader ? 9 : 9
        const color = isHeader ? DARK : GRAY

        page.drawText(stripped, { x, y, size, font, color })
        y -= LINE
      }

      y -= 12

      // YOUR VERSION box
      checkPage(90)
      page.drawText('YOUR VERSION', { x: MARGIN, y, size: 8, font: helvB, color: LIGHT })
      y -= 12
      page.drawRectangle({
        x: MARGIN, y: y - 65,
        width: CONTENT_W, height: 65,
        borderColor: LIGHT, borderWidth: 0.5,
      })
      y -= 85

      // Footer
      page.drawText('EMVY — emvy.ai', { x: MARGIN, y, size: 7.5, font: helv, color: LIGHT })
      const numTxt = `${p.n} of 35`
      page.drawText(numTxt, { x: PAGE_W - MARGIN - textWidth(numTxt, 7.5, helv), y, size: 7.5, font: helv, color: LIGHT })
    }
  }

  // ── Custom Prompts Page (36-50) ───────────────────────────────
  newPage()
  const [r, g, b] = [0.4, 0.4, 0.44]
  page.drawText('CUSTOM PROMPTS  \u2022  36\u201350', { x: MARGIN, y, size: 7.5, font: helvB, color: rgb(r, g, b) })
  y -= 22
  page.drawText('Add your own based on highest-use workflows.', { x: MARGIN, y, size: 14, font: helvB, color: DARK })
  y -= 18
  page.drawText('The best prompt packs are built from what\'s actually broken in your business \u2014 not what\'s generic.', { x: MARGIN, y, size: 9.5, font: helv, color: GRAY })
  y -= 30

  for (let n = 36; n <= 50; n++) {
    checkPage(80)
    page.drawText(`${n}. `, { x: MARGIN, y, size: 9, font: helvB, color: LIGHT })
    y -= 14
    page.drawRectangle({
      x: MARGIN, y: y - 40,
      width: CONTENT_W, height: 40,
      borderColor: LIGHT, borderWidth: 0.5,
    })
    y -= 55
  }

  // ── CTA Page ──────────────────────────────────────────────────
  newPage()
  centered('Want more?', 22, helvB, EMVY, 40)
  y -= 70
  for (const line of [
    'These prompts are what we use daily at EMVY.',
    'We build AI automation for service businesses.',
  ]) {
    centered(line, 10.5, helv, GRAY, 0)
    y -= 17
  }
  y -= 24
  centered('Book an AI Audit \u2014 $1,500', 13, helvB, DARK, 0)
  y -= 30
  for (const line of ['emvy.ai', 'hello@emvy.ai']) {
    centered(line, 10, helv, GRAY, 0)
    y -= 15
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

    const pdfBytes = await generatePDF()

    await transporter.sendMail({
      from: '"EMVY — Shut Up and Build" <dawnlabsai@gmail.com>',
      to: email,
      subject: 'Your 50 AI Agent Prompts — Shut Up and Build Pack',
      text: `Your 50 AI Agent Prompts are attached as a PDF.\n\nDownload it, print it, fill it in, and start using these prompts today.\n\nEMVY — AI Audit Agency\nemvy.ai\nhello@emvy.ai`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #030307; color: #f4f4f5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; line-height: 48px; font-size: 24px; color: white; font-weight: bold;">E</div>
            <h1 style="color: #10b981; font-size: 24px; margin: 16px 0 8px;">Your 50 prompts are ready.</h1>
            <p style="color: #71717a; font-size: 14px; margin: 0;">PDF attached. Print it, fill it in, start building.</p>
          </div>
          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 16px; margin: 0 0 12px;">6 categories inside:</h2>
            <ul style="color: #a1a1aa; font-size: 14px; margin: 0; padding-left: 20px; line-height: 2;">
              <li>Research (prompts 1–5)</li>
              <li>Outreach (prompts 6–10)</li>
              <li>Content (prompts 11–15)</li>
              <li>Analysis (prompts 16–20)</li>
              <li>Coding/Build (prompts 21–25)</li>
              <li>Operations (prompts 26–30)</li>
              <li>Bonus — Highest ROI (prompts 31–35)</li>
              <li>Custom templates — add your own (prompts 36–50)</li>
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
