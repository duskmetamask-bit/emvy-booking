import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dawnlabsai@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'jhyqagjhlvabdubi',
  },
})

function buildCalComLink(name: string, email: string, company: string, goal: string): string {
  const calLink = process.env.NEXT_PUBLIC_CAL_COM_LINK || 'https://cal.com/jake-emvy/30min'
  const params = new URLSearchParams({
    email,
    name,
    ...(company && { customAnswers: JSON.stringify({ '1': company }) }),
  })
  return `${calLink}?${params.toString()}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, goal, date, time, timezone, submittedAt } = body

    if (!name || !email || !goal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Build Cal.com prefill booking link
    const calComLink = buildCalComLink(name, email, company || '', goal)

    // Send confirmation to the person who booked
    await transporter.sendMail({
      from: '"EMVY" <dawnlabsai@gmail.com>',
      to: email,
      subject: `Your AI audit discovery call — ${date} at ${time}`,
      text: `You're confirmed!\n\nWe have your booking:\nDate: ${date}\nTime: ${time} ${timezone || 'AWST'}\nWith: Dusk — EMVY\n\nNext step: click the link below to lock in your time on my calendar.\n\n${calComLink}\n\nWhen you book, you'll get a video call link sent straight from my calendar.\n\nSee you soon,\nDusk\nEMVY — AI Audit Agency\ndawnlabsai@gmail.com`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #030307; color: #f4f4f5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; line-height: 48px; font-size: 24px; color: white; font-weight: bold;">E</div>
            <h1 style="color: #10b981; font-size: 24px; margin: 16px 0 0;">You're confirmed.</h1>
            <p style="color: #71717a; font-size: 14px; margin-top: 8px;">One more step to lock in your time.</p>
          </div>

          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 18px; margin: 0 0 16px;">Your Request</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #71717a; font-size: 14px;">Name</td><td style="padding: 8px 0; color: white; font-size: 14px; text-align: right;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a; font-size: 14px;">Company</td><td style="padding: 8px 0; color: white; font-size: 14px; text-align: right;">${company || '—'}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a; font-size: 14px;">Requested</td><td style="padding: 8px 0; color: white; font-size: 14px; text-align: right;">${date} at ${time} ${timezone || 'AWST'}</td></tr>
            </table>
          </div>

          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 18px; margin: 0 0 8px;">What you told us</h2>
            <p style="color: #a1a1aa; font-size: 14px; margin: 0; line-height: 1.6;">"${goal}"</p>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${calComLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">Book My Call →</a>
            <p style="color: #52525b; font-size: 12px; margin-top: 12px;">Takes 30 seconds. You'll get a video call link instantly.</p>
          </div>

          <div style="border-top: 1px solid #1a1a25; padding-top: 24px; text-align: center;">
            <p style="color: #52525b; font-size: 12px;">EMVY — AI Audit Agency — Perth, Australia<br>dawnlabsai@gmail.com</p>
          </div>
        </div>
      `,
    })

    // Also notify EMVY team
    await transporter.sendMail({
      from: '"EMVY Booking" <dawnlabsai@gmail.com>',
      to: 'dawnlabsai@gmail.com',
      subject: `New booking request — ${name} from ${company || 'no company'}`,
      text: `New EMVY booking request!\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\nRequested: ${date} at ${time} ${timezone || 'AWST'}\n\nGoal:\n${goal}\n\nCal.com link (prefilled):\n${calComLink}\n\nSubmitted: ${submittedAt || new Date().toISOString()}`,
      html: `<p><strong>New EMVY booking request!</strong></p><p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Company:</strong> ${company || '—'}<br><strong>Requested:</strong> ${date} at ${time}<br><strong>Timezone:</strong> ${timezone || 'AWST'}</p><p><strong>Goal:</strong><br>${goal}</p><p><a href="${calComLink}">Book on Cal.com →</a></p>`,
    })

    return NextResponse.json({
      success: true,
      message: 'Booking request received. Check your email to confirm your time.',
      calComLink,
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to process booking. Please email us at dawnlabsai@gmail.com' }, { status: 500 })
  }
}
