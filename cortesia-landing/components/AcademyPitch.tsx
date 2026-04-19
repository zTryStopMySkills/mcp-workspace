"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Loader2, BookOpen, Users, Video, MessageCircle } from "lucide-react";

const features = [
  { icon: Video, text: "Vídeos semanales con casos reales" },
  { icon: BookOpen, text: "Guías descargables y scripts de venta" },
  { icon: Users, text: "Comunidad privada de agentes IA" },
  { icon: MessageCircle, text: "Sesiones en directo con el equipo" }
];

const included = [
  "Acceso completo al contenido",
  "Actualizaciones ilimitadas",
  "Comunidad de práctica",
  "Herramientas y prompts premium",
  "Soporte por email",
  "Cancela cuando quieras"
];

export function AcademyPitch() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Introduce tu email"); return; }
    setError("");
    setLoading(true);

    const res = await fetch(
      process.env.NEXT_PUBLIC_ACADEMY_URL
        ? `${process.env.NEXT_PUBLIC_ACADEMY_URL}/api/stripe/checkout`
        : "https://cortesia-academy.vercel.app/api/stripe/checkout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.url) {
      setError(data.error ?? "No se pudo iniciar el pago. Inténtalo de nuevo.");
      return;
    }

    window.location.href = data.url;
  }

  return (
    <section id="academy" className="py-24 px-6 relative overflow-hidden">
      {/* Gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C9A84C]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#C9A84C] uppercase tracking-widest mb-3">Academy</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Aprende a vender con IA
          </h2>
          <p className="text-[#8B95A9] text-lg max-w-xl mx-auto">
            La formación que el sector necesitaba. Real, aplicada, con resultados desde la primera semana.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#C9A84C]" />
                </div>
                <div className="pt-1.5">
                  <p className="text-white font-medium">{text}</p>
                </div>
              </div>
            ))}

            <div className="mt-8 pt-6 border-t border-white/8">
              <p className="text-sm text-[#8B95A9] mb-1">Ya dentro de la Academy</p>
              <p className="text-2xl font-bold text-white">Aprenden a usar IA para vender más, cerrar más y gestionar mejor.</p>
            </div>
          </motion.div>

          {/* Pricing card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#161B22] border border-[#C9A84C]/30 rounded-2xl p-8 relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C] text-[#0D1117] text-xs font-bold">
                <Crown size={11} />
                ACCESO PREMIUM
              </span>
            </div>

            <div className="text-center mb-8 pt-2">
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-5xl font-bold text-white">20€</span>
                <span className="text-[#8B95A9] mb-2">/mes</span>
              </div>
              <p className="text-sm text-[#8B95A9]">Sin permanencia · Cancela cuando quieras</p>
            </div>

            <ul className="space-y-3 mb-8">
              {included.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <Check size={14} className="text-[#C9A84C] shrink-0" />
                  <span className="text-[#8B95A9]">{item}</span>
                </li>
              ))}
            </ul>

            <form onSubmit={handleCheckout} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-[#8B95A9]/60 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#C9A84C] text-[#0D1117] font-bold text-sm hover:bg-[#C9A84C]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Redirigiendo...</>
                ) : (
                  "Empezar ahora →"
                )}
              </button>
              <p className="text-center text-xs text-[#8B95A9]">
                Pago seguro con Stripe · Sin datos bancarios almacenados
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
