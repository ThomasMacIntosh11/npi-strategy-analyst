import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NPI Strategy Analyst',
  description: 'AI-powered strategy consultant for Vision 2030',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
