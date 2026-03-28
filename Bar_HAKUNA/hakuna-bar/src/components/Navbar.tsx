'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Carta', href: '#carta' },
  { label: 'Reseñas', href: '#resenas' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-hakuna-dark/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={(e) => { e.preventDefault(); handleNavClick('#inicio') }}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl md:text-3xl font-display font-bold tracking-widest gold-gradient">
            HAKUNA
          </span>
          <span className="text-2xl md:text-3xl font-display font-light tracking-widest text-white/80">
            BAR
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                className="text-sm font-medium tracking-wide text-white/70 hover:text-hakuna-gold transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-hakuna-gold transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Reserve CTA desktop */}
        <a
          href="#contacto"
          onClick={(e) => { e.preventDefault(); handleNavClick('#contacto') }}
          className="hidden md:block btn-primary text-sm"
        >
          Reservar Mesa
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/80 hover:text-hakuna-gold transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <Bars3Icon className="w-7 h-7" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-hakuna-dark/98 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <ul className="flex flex-col py-4 px-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                    className="block py-3 px-4 text-white/80 hover:text-hakuna-gold hover:bg-white/5 rounded-lg transition-all duration-200 font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#contacto"
                  onClick={(e) => { e.preventDefault(); handleNavClick('#contacto') }}
                  className="btn-primary block text-center text-sm"
                >
                  Reservar Mesa
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
