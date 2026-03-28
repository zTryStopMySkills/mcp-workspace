'use client'
import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import { MenuItem, ALLERGENS } from '@/lib/data'

interface Props {
  item: MenuItem
}

export default function MenuCard({ item }: Props) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating)
      return (
        <StarIcon
          key={i}
          className={`w-3.5 h-3.5 ${filled ? 'text-hakuna-gold' : 'text-white/20'}`}
        />
      )
    })
  }

  const renderSpicy = (level?: number) => {
    if (!level) return null
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }, (_, i) => (
          <span
            key={i}
            className={`text-xs ${i < level ? 'text-red-500' : 'text-white/20'}`}
          >
            🌶
          </span>
        ))}
      </div>
    )
  }

  const renderAllergens = (allergens: string[]) => {
    if (!allergens || allergens.length === 0) return null
    return (
      <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-white/10">
        {allergens.map((key) => {
          const allergen = ALLERGENS[key]
          if (!allergen) return null
          return (
            <span
              key={key}
              title={allergen.name}
              className="inline-flex items-center justify-center w-6 h-6 bg-white/10 rounded-full text-xs leading-none cursor-help hover:bg-white/20 transition-colors"
            >
              {allergen.icon}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: item.soldOut ? 1 : 1.03, y: item.soldOut ? 0 : -4 }}
      transition={{ duration: 0.25 }}
      className={`glass-card overflow-hidden flex flex-col h-full group cursor-default relative ${
        item.soldOut ? 'opacity-70' : ''
      }`}
    >
      {/* Image container */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            item.soldOut ? 'grayscale' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Sold-out overlay */}
        {item.soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-red-400 font-black text-lg tracking-[0.2em] uppercase drop-shadow-lg border border-red-400/60 px-3 py-1 rounded">
              AGOTADO
            </span>
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-hakuna-gold text-hakuna-dark font-bold text-sm px-2.5 py-1 rounded-full shadow-lg">
          {item.price.toFixed(2)}€
        </div>

        {/* NEW badge */}
        {item.isNew && !item.soldOut && (
          <div className="absolute top-3 left-3 bg-red-500 text-white font-bold text-xs px-2 py-1 rounded-full shadow-lg tracking-wide">
            NUEVO
          </div>
        )}

        {/* Recommended ribbon */}
        {item.isRecommended && !item.isNew && !item.soldOut && (
          <div className="absolute top-3 left-3 bg-hakuna-gold/90 text-hakuna-dark font-bold text-xs px-2 py-1 rounded-full shadow-lg">
            Recomendado
          </div>
        )}
        {item.isRecommended && item.isNew && !item.soldOut && (
          <div className="absolute bottom-3 left-3 bg-hakuna-gold/90 text-hakuna-dark font-bold text-xs px-2 py-1 rounded-full shadow-lg">
            Recomendado
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-base mb-1 leading-tight">{item.name}</h3>
        <p className="text-white/55 text-sm leading-relaxed mb-3 flex-1">{item.description}</p>

        {/* Allergen icons */}
        {renderAllergens(item.allergens)}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            {renderStars(item.rating)}
            <span className="text-white/50 text-xs ml-1">{item.rating}</span>
          </div>
          {item.spicy !== undefined && item.spicy > 0 && renderSpicy(item.spicy)}
        </div>
      </div>
    </motion.div>
  )
}
