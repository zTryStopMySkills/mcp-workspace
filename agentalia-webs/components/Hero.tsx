"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, Shield, Smile, Sparkles } from "lucide-react";
import { useRef } from "react";

const trustBadges = [
  { icon: CheckCircle, text: "Entrega en 10 días" },
  { icon: Shield, text: "Soporte incluido" },
  { icon: Smile, text: "Sin conocimientos técnicos" },
  { icon: Zap, text: "Pago único sin sorpresas" },
];

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 10 + 8,
  color: i % 3 === 0 ? "#00D4AA" : i % 3 === 1 ? "#C9A84C" : "#ffffff",
  opacity: Math.random() * 0.4 + 0.1,
}));

function MagneticButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ rotateX: -10, transformPerspective: 600 }}
      whileTap={{ scale: 0.95, rotateX: 8, y: 2 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

const MONTH_NAMES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

export default function Hero({ slots = 3 }: { slots?: number }) {
  const currentMonth = MONTH_NAMES[new Date().getMonth()];
  const { scrollY } = useScroll();

  const bgY        = useTransform(scrollY, [0, 600], [0, 120]);
  const bgRotateX  = useTransform(scrollY, [0, 600], [0, -8]);
  const gridY      = useTransform(scrollY, [0, 600], [0, 60]);
  const contentY   = useTransform(scrollY, [0, 400], [0, -30]);
  const contentScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const opacity    = useTransform(scrollY, [0, 400], [1, 0]);
  const trustY     = useTransform(scrollY, [0, 300], [0, -60]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden animated-gradient"
      style={{ transformPerspective: 1200 }}
    >
      {/* Parallax BG blobs */}
      <motion.div
        style={{ y: bgY, rotateX: bgRotateX }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#00D4AA]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00D4AA]/5 rounded-full blur-[180px]" />
      </motion.div>

      {/* Grid */}
      <motion.div
        style={{ y: gridY }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(0,212,170,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map(p => (
          <span
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: "-10px",
              background: p.color,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        style={{ y: contentY, scale: contentScale, opacity, transformPerspective: 1200 }}
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-32 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="inline-flex items-center gap-3 mb-8 flex-wrap justify-center"
        >
          <span className="inline-flex items-center gap-2 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-full px-5 py-2 glow-pulse">
            <Sparkles size={14} className="text-[#00D4AA]" />
            <span className="text-[#00D4AA] text-sm font-semibold">Agencia web para negocios locales</span>
          </span>
          {slots > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-[#C9A84C] text-xs font-bold">
                {slots === 1 ? "¡Última plaza" : `Solo ${slots} plazas`} para {currentMonth}
              </span>
            </span>
          )}
          {slots === 0 && (
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 border border-slate-500/30 rounded-full px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span className="text-slate-400 text-xs font-bold">Lista de espera abierta</span>
            </span>
          )}
        </motion.div>

        {/* Headline word by word */}
        <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 overflow-hidden">
          {["Tu", "negocio", "merece"].map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block text-shimmer"
          >
            estar en internet
          </motion.span>
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-[#8B95A9] max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Creamos webs profesionales para negocios locales en toda España.{" "}
          <span className="text-white font-semibold">Desde 399€.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <MagneticButton
            onClick={() => scrollTo("#precios")}
            className="ripple-btn flex items-center gap-2 border border-[#00D4AA] text-[#00D4AA] px-8 py-4 rounded-xl font-semibold hover:bg-[#00D4AA]/10 transition-all text-base"
          >
            Ver precios
          </MagneticButton>
          <MagneticButton
            onClick={() => scrollTo("#presupuesto")}
            className="ripple-btn btn-glow flex items-center gap-2 bg-[#00D4AA] text-black px-8 py-4 rounded-xl font-black hover:bg-[#00D4AA]/90 transition-all text-base shadow-lg shadow-[#00D4AA]/25"
          >
            Solicitar presupuesto gratis
            <ArrowRight size={18} />
          </MagneticButton>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ y: trustY }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8"
        >
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-[#8B95A9]"
              >
                <Icon size={15} className="text-[#00D4AA] shrink-0" />
                <span>{badge.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0F1E] to-transparent pointer-events-none" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-[1px] h-8 bg-gradient-to-b from-[#00D4AA]/50 to-transparent"
        />
      </motion.div>
    </motion.section>
  );
}
