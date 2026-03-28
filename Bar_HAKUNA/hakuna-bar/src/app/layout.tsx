import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { businessInfo } from '@/lib/data'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hakuna Bar | Mairena del Aljarafe - Tapas, Raciones y Brasa',
  description: businessInfo.description,
  keywords: 'bar, tapas, mairena del aljarafe, sevilla, raciones, brasa, restaurante, cocteles',
  openGraph: {
    title: 'Hakuna Bar | Mairena del Aljarafe',
    description: businessInfo.description,
    type: 'website',
    locale: 'es_ES',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
