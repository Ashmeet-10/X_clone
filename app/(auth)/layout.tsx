import { ThemeProvider } from '@/components/ThemeProvider'
import '../globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { unstable_noStore } from 'next/cache'

export const metadata: Metadata = {
  title: 'Twitter',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  unstable_noStore()
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang='en'>
        <body className={`${GeistSans.className} bg-black text-white`}>
          <ThemeProvider attribute='class' defaultTheme='dark'>
            <div className=''>{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
