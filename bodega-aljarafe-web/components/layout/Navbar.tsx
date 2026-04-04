'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '#carta', label: 'Carta' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#historia', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--color-cream)]/95 backdrop-blur-md shadow-[0_1px_0_var(--color-border)]'
          : 'bg-transparent'
      )}
    >
      <div className="container-brand flex items-center justify-between h-16 md:h-20">
        {/* Logo / Marca */}
        <a href="#" className="flex flex-col leading-none group">
          <span
            className="font-display text-xl md:text-2xl font-bold tracking-tight transition-colors"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
            }}
          >
            Bodega Aljarafe
          </span>
          <span
            className="text-[0.6rem] tracking-[0.18em] uppercase"
            style={{ color: 'var(--color-accent)' }}
          >
            Desde 1970 · Castilleja
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <a
          href="tel:+34633208857"
          className="hidden md:flex btn-primary text-sm py-2.5 px-5 gap-2"
        >
          <Phone size={15} />
          Reservar
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md"
          style={{ color: 'var(--color-primary)' }}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        style={{ background: 'var(--color-cream)' }}
      >
        <nav className="container-brand flex flex-col gap-1 pb-6 pt-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="py-3 text-base font-medium border-b"
              style={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:+34633208857"
            className="btn-primary mt-4 justify-center gap-2"
          >
            <Phone size={16} />
            Llamar para reservar
          </a>
        </nav>
      </div>
    </header>
  )
}
