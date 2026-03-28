'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { StarIcon } from '@heroicons/react/24/solid'
import { reviews, businessInfo } from '@/lib/data'
import ScrollAnimation from './ScrollAnimation'

import 'swiper/css'
import 'swiper/css/pagination'

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

export default function Reviews() {
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-hakuna-gold' : 'text-white/20'}`}
      />
    ))

  return (
    <section id="resenas" className="section-padding bg-gradient-to-b from-hakuna-brown/20 to-hakuna-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollAnimation>
          <div className="text-center mb-14">
            <p className="text-hakuna-gold tracking-[0.3em] text-sm uppercase font-medium mb-3">
              Opiniones reales
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Lo Que Dicen{' '}
              <span className="gold-gradient">Nuestros Clientes</span>
            </h2>
          </div>
        </ScrollAnimation>

        {/* Google Rating Summary */}
        <ScrollAnimation delay={0.15}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-14">
            <div className="glass-card px-10 py-7 flex items-center gap-6">
              {/* Big rating number */}
              <div className="text-center">
                <div className="text-6xl font-bold text-hakuna-gold leading-none">{businessInfo.googleRating}</div>
                <div className="flex justify-center gap-0.5 mt-2">
                  {renderStars(Math.round(businessInfo.googleRating))}
                </div>
                <p className="text-white/50 text-sm mt-2">{businessInfo.totalReviews} reseñas</p>
              </div>

              <div className="h-20 w-px bg-white/10 hidden md:block" />

              {/* Distribution bars */}
              <div className="hidden md:flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(r => r.rating === star).length
                  const pct = Math.round((count / reviews.length) * 100)
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-white/50 text-xs w-2">{star}</span>
                      <StarIcon className="w-3 h-3 text-hakuna-gold" />
                      <div className="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-hakuna-gold rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-white/40 text-xs">{pct}%</span>
                    </div>
                  )
                })}
              </div>

              <div className="hidden md:flex flex-col items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png"
                  alt="Google"
                  className="h-6 opacity-70 mb-1"
                />
                <span className="text-white/40 text-xs">Reseñas verificadas</span>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Reviews Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="glass-card p-6 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* Review text */}
                <blockquote className="text-white/75 text-sm leading-relaxed flex-1 mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-hakuna-gold/20 border border-hakuna-gold/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-hakuna-gold font-bold text-sm">{review.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{review.author}</p>
                    <p className="text-white/40 text-xs">{formatDate(review.date)}</p>
                  </div>
                  <div className="ml-auto">
                    <svg className="w-5 h-5 opacity-40" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA to Google */}
        <ScrollAnimation delay={0.2}>
          <div className="text-center mt-4">
            <a
              href={businessInfo.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-hakuna-gold/80 hover:text-hakuna-gold transition-colors text-sm font-medium group"
            >
              Ver todas las reseñas en Google
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
