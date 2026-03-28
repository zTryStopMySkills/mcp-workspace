'use client'
import { motion } from 'framer-motion'
import { galleryImages } from '@/lib/data'
import ScrollAnimation from './ScrollAnimation'

const spanConfig = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
]

export default function Gallery() {
  return (
    <section id="galeria" className="section-padding bg-hakuna-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-14">
            <p className="text-hakuna-gold tracking-[0.3em] text-sm uppercase font-medium mb-3">
              Nuestro espacio
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="gold-gradient">Galería</span>
            </h2>
            <p className="text-white/60 text-lg mt-4 max-w-lg mx-auto">
              Un vistazo a nuestro ambiente, gastronomía y los mejores momentos del bar.
            </p>
          </div>
        </ScrollAnimation>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${spanConfig[i] ?? ''}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-white text-sm font-medium">{img.alt}</p>
              </div>
              {/* Subtle border on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-hakuna-gold/0 group-hover:border-hakuna-gold/30 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Social CTA */}
        <ScrollAnimation delay={0.2}>
          <div className="text-center mt-12">
            <p className="text-white/60 text-sm mb-4">
              Síguenos en Instagram para ver más contenido
            </p>
            <a
              href="https://www.instagram.com/hakuna_mairena_aljarafe/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 glass-card px-6 py-3 text-white/80 hover:text-hakuna-gold transition-all duration-300 hover:border-hakuna-gold/30 rounded-full"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span className="font-medium">@hakuna_mairena_aljarafe</span>
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
