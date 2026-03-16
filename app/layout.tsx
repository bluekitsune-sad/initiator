import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRM - Vicidial Integration',
  description: 'CRM with Vicidial dialer integration',
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
