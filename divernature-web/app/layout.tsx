import type { Metadata } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import Script from 'next/script'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop from '@/components/BackToTop'
import './globals.css'

const fredoka = Fredoka({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
})

const nunito = Nunito({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: {
    default: 'DiverNature — Animaciones Infantiles ECOfriendly en Sevilla',
    template: '%s | DiverNature',
  },
  description:
    'Animaciones infantiles para cumpleaños, comuniones y eventos en Sevilla. Experiencias únicas que combinan diversión, creatividad y naturaleza. ¡La fiesta empieza con DiverNature!',
  keywords: [
    'animacion infantil sevilla',
    'cumpleaños infantil sevilla',
    'animadores cumpleaños',
    'talleres infantiles naturaleza',
    'divernature',
    'fiestas infantiles sevilla',
    'comuniones animacion',
  ],
  openGraph: {
    title: 'DiverNature — Animaciones Infantiles ECOfriendly',
    description: 'Animaciones infantiles para cumpleaños y eventos en Sevilla. Diversión, creatividad y naturaleza.',
    url: 'https://divernature-web.vercel.app',
    siteName: 'DiverNature',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DiverNature — Animaciones Infantiles ECOfriendly',
    description: 'Animaciones infantiles para cumpleaños y eventos en Sevilla.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="font-[family-name:var(--font-nunito)] min-h-screen flex flex-col bg-[#F7FAF2] text-[#1A3020]">
        <ScrollProgress />
        {children}
        <BackToTop />
        <Script src="//www.instagram.com/embed.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
