"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, Send } from "lucide-react";
import Tilt3D from "./Tilt3D";
import ParallaxSection from "./ParallaxSection";

interface Review {
  id: string;
  author_name: string;
  business_name?: string;
  location?: string;
  rating: number;
  content: string;
  created_at: string;
}

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: "p1",
    author_name: "Paco Ruiz",
    business_name: "Bar Paco",
    location: "Sevilla",
    rating: 5,
    content: "Increíble trabajo. En menos de 10 días tenía mi web funcionando. Ahora los clientes me encuentran en Google y llaman preguntando por las tapas. 100% recomendable.",
    created_at: "2025-03-15T10:00:00Z",
  },
  {
    id: "p2",
    author_name: "Carmen Vega",
    business_name: "Restaurante La Brasa",
    location: "Madrid",
    rating: 5,
    content: "El equipo fue muy profesional y cercano. Me explicaron todo sin tecnicismos. La web quedó preciosa y adaptada a nuestro estilo. Ya tenemos reservas online.",
    created_at: "2025-02-28T10:00:00Z",
  },
  {
    id: "p3",
    author_name: "Miguel Torres",
    business_name: "Tienda Miguel Sport",
    location: "Valencia",
    rating: 5,
    content: "Pensaba que una web era muy cara y complicada. Con Agentalia-webs fue sencillísimo. Precio justo, entrega rápida y soporte cuando lo necesito. Muy contento.",
    created_at: "2025-01-20T10:00:00Z",
  },
];

const AVATAR_GRADIENTS = [
  "from-[#00D4AA] to-[#00829A]",
  "from-[#C9A84C] to-[#9A6B00]",
  "from-[#7C3AED] to-[#4F46E5]",
  "from-[#EC4899] to-[#C026D3]",
  "from-[#F97316] to-[#DC2626]",
  "from-[#10B981] to-[#0891B2]",
];

function StarRating({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type={interactive ? "button" : undefined}
          onClick={interactive && onChange ? () => onChange(s) : undefined}
          onMouseEnter={interactive ? () => setHovered(s) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={interactive ? 22 : 18}
            className={(hovered || rating) >= s ? "text-[#C9A84C] fill-[#C9A84C]" : "text-[#8B95A9]"}
          />
        </button>
      ))}
    </div>
  );
}

interface ResenasProps {
  reviews: Review[];
}

export default function Resenas({ reviews }: ResenasProps) {
  const displayReviews = reviews.length > 0 ? reviews : PLACEHOLDER_REVIEWS;

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    author_name: "",
    business_name: "",
    location: "",
    rating: 5,
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.content.length < 20) {
      setError("La reseña debe tener al menos 20 caracteres.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setSubmitted(true);
    } catch {
      setError("Error al enviar la reseña. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="resenas" className="py-24 px-6 md:px-12 bg-[#0D1117]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ParallaxSection depth={0.08}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#C9A84C] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              Testimonios
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Lo que dicen nuestros <span className="text-gradient-gold">clientes</span>
            </h2>
            <p className="text-[#8B95A9] max-w-xl mx-auto">
              Negocios reales que ya tienen su web y están creciendo online.
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {displayReviews.slice(0, 6).map((review, i) => {
            const xFrom = i % 2 === 0 ? -60 : 60;
            const initials = review.author_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            const gradClass = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: xFrom, y: 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt3D intensity={6} glareColor="rgba(201,168,76,0.06)" scale={1.02}>
                  <div
                    className="glass-card rounded-2xl p-6 hover:border-[#C9A84C]/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 flex flex-col"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Decorative quote mark */}
                    <div
                      className="text-7xl font-black text-[#00D4AA]/20 leading-none mb-2 select-none"
                      aria-hidden
                      style={{ transform: "translateZ(20px)" }}
                    >
                      &ldquo;
                    </div>

                    {/* Stars */}
                    <div className="mb-3">
                      <StarRating rating={review.rating} />
                    </div>

                    {/* Content */}
                    <p
                      className="text-white/80 text-sm leading-relaxed flex-1 mb-5"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      &ldquo;{review.content}&rdquo;
                    </p>

                    {/* Author */}
                    <div
                      className="flex items-center gap-3 pt-4 border-t border-white/8"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradClass} flex items-center justify-center shrink-0 text-white text-xs font-black`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{review.author_name}</p>
                        {(review.business_name || review.location) && (
                          <p className="text-[#8B95A9]/70 text-xs mt-0.5">
                            {[review.business_name, review.location].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt3D>
              </motion.div>
            );
          })}
        </div>

        {/* Leave a review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors text-left"
          >
            <div>
              <p className="font-semibold text-white">Deja tu reseña</p>
              <p className="text-[#8B95A9] text-sm mt-0.5">Comparte tu experiencia con Agentalia-webs</p>
            </div>
            <motion.div animate={{ rotate: formOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={20} className="text-[#8B95A9]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {formOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 border-t border-white/8">
                  {submitted ? (
                    <div className="py-8 text-center">
                      <div className="w-14 h-14 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/30 flex items-center justify-center mx-auto mb-4">
                        <Star size={24} className="text-[#00D4AA]" />
                      </div>
                      <p className="text-white font-bold text-lg mb-1">¡Gracias por tu reseña!</p>
                      <p className="text-[#8B95A9] text-sm">Será revisada y publicada pronto.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#8B95A9] mb-1.5">Nombre *</label>
                          <input
                            type="text"
                            required
                            value={formData.author_name}
                            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                            className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#8B95A9] mb-1.5">Negocio</label>
                          <input
                            type="text"
                            value={formData.business_name}
                            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                            className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                            placeholder="Nombre de tu negocio"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#8B95A9] mb-1.5">Localidad</label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all"
                            placeholder="Ciudad o pueblo"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#8B95A9] mb-2">Valoración *</label>
                          <StarRating
                            rating={formData.rating}
                            interactive
                            onChange={(r) => setFormData({ ...formData, rating: r })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-[#8B95A9] mb-1.5">Tu reseña * (mín. 20 caracteres)</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          className="w-full bg-[#0D1117] border border-[#1a2235] rounded-xl px-4 py-3 text-base text-white placeholder-[#8B95A9]/50 outline-none focus:border-[#00D4AA]/60 focus:ring-2 focus:ring-[#00D4AA]/10 transition-all resize-none"
                          placeholder="Cuéntanos tu experiencia con Agentalia-webs..."
                        />
                        <p className="text-xs text-[#8B95A9]/50 mt-1">{formData.content.length} / 20 caracteres mínimo</p>
                      </div>
                      {error && <p className="text-red-400 text-sm">{error}</p>}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#00D4AA] to-[#00FFD4] text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <Send size={15} />
                        {submitting ? "Enviando..." : "Enviar reseña"}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
