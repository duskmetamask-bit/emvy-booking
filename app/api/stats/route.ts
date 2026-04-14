import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const bookingsPath = join(process.cwd(), 'data', 'bookings.json')
    let bookings: any[] = []

    try {
      bookings = JSON.parse(readFileSync(bookingsPath, 'utf-8'))
    } catch {}

    return NextResponse.json({
      bookings: bookings.length,
      lastBooking: bookings[bookings.length - 1]
        ? {
            name: bookings[bookings.length - 1].name,
            email: bookings[bookings.length - 1].email,
            company: bookings[bookings.length - 1].company,
            preferredTime: bookings[bookings.length - 1].preferredTime,
            submittedAt: bookings[bookings.length - 1].submittedAt,
          }
        : null,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}
