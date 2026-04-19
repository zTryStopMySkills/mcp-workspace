"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Loader2, ArrowRight } from "lucide-react";

const INCLUDES = [
  "Acceso completo a todos los cursos",
  "Videollamada semanal en directo",
  "Canales de chat premium",
  "Screen share en llamadas",
  "Respuestas del equipo en <24h",
  "Comunidad privada con el equipo",
  "Nuevos cursos incluidos sin sobrecoste",
  "Cancela cuando quieras, sin preguntas"
];

export function PricingCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se recibió URL de checkout");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="precio"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-transparent via-[#7DD3FC]/[0.03] to-transparent"
    >
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-4">
            <Sparkles size={12} className="text-[#C9A84C]" />
            <span className="text-xs text-[#C9A84C] uppercase tracking-wider font-medium">
              Precio sencillo
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Un solo plan. Todo incluido.
          </h2>
          <p className="text-lg text-[#8B95A9] leading-relaxed max-w-xl mx-auto">
            Sin planes confusos ni upsells. Acceso total por el precio de un par de cafés al mes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#7DD3FC]/10 via-[#C9A84C]/5 to-transparent border border-[#7DD3FC]/25 p-8 sm:p-10 overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[#7DD3FC]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[#C9A84C]/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl sm:text-7xl font-bold text-white tabular-nums">20</span>
              <span className="text-2xl font-bold text-[#8B95A9]">€/mes</span>
            </div>
            <p className="text-sm text-[#8B95A9] mb-8">
              También disponible en USD (20$). Cancela cuando quieras.
            </p>

            <ul className="space-y-3 mb-8">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#00D4AA]" />
                  </div>
                  <span className="text-sm text-white">{item}</span>
                </li>
              ))}
            </ul>

            <form onSubmit={startCheckout} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-[#8B95A9]/60 focus:outline-none focus:border-[#7DD3FC] text-sm disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-[#0D1117] font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] shadow-lg shadow-[#7DD3FC]/20"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                {loading ? "Redirigiendo a pago..." : "Empezar ahora"}
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
              </button>
              {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
              )}
              <p className="text-[10px] text-[#8B95A9]/60 text-center">
                Tras pagar recibirás tu usuario y contraseña por email. Pago seguro con Stripe.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
