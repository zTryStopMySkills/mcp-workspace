'use client'
import { motion } from 'framer-motion'
import { StarIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid'
import { businessInfo } from '@/lib/data'
import ScrollAnimation from './ScrollAnimation'

export default function About() {
  const today = new Date()
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const todayName = dayNames[today.getDay()]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-hakuna-gold' : 'text-white/20'}`}
      />
    ))
  }

  return (
    <section id="inicio" className="section-padding max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left: Text content */}
        <div>
          <ScrollAnimation direction="right">
            <p className="text-hakuna-gold tracking-[0.3em] text-sm uppercase font-medium mb-3">
              Quiénes Somos
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Un lugar donde{' '}
              <span className="gold-gradient">el sabor</span>{' '}
              es el protagonista
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              {businessInfo.description}
            </p>
          </ScrollAnimation>

          {/* Google Rating Badge */}
          <ScrollAnimation delay={0.2}>
            <div className="glass-card p-4 inline-flex items-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-hakuna-gold">{businessInfo.googleRating}</div>
                <div className="text-white/50 text-xs mt-0.5">Google Rating</div>
              </div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {renderStars(businessInfo.googleRating)}
                </div>
                <p className="text-white/60 text-sm">{businessInfo.totalReviews} reseñas verificadas</p>
              </div>
            </div>
          </ScrollAnimation>

          {/* Contact info */}
          <ScrollAnimation delay={0.3}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-white/70">
                <MapPinIcon className="w-5 h-5 text-hakuna-gold flex-shrink-0" />
                <span>{businessInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <PhoneIcon className="w-5 h-5 text-hakuna-gold flex-shrink-0" />
                <span>{businessInfo.phone}</span>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Right: Schedule + Image */}
        <div className="flex flex-col gap-6">
          <ScrollAnimation direction="left">
            <div className="glass-card overflow-hidden">
              {/* Featured image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
                  alt="Interior de Hakuna Bar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-hakuna-gold font-display font-bold text-xl">Hakuna Bar</p>
                  <p className="text-white/80 text-sm">Mairena del Aljarafe</p>
                </div>
              </div>

              {/* Schedule table */}
              <div className="p-6">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-hakuna-gold inline-block"></span>
                  Horario de apertura
                </h3>
                <ul className="space-y-2">
                  {businessInfo.schedule.map((item) => {
                    const isToday = item.day === todayName
                    const isClosed = item.hours === 'Cerrado'
                    return (
                      <li
                        key={item.day}
                        className={`flex justify-between items-center py-1.5 px-3 rounded-lg transition-colors ${
                          isToday ? 'bg-hakuna-gold/15 border border-hakuna-gold/30' : ''
                        }`}
                      >
                        <span className={`text-sm font-medium ${isToday ? 'text-hakuna-gold' : 'text-white/70'}`}>
                          {item.day}
                          {isToday && <span className="ml-2 text-xs bg-hakuna-gold text-hakuna-dark px-1.5 py-0.5 rounded-full">Hoy</span>}
                        </span>
                        <span className={`text-sm font-medium ${isClosed ? 'text-red-400' : isToday ? 'text-hakuna-gold' : 'text-white/60'}`}>
                          {item.hours}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
