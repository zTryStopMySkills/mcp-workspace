"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type TargetAndTransition } from "framer-motion";
import Image from "next/image";
import content from "@/data/content.json";

/* Glassmorphism floating product card */
function GlassCard({
  imageUrl,
  label,
  price,
  style,
  initial,
  animate: animateProp,
  transition,
  motionStyle,
}: {
  imageUrl: string;
  label: string;
  price?: string;
  style?: React.CSSProperties;
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  transition?: Record<string, unknown>;
  motionStyle?: Record<string, unknown>;
}) {
  return (
    <motion.div
      className="absolute hidden lg:block"
      style={motionStyle}
      initial={initial}
      animate={animateProp}
      transition={transition}
    >
      <div
        className="relative overflow-hidden rounded-sm"
        style={{
          width: "200px",
          height: "260px",
          background: "rgba(13,13,13,0.45)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(245,192,26,0.22)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(245,192,26,0.12)",
          ...style,
        }}
      >
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={label}
          className="w-full h-full object-cover"
          style={{ opacity: 0.75 }}
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#0D0D0D]/20 to-transparent" />

        {/* Top gold shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(245,192,26,0.6)] to-transparent" />

        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p
            className="text-[10px] tracking-[0.35em] text-[rgba(245,192,26,0.7)] uppercase mb-0.5"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {label}
          </p>
          {price && (
            <p
              className="text-xl text-white"
              style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
            >
              {price}
            </p>
          )}
        </div>

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[rgba(245,192,26,0.5)]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[rgba(245,192,26,0.5)]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[rgba(245,192,26,0.5)]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[rgba(245,192,26,0.5)]" />
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yLeft   = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yRight  = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const whatsappUrl = content.negocio.whatsapp
    ? `https://wa.me/${content.negocio.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(content.config.whatsappMensaje)}`
    : "#contacto";

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#0D0D0D" }}
    >
      {/* Damask pattern */}
      <div className="absolute inset-0 damask-bg opacity-50 pointer-events-none" />

      {/* Radial gold glow — center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,192,26,0.10) 0%, transparent 70%)" }}
      />
      {/* Soft top glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(245,192,26,0.12) 0%, transparent 50%)" }}
      />

      {/* ── Left glassmorphism card: Shisha ── */}
      <GlassCard
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/c/c1/Hookah_Shisha.jpg"
        label="Shisha Premium"
        price="Desde 54.99€"
        motionStyle={{ y: yLeft, left: "6%", top: "50%", translateY: "-50%" }}
        style={{ transform: "rotate(-4deg)" }}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Right glassmorphism card: Vaper ── */}
      <GlassCard
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/b/b9/Box_Mod_For_Vaping_%28144491549%29.jpeg"
        label="Vapers & Mods"
        price="Desde 22.99€"
        motionStyle={{ y: yRight, right: "6%", top: "50%", translateY: "-50%" }}
        style={{ transform: "rotate(4deg)" }}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Extra card top-right: Mazas ── */}
      <motion.div
        className="absolute hidden xl:block"
        style={{ y: yRight, right: "12%", top: "15%", translateY: "-50%" }}
        initial={{ opacity: 0, x: 40, y: -20 }}
        animate={{ opacity: 0.65, x: 0, y: 0 }}
        transition={{ duration: 1.1, delay: 0.9 }}
      >
        <div
          className="relative overflow-hidden rounded-sm"
          style={{
            width: "130px",
            height: "100px",
            background: "rgba(13,13,13,0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(245,192,26,0.16)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            transform: "rotate(2deg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Prince%2C_Konoz_%26_Shams_Alasil_Shisha_Tobacco.jpg"
            alt="Mazas"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 to-transparent" />
          <p className="absolute bottom-2 left-2 text-[9px] tracking-widest text-[rgba(245,192,26,0.7)] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
            Mazas & Tabaco
          </p>
        </div>
      </motion.div>

      {/* ── Extra card bottom-left: Pod ── */}
      <motion.div
        className="absolute hidden xl:block"
        style={{ y: yLeft, left: "12%", bottom: "18%" }}
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 0.6, x: 0, y: 0 }}
        transition={{ duration: 1.1, delay: 1.0 }}
      >
        <div
          className="relative overflow-hidden rounded-sm"
          style={{
            width: "120px",
            height: "90px",
            background: "rgba(13,13,13,0.4)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(245,192,26,0.14)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            transform: "rotate(-2deg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/da/2023_Lost_Vape_Ursa_Nano_Pod.jpg"
            alt="Pod"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 to-transparent" />
          <p className="absolute bottom-2 left-2 text-[9px] tracking-widest text-[rgba(245,192,26,0.7)] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
            Pod Systems
          </p>
        </div>
      </motion.div>

      {/* ── Smoke particle effect ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${18 + i * 16}px`,
              height: `${18 + i * 16}px`,
              background: `rgba(245,192,26,${0.04 - i * 0.003})`,
              left: `${44 + (i % 3) * 3}%`,
              bottom: `${22 + i * 7}%`,
              filter: "blur(12px)",
            }}
            animate={{
              y: [-8, -80, -150],
              x: [0, (i % 2 === 0 ? 1 : -1) * 20, (i % 2 === 0 ? -1 : 1) * 10],
              opacity: [0, 0.6, 0],
              scale: [0.6, 1.4, 2.1],
            }}
            transition={{
              duration: 4.5 + i * 0.8,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── Hero copy ── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-2xl mx-auto"
      >
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div
            className="relative w-16 h-16 rounded-full overflow-hidden"
            style={{
              border: "1px solid rgba(245,192,26,0.35)",
              boxShadow: "0 0 30px rgba(245,192,26,0.2), inset 0 0 20px rgba(245,192,26,0.05)",
            }}
          >
            <Image
              src="/logo.jpg"
              alt="Shisha Vaper Sevilla"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Since line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="flex items-center gap-4 justify-center mb-6"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#F5C01A]" />
          <span
            className="text-[11px] tracking-[0.45em] text-[#F5C01A] uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Since 2025 · Sevilla
          </span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#F5C01A]" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(56px,11vw,130px)] leading-none text-white mb-2"
          style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
        >
          EL RITUAL
          <br />
          <span style={{ color: "#F5C01A" }}>DEL PLACER</span>
        </motion.h1>

        {/* Ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <span className="h-px w-8 bg-[rgba(245,192,26,0.4)]" />
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 0 L9.5 5.5 L15 7 L9.5 8.5 L8 14 L6.5 8.5 L1 7 L6.5 5.5Z" fill="#F5C01A" opacity="0.7"/>
          </svg>
          <span className="h-px w-8 bg-[rgba(245,192,26,0.4)]" />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-[clamp(14px,2vw,17px)] text-[rgba(245,240,232,0.5)] mb-10 leading-relaxed"
        >
          Shishas, vapers y accesorios premium en el corazón de Sevilla.
          <br className="hidden sm:block" /> Cada producto, una experiencia.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#productos"
            className="px-9 py-3.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-colors"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", letterSpacing: "0.08em" }}
          >
            VER PRODUCTOS
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-9 py-3.5 border border-[rgba(245,192,26,0.5)] text-[#F5C01A] hover:border-[#F5C01A] hover:bg-[rgba(245,192,26,0.08)] transition-all"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", letterSpacing: "0.08em" }}
          >
            CONSÚLTANOS
          </a>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-10 flex items-center justify-center gap-5 flex-wrap"
        >
          {["Shishas Premium", "Vapers & E-cigs", "Mazas & Tabaco", "Asesoramiento Experto"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#F5C01A] text-xs opacity-40">✦</span>}
              <span
                className="text-[10px] text-[rgba(245,240,232,0.3)] tracking-widest uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-[#F5C01A] to-transparent mx-auto"
        />
      </motion.div>
    </section>
  );
}
