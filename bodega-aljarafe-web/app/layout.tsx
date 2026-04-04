import type { Metadata, Viewport } from 'next'
import { Lora, DM_Sans } from 'next/font/google'
import './globals.css'

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bodega Aljarafe | Carnes a la Brasa · Castilleja de la Cuesta',
  description:
    'Cuatro generaciones de pasión por la carne. T-Bone, Rubia Gallega, Lomo de Buey y Joselito. Brasa de encina y olivo en Castilleja de la Cuesta, Sevilla.',
  keywords: [
    'bodega aljarafe',
    'restaurante carne castilleja',
    'brasa aljarafe',
    'carne madurada sevilla',
    'rubia gallega sevilla',
    'joselito castilleja',
    'restaurante castilleja de la cuesta',
  ],
  authors: [{ name: 'Bodega Aljarafe' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Bodega Aljarafe',
    title: 'Bodega Aljarafe | Carnes a la Brasa',
    description:
      'Cuatro generaciones de pasión por la carne. Brasa de encina y olivo en Castilleja de la Cuesta, Sevilla.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor: '#7B2D3B',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${lora.variable} ${dmSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-cream)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  )
}
