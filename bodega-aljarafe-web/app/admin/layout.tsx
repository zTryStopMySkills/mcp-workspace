import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Bodega Aljarafe',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {children}
    </div>
  )
}
