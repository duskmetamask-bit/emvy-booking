import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'dawnlabsai@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'wrankndsznzwjiksia',
  },
})

const PROMPTS_CONTENT = `
50 AI AGENT PROMPTS — THE SHUT UP AND BUILD PACK

Here's your 50 working AI agent prompts for OpenClaw, Claude, or any AI agent framework.

---

CATEGORY 1: RESEARCH AGENT PROMPTS

1. MARKET RESEARCH
You are a senior market research analyst. Research the AI writing software market for a solo founder considering entry.

Return:
1. Market size (global, USD) and CAGR for 2024-2028
2. Top 5 players by market share with their primary positioning
3. The 2 trends driving growth that a new entrant can actually ride
4. The most underserved customer segment (specific job-to-be-done)
5. One specific gap in the market that doesn't require a team of 10 to fill

For each section, cite the source (name, publication, date). Format as markdown report. Keep under 600 words.

2. COMPETITOR DEEP DIVE
I want to undercut [COMPETITOR] on price for their AI features. Do a detailed breakdown:
- What exactly does their AI do? List specific features
- What do they charge and for which tiers?
- Where do their G2/AppStore reviews say they're failing? 3 most common complaints (with exact quotes)
- What are users praising most?
- What is their retention strategy?
Then tell me: what price point would force them to respond?

3. TECH STACK AUDIT
My current tool stack is [LIST YOUR TOOLS]. Audit it for AI integration opportunities:
- Where can AI reduce manual work right now?
- What's the lowest-effort automation I could build this week?
- What's the highest-ROI automation for a solo operator?
Give me a 3-item priority list with estimated time to implement each.

4. CUSTOMER INTERVIEW SCRIPTER
Generate 10 open-ended discovery questions for a customer interview with [TYPE OF CUSTOMER].
These questions should uncover: their biggest workflow frustration, what they've tried to fix it, what they'd pay to solve it, and why they haven't solved it yet.
Format as a conversation guide with a warm introduction and hard-hitting questions toward the end.

5. REDDIT SENTIMENT ANALYSIS
Find 20 Reddit posts in [SUBREDDIT] discussing [TOPIC]. Summarise:
- The 3 most common complaints or desires
- Exact phrases customers use (for use in marketing)
- What solutions are they currently using and what's broken about them?
- Any emerging trends or underserved niches

---

CATEGORY 2: OUTREACH AGENT PROMPTS

6. COLD EMAIL — GENERAL
Write a cold email to [PERSON/TYPE] about [OFFER].
- Subject line and 3 alternatives
- 150-word body, conversational tone
- One clear CTA
- Signature line

7. COLD EMAIL — PERSONALISED
Write a personalised cold email using these specifics:
- Their name: [NAME]
- Their company: [COMPANY]
- Their industry: [INDUSTRY]
- Their pain point: [PAIN]
- What I'm offering: [OFFER]
- My credibility: [CREDENTIAL]
Subject, 150-word body, CTA.

8. LINKEDIN OUTREACH
Write a LinkedIn connection request to [PERSON] with:
- Personalised opener referencing something specific about their profile or recent post
- A 2-sentence value proposition
- A soft CTA (not "book a call")
Keep it under 300 characters for the request, with a longer follow-up message option.

9. FOLLOW-UP SEQUENCE
Write a 3-email follow-up sequence for [TYPE OF PROSPECT] who didn't respond to my initial email.
Email 1: Reminder (day 3)
Email 2: Value add (day 7) — add something useful, not "just checking in"
Email 3: Breakup email (day 14) — final chance, create urgency
Each 100-150 words. Tone: direct, not pushy.

10. WARM INTRODUCTION EMAIL
Write an email introducing me to [RECIPIENT] from [MUTUAL CONNECTION].
Context: [WHY THIS INTRODUCTION MAKES SENSE]
I'm offering: [WHAT I OFFER]
Format: email to mutual connection asking for the intro, plus the actual intro email they can forward.

---

CATEGORY 3: CONTENT AGENT PROMPTS

11. X/TWITTER THREAD
Convert this content into a 10-tweet thread: [CONTENT]
Each tweet should: be self-contained, end with a hook for the next tweet, use minimal hashtags, sound like a real person talking.
Include a suggested opening tweet that stops the scroll.

12. BLOG POST OUTLINE
Generate a detailed blog post outline for: [TOPIC]
Include: Hook, 5-7 H2 sections with 2-3 bullet points each, suggested statistics or data points to include, a conclusion with CTA.
Target: [WORD COUNT] words. Audience: [AUDIENCE].

13. VIDEO SCRIPT
Write a [LENGTH]-minute YouTube/video script for: [TOPIC]
Include: 15-second hook, 3-5 key points with examples, a story or case study, call to action.
Format as: [HOST NAME]: [DIALOGUE] with [VISUAL NOTES] cues.

14. NEWSLETTER ISSUE
Write a weekly newsletter for [AUDIENCE] covering:
- 1 major industry development (with my take)
- 1 actionable tip they can use this week
- 1 tool or resource worth knowing about
- 1 personal update or observation
Format: conversational, 400-600 words. Subject line + preview text.

15. GITHUB README
Write a compelling README.md for [PROJECT NAME]: [DESCRIPTION]
Include: Overview, Features, Quick Start, Use Cases, Roadmap, Contributing.
Make it honest — don't oversell. Technical audience but not condescending.

---

CATEGORY 4: OPERATIONS AGENT PROMPTS

16. PROCESS DOCUMENTATION
Document my current workflow for [TASK] step by step.
Format as: numbered steps, time estimates per step, tools used, common failure points, how to recover from failures.
This is for a new team member or AI agent picking up the task.

17. SOP WRITING
Write a Standard Operating Procedure for: [TASK]
Format: Purpose, Scope, Materials Needed, Step-by-Step Instructions, Quality Checklist, Troubleshooting Guide.
This is for a competent person who's never done this specific task before.

18. ERROR HANDLING GUIDE
I'm building an automated workflow for [TASK]. What could go wrong at each step?
For each failure mode, give: What happens, How to detect it, How to fix it, How to prevent it.
Format as a table: Step | Failure Mode | Detection | Fix | Prevention.

19. MEETING NOTES → ACTION ITEMS
Convert these meeting notes into: Key decisions made, Action items with owners and deadlines, Questions to resolve before next meeting, A 3-sentence executive summary.
Meeting notes: [PASTE NOTES HERE]

20. PROJECT TIMELINE
Generate a realistic project timeline for: [PROJECT TYPE]
Include: phases, milestones, time estimates, dependencies (what must be done before what), buffer time for unexpected delays.
I'm working: [NUMBER] hours per week on this.
Deadline: [DATE].

---

CATEGORY 5: SALES AGENT PROMPTS

21. DISCOVERY CALL QUALIFICATION
I'm about to jump on a discovery call with [PROSPECT TYPE]. Give me:
- 10 qualifying questions to ask
- Red flags that mean I should not take this client
- Green flags that mean this is ideal
- How to position my pricing without underselling
- 3 closing techniques appropriate for this prospect type

22. PROPOSAL OUTLINE
Write a proposal outline for: [PROJECT TYPE] for [CLIENT TYPE].
Include: Problem Statement, Proposed Solution, Scope of Work, Timeline, Pricing (with payment terms), Guarantees/Risks, CTA.
Keep it under 5 pages.

23. OBJECTION HANDLING
Generate responses to these common objections for [SERVICE]:
1. "It's too expensive"
2. "I need to think about it"
3. "We're already working with someone"
4. "Can you do it for free first?"
5. "I don't have time right now"

Each response: 2-3 sentences. Reframe the objection, don't argue.

24. PRICING PAGE COPY
Write landing page copy for my [SERVICE] at [PRICE].
Include: Hero headline + subheadline, 3 benefit bullets, social proof placeholder section, FAQ with 5 real objections, urgency element (without being fake), CTA.
Target audience: [AUDIENCE]. Tone: [TONE].

25. REFERRAL REQUEST
Write a message asking [CLIENT] for a referral.
Context: what I did for them, what the result was, why they might know someone who'd benefit.
Format: 3 versions — text message, email, in-person talking points.

---

BONUS: QUICK-FIRE PROMPTS

26. "What's the one thing about [INDUSTRY] that most people miss but is obvious once pointed out?"

27. "Give me 5 names of podcasts in [NICHE] that would be good for a guest appearance."

28. "Write 10 headlines for a [TYPE OF CONTENT] about [TOPIC]. Make them provocative, not clever."

29. "What are the 3 dumbest things people believe about [INDUSTRY/TOPIC] that are completely wrong?"

30. "Draft a 60-second pitch for [YOUR SERVICE] that a 5-year-old would understand."

---

Want more? These prompts are used by the EMVY team daily. We're building AI automation for service businesses in Perth.
www.emvy-booking.vercel.app
`

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

    // Send the prompts to the subscriber
    await transporter.sendMail({
      from: '"EMVY — Shut Up and Build" <dawnlabsai@gmail.com>',
      to: email,
      subject: 'Your 50 AI Agent Prompts — Shut Up and Build Pack',
      text: PROMPTS_CONTENT,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; padding: 40px 20px; background: #030307; color: #f4f4f5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; line-height: 48px; font-size: 24px; color: white; font-weight: bold;">E</div>
            <h1 style="color: #10b981; font-size: 24px; margin: 16px 0 8px;">Your prompts are here.</h1>
            <p style="color: #71717a; font-size: 14px; margin: 0;">50 working AI agent prompts — copy and use immediately.</p>
          </div>

          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 16px; margin: 0 0 12px;">What's inside:</h2>
            <ul style="color: #a1a1aa; font-size: 14px; margin: 0; padding-left: 20px; line-height: 2;">
              <li>5 Research Agent Prompts</li>
              <li>5 Outreach Agent Prompts</li>
              <li>4 Content Agent Prompts</li>
              <li>5 Operations Agent Prompts</li>
              <li>5 Sales Agent Prompts</li>
              <li>10 Quick-Fire Bonus Prompts</li>
            </ul>
          </div>

          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #a1a1aa; font-size: 14px; line-height: 1.8; margin: 0;">
              These prompts are what we use daily at EMVY. They work with OpenClaw, Claude, ChatGPT, or any AI agent framework.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://emvy-booking.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Book an AI Audit — $1,500
            </a>
          </div>

          <p style="color: #52525b; font-size: 12px; text-align: center; margin: 0;">
            EMVY — AI Audit Agency — Perth, Australia<br>
            hello@emvy.ai
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead magnet error:', error)
    return NextResponse.json({ error: 'Something went wrong. Email us at hello@emvy.ai' }, { status: 500 })
  }
}
