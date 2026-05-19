import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Life OS — Your Personal Growth System',
  description: 'Track habits, tasks, journaling, and milestones across Work, Health, Finance, Family, Education & Business — inspired by Atomic Habits',
  manifest: '/manifest.json',
  icons: { icon: '/icon-192.png' },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#080810" />
      </head>
      <body className="bg-[#080810] text-white antialiased">{children}</body>
    </html>
  )
}
