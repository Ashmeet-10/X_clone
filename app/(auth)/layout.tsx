import { ThemeProvider } from '@/components/ThemeProvider'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Twitter',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang='en'>
        <body className={`${inter.className} bg-black text-white`}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            <div className=''>{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
