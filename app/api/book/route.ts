import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

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

    const filePath = join(process.cwd(), 'data', 'bookings.json')
    let bookings: any[] = []

    try {
      const existing = readFileSync(filePath, 'utf-8')
      bookings = JSON.parse(existing)
    } catch {
      bookings = []
    }

    const duplicate = bookings.find(b => b.email === email)
    if (duplicate) {
      return NextResponse.json({ message: 'You have already booked a call' }, { status: 200 })
    }

    bookings.push({ name, email, company, goal, date, time, timezone, submittedAt })
    writeFileSync(filePath, JSON.stringify(bookings, null, 2))

    return NextResponse.json({ success: true, message: 'Booking received' })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
