import { NextResponse } from 'next/server'

const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY || '93F6F43BA64B92C176FB3AF49D9C6777C4C2FF40B97E2B64935CBB9075BFF9835B399463C71C1991926CDE2CEF57B7A6'
const ELASTIC_API_URL = 'https://api.elasticemail.com/v2/email/send'

async function sendEmail(to: string, subject: string, bodyText: string, bodyHtml: string) {
  const params = new URLSearchParams({
    apiKey: ELASTIC_API_KEY,
    from: 'dawnlabsai@gmail.com',
    fromName: 'EMVY',
    to,
    subject,
    body_text: bodyText,
    body_html: bodyHtml,
  })

  const res = await fetch(`${ELASTIC_API_URL}?${params.toString()}`, {
    method: 'POST',
  })

  const data = await res.json()
  if (!data.success) {
    throw new Error(data.error || 'Failed to send email')
  }
  return data
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

    if (!date || !time) {
      return NextResponse.json({ error: 'Please select a date and time' }, { status: 400 })
    }

    // Send confirmation to the person who booked
    await sendEmail(
      email,
      `Your call is booked — ${date} at ${time}`,
      `You're booked!\n\nDate: ${date}\nTime: ${time} ${timezone || 'AWST'}\nWith: Dusk — EMVY\n\nWhat you told us: "${goal}"\n\nEMVY — AI Audit Agency\ndawnlabsai@gmail.com`,
      `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #030307; color: #f4f4f5;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; line-height: 48px; font-size: 24px; color: white; font-weight: bold;">E</div>
            <h1 style="color: #10b981; font-size: 24px; margin: 16px 0 0;">You're booked in.</h1>
          </div>
          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 18px; margin: 0 0 16px;">Call Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #71717a; font-size: 14px;">Date</td><td style="padding: 8px 0; color: white; font-size: 14px; text-align: right;">${date}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a; font-size: 14px;">Time</td><td style="padding: 8px 0; color: white; font-size: 14px; text-align: right;">${time} ${timezone || 'AWST'}</td></tr>
              <tr><td style="padding: 8px 0; color: #71717a; font-size: 14px;">With</td><td style="padding: 8px 0; color: white; font-size: 14px; text-align: right;">Dusk — EMVY</td></tr>
            </table>
          </div>
          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 18px; margin: 0 0 8px;">What you told us</h2>
            <p style="color: #a1a1aa; font-size: 14px; margin: 0; line-height: 1.6;">"${goal}"</p>
          </div>
          <div style="text-align: center;">
            <a href="https://emvy-booking.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Visit EMVY</a>
          </div>
          <p style="color: #52525b; font-size: 12px; text-align: center; margin-top: 32px;">EMVY — AI Audit Agency — Perth, Australia<br>dawnlabsai@gmail.com</p>
        </div>
      `
    )

    // Also notify EMVY team
    await sendEmail(
      'dawnlabsai@gmail.com',
      `New booking — ${name} from ${company || 'no company'}`,
      `New EMVY booking!\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\nDate: ${date}\nTime: ${time}\nTimezone: ${timezone || 'AWST'}\n\nGoal:\n${goal}\n\nSubmitted: ${submittedAt || new Date().toISOString()}`,
      `<p>New EMVY booking!</p><p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Company:</strong> ${company || '—'}<br><strong>Date:</strong> ${date}<br><strong>Time:</strong> ${time}<br><strong>Timezone:</strong> ${timezone || 'AWST'}</p><p><strong>Goal:</strong><br>${goal}</p>`
    )

    return NextResponse.json({ success: true, message: 'Booking received' })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to process booking. Please email us at dawnlabsai@gmail.com' }, { status: 500 })
  }
}
