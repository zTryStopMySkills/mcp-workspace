'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#historia', label: 'Nuestra historia' },
  { href: '#galeria', label: 'Galería' },
  { href: '#testimoniales', label: 'Reseñas' },
  { href: '#reserva', label: 'Reservar', isAction: true },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'backdrop-blur-xl bg-[#1A1008]/85 border-b border-[#D4A853]/20 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Flame
                size={24}
                className="text-[#8B1A1A] group-hover:text-[#D4A853] transition-colors duration-300"
              />
              <div className="absolute inset-0 blur-sm bg-[#8B1A1A]/40 group-hover:bg-[#D4A853]/40 transition-colors duration-300 rounded-full" />
            </div>
            <span className="font-display font-bold text-lg text-[#F5EFE6] tracking-wide">
              El Rincón
            </span>
            <span className="hidden sm:inline text-[#8B7355] text-sm font-body tracking-wider">
              de Salteras
            </span>
          </a>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.isAction ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="ml-4 px-5 py-2 bg-[#8B1A1A] hover:bg-[#A52020] text-[#F5EFE6] font-body font-semibold text-sm rounded-sm
                             transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,26,26,0.6)] hover:-translate-y-0.5
                             border border-[#8B1A1A] hover:border-[#D4A853]/50"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative px-4 py-2 text-sm font-body text-[#8B7355] hover:text-[#F5EFE6] transition-colors duration-300
                             after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[1px] after:bg-[#D4A853]
                             after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden p-2 text-[#F5EFE6] hover:text-[#D4A853] transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pt-20 backdrop-blur-xl bg-[#1A1008]/95"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6 -mt-20">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={cn(
                    'text-2xl font-display transition-colors duration-200',
                    link.isAction
                      ? 'px-8 py-3 bg-[#8B1A1A] text-[#F5EFE6] rounded-sm hover:bg-[#A52020] font-bold'
                      : 'text-[#F5EFE6] hover:text-[#D4A853]'
                  )}
                >
                  {link.label}
                </motion.a>
              ))}

              <div className="mt-4 divider-oro w-32" />
              <p className="text-[#8B7355] font-body text-sm tracking-wider">
                Sabor, tradición y excelencia
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
