import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'You Data Pipeline Designer',
  description: 'You Data Pipeline Designer'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
