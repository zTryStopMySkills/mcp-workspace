'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menuItems, categories, ALLERGENS } from '@/lib/data'
import MenuCard from './MenuCard'
import ScrollAnimation from './ScrollAnimation'

const ALL_ID = 'all'

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState(ALL_ID)
  const [allergensOpen, setAllergensOpen] = useState(false)

  const filtered = activeCategory === ALL_ID
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory)

  const allCategories = [
    { id: ALL_ID, name: 'Todo', icon: '✨', description: '' },
    ...categories,
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.07,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  }

  const allergenEntries = Object.entries(ALLERGENS)

  return (
    <section id="carta" className="section-padding bg-gradient-to-b from-hakuna-dark to-hakuna-brown/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-14">
            <p className="text-hakuna-gold tracking-[0.3em] text-sm uppercase font-medium mb-3">
              Lo mejor de casa
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="gold-gradient">Nuestra Carta</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Cocina casera con ingredientes de primera calidad. Desde tapas tradicionales hasta carnes a la brasa.
            </p>
          </div>
        </ScrollAnimation>

        {/* Category filter tabs */}
        <ScrollAnimation delay={0.1}>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none -mx-2 px-2">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-hakuna-gold text-hakuna-dark shadow-lg shadow-hakuna-gold/20'
                    : 'glass-card text-white/70 hover:text-white hover:border-hakuna-gold/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </ScrollAnimation>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <MenuCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Item count */}
        <ScrollAnimation delay={0.1}>
          <p className="text-center text-white/40 text-sm mt-10">
            Mostrando {filtered.length} {filtered.length === 1 ? 'plato' : 'platos'}
            {activeCategory !== ALL_ID && ` en ${allCategories.find(c => c.id === activeCategory)?.name}`}
          </p>
        </ScrollAnimation>

        {/* Allergen legend */}
        <ScrollAnimation delay={0.15}>
          <div className="mt-8 max-w-3xl mx-auto">
            <button
              onClick={() => setAllergensOpen((prev) => !prev)}
              className="flex items-center gap-2 mx-auto text-white/50 hover:text-white/80 text-sm transition-colors duration-200 group"
              aria-expanded={allergensOpen}
            >
              <span className="text-base">{allergensOpen ? '▾' : '▸'}</span>
              <span className="underline underline-offset-2 decoration-dotted">
                Info de alérgenos
              </span>
            </button>

            <AnimatePresence>
              {allergensOpen && (
                <motion.div
                  key="allergen-legend"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 glass-card p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
                      {allergenEntries.map(([key, allergen]) => (
                        <div key={key} className="flex flex-col items-center gap-1 text-center">
                          <span className="text-xl leading-none">{allergen.icon}</span>
                          <span className="text-white/60 text-xs leading-tight">{allergen.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-white/40 text-xs mt-3 border-t border-white/10 pt-3">
                      Si tiene alguna alergia o intolerancia, consulte con nuestro personal.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
