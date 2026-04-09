'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const links = [
  { href: '#que-es', label: '¿Qué es?' },
  { href: '#packs', label: 'Nuestros Packs' },
  { href: '#talleres', label: 'Talleres' },
  { href: '#equipo', label: 'Equipo' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const curr = window.scrollY
      if (curr < 80) {
        setVisible(true)
      } else if (curr > lastScrollY.current + 10) {
        setVisible(false)
      } else if (curr < lastScrollY.current - 5) {
        setVisible(true)
      }
      lastScrollY.current = curr
      setScrolled(curr > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      role="banner"
      animate={{ y: visible ? 0 : '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" aria-label="DiverNature — Inicio" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="DiverNature Entretenimiento ECOfriendly"
            width={220}
            height={67}
            className="h-10 w-auto"
            priority
          />
        </a>

        {/* Desktop nav */}
        <nav role="navigation" aria-label="Menú principal" className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`font-[family-name:var(--font-fredoka)] text-[17px] font-medium transition-colors ${
                scrolled
                  ? 'text-[#1A3020] hover:text-[#3D7848]'
                  : 'text-white hover:text-[#F0CE55]'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            className="font-[family-name:var(--font-fredoka)] bg-[#E87838] text-white px-5 py-2 rounded-full text-[17px] font-semibold hover:bg-[#d06828] transition-colors focus-visible:ring-2 ring-offset-2 ring-[#E87838]"
          >
            Reserva tu fiesta 🎉
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-[#1A3020] hover:bg-[#3D7848]/10 transition-colors"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            role="navigation"
            aria-label="Menú móvil"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-[#3D7848]/10 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 gap-1">
              {links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-[family-name:var(--font-fredoka)] text-lg font-medium text-[#1A3020] py-3 px-2 rounded-lg hover:bg-[#F7FAF2] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="mt-2 bg-[#E87838] text-white text-center py-3 rounded-xl font-[family-name:var(--font-fredoka)] text-lg font-semibold hover:bg-[#d06828] transition-colors"
              >
                Reserva tu fiesta 🎉
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
