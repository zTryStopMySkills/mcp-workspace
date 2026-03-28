'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { StarIcon } from '@heroicons/react/24/solid'
import { menuItems } from '@/lib/data'
import ScrollAnimation from './ScrollAnimation'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const recommended = menuItems.filter((item) => item.isRecommended)

export default function Recommendations() {
  return (
    <section className="section-padding bg-hakuna-brown/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-12">
            <p className="text-hakuna-gold tracking-[0.3em] text-sm uppercase font-medium mb-3">
              Chef&apos;s Selection
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="gold-gradient">Recomendaciones</span>
              <br />
              <span className="text-white text-3xl md:text-4xl font-light">de la Casa</span>
            </h2>
          </div>
        </ScrollAnimation>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {recommended.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="glass-card overflow-hidden group">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Price */}
                  <div className="absolute top-4 right-4 bg-hakuna-gold text-hakuna-dark font-bold px-3 py-1.5 rounded-full text-sm shadow-lg">
                    {item.price.toFixed(2)}€
                  </div>

                  {/* Category pill */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white/80 text-xs px-3 py-1 rounded-full border border-white/20">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </div>

                  {item.isNew && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-full">
                      NUEVO
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white font-semibold text-lg leading-snug">{item.name}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <StarIcon className="w-4 h-4 text-hakuna-gold" />
                      <span className="text-hakuna-gold text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>

                  {/* Recommended tag */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-hakuna-gold text-xs">★</span>
                    <span className="text-hakuna-gold/80 text-xs font-medium tracking-wide uppercase">
                      Recomendado por el equipo
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
