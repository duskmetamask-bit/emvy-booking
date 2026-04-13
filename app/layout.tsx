import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Book Your Free AI Discovery Call | EMVY',
  description: 'Book a free 15-20 minute discovery call with EMVY. See how AI can transform your business — no sales pressure.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
