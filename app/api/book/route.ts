import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dawnlabsai@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'jhyqagjhlvabdubi',
  },
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, goal, date, time, timezone, submittedAt, meetingLink } = body

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
    await transporter.sendMail({
      from: '"EMVY" <dawnlabsai@gmail.com>',
      to: email,
      subject: `Your call is booked — ${date} at ${time}`,
      text: `You're booked!\n\nDate: ${date}\nTime: ${time} ${timezone || 'AWST'}\nWith: Dusk — EMVY\n${meetingLink ? `\nJoin the call: ${meetingLink}` : ''}\n\nWhat you told us: "${goal}"\n\nEMVY — AI Audit Agency\ndawnlabsai@gmail.com`,
      html: `
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
          ${meetingLink ? `
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${meetingLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Join Call</a>
          </div>
          ` : ''}
          <div style="background: #0a0a0f; border: 1px solid #1a1a25; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: white; font-size: 18px; margin: 0 0 8px;">What you told us</h2>
            <p style="color: #a1a1aa; font-size: 14px; margin: 0; line-height: 1.6;">"${goal}"</p>
          </div>
          <div style="text-align: center;">
            <a href="https://emvy-booking.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Visit EMVY</a>
          </div>
          <p style="color: #52525b; font-size: 12px; text-align: center; margin-top: 32px;">EMVY — AI Audit Agency — Perth, Australia<br>dawnlabsai@gmail.com</p>
        </div>
      `,
    })

    // Also notify EMVY team
    await transporter.sendMail({
      from: '"EMVY Booking" <dawnlabsai@gmail.com>',
      to: 'dawnlabsai@gmail.com',
      subject: `New booking — ${name} from ${company || 'no company'}`,
      text: `New EMVY booking!\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\nDate: ${date}\nTime: ${time}\nTimezone: ${timezone || 'AWST'}\n${meetingLink ? `Meeting link: ${meetingLink}` : ''}\n\nGoal:\n${goal}\n\nSubmitted: ${submittedAt || new Date().toISOString()}`,
      html: `<p><strong>New EMVY booking!</strong></p><p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Company:</strong> ${company || '—'}<br><strong>Date:</strong> ${date}<br><strong>Time:</strong> ${time}<br><strong>Timezone:</strong> ${timezone || 'AWST'}</p><p><strong>Goal:</strong><br>${goal}</p>`,
    })

    return NextResponse.json({ success: true, message: 'Booking received' })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to process booking. Please email us at dawnlabsai@gmail.com' }, { status: 500 })
  }
}
