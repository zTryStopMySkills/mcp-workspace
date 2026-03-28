'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, MessageCircle } from 'lucide-react'

interface FloatingButtonsProps {
  whatsapp: string
}

export default function FloatingButtons({ whatsapp }: FloatingButtonsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const waMsg = encodeURIComponent(
    'Hola Rincón! Quería reservar una mesa para [X personas] el [día]. ¿Tenéis disponibilidad?'
  )

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 items-end">
      {/* WhatsApp */}
      <motion.a
        href={`https://wa.me/${whatsapp}?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="group flex items-center gap-2 overflow-hidden
                   bg-[#25D366] text-white font-body font-semibold text-sm
                   h-12 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)]
                   hover:shadow-[0_6px_28px_rgba(37,211,102,0.6)] hover:-translate-y-0.5
                   transition-all duration-300 pr-4 pl-3"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={20} className="shrink-0" />
        <span className="max-w-0 group-hover:max-w-[120px] overflow-hidden whitespace-nowrap
                         transition-all duration-500 ease-in-out">
          Reservar mesa
        </span>
      </motion.a>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="w-10 h-10 flex items-center justify-center rounded-full
                       bg-[#2D1F0D] border border-[#D4A853]/30 text-[#D4A853]
                       hover:bg-[#8B1A1A] hover:border-[#8B1A1A] hover:text-[#F5EFE6]
                       hover:-translate-y-0.5 transition-all duration-300
                       shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            aria-label="Subir al inicio"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
