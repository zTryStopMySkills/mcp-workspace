'use client'

import { useState, useEffect } from 'react'
import { Phone, Camera, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  telefono: string
  telefonoHref: string
  instagram?: string
}

export default function FloatingButtons({ telefono, telefonoHref, instagram }: Props) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300',
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        style={{
          background: 'var(--color-cream)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-primary)',
        }}
        aria-label="Subir arriba"
      >
        <ArrowUp size={16} />
      </button>

      {/* Instagram */}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
          aria-label="Instagram de Bodega Aljarafe"
        >
          <Camera size={20} color="white" />
        </a>
      )}

      {/* Teléfono */}
      <a
        href={`tel:${telefonoHref}`}
        className="flex items-center gap-3 px-4 py-3 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'var(--color-primary)', color: 'var(--color-cream)' }}
        aria-label={`Llamar al ${telefono}`}
      >
        <Phone size={18} />
        <span className="text-sm font-semibold pr-1">{telefono}</span>
      </a>
    </div>
  )
}
