"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

/* ─────────────────────────────────────────────
   SLIDES DATA
   ───────────────────────────────────────────── */
interface Slide {
  foto: string | null;
  gradient: string;
  tag: string;
  titulo: string;
  sub: string;
  cta: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    foto: null,
    gradient: "linear-gradient(135deg, #0a1628 0%, #1a2a50 40%, #0d1d3a 100%)",
    tag: "SHISHAS",
    titulo: "Shishas & Cachimbas",
    sub: "Tu tienda de confianza para vapear con estilo",
    cta: "Ver colección",
    href: "#productos",
  },
  {
    foto: "/images/instagram/fizzy-150k.jpg",
    gradient: "linear-gradient(135deg, #1a0a00 0%, #3d1800 40%, #1a0800 100%)",
    tag: "VAPERS",
    titulo: "Vapers & Desechables",
    sub: "Tecnología, diseño y sabores que marcan la diferencia",
    cta: "Ver vapers",
    href: "#productos",
  },
  {
    foto: null,
    gradient: "linear-gradient(135deg, #0a1a0a 0%, #1a3a20 40%, #0a1a10 100%)",
    tag: "HOOKAS",
    titulo: "Hookas Premium",
    sub: "Modelos exclusivos de importación, selección propia",
    cta: "Ver hookas",
    href: "#productos",
  },
  {
    foto: null,
    gradient: "linear-gradient(135deg, #1a1500 0%, #3a2d00 40%, #1a1400 100%)",
    tag: "MAZAS",
    titulo: "Mazas & Tabacos",
    sub: "Más de 50 sabores · Al Fakher · Adalya · Fumari",
    cta: "Ver mazas",
    href: "#productos",
  },
  {
    foto: null,
    gradient: "linear-gradient(135deg, #100a1a 0%, #2a1840 40%, #100a1a 100%)",
    tag: "TIENDA",
    titulo: "Shisha Vaper Sevilla",
    sub: "Más que una tienda · Un espacio para la comunidad",
    cta: "Cómo llegar",
    href: "#contacto",
  },
];

/* Rangos de visibilidad por slide (leve overlap → efecto apilado) */
const RANGES: [number, number][] = [
  [0.00, 0.22],
  [0.18, 0.42],
  [0.38, 0.62],
  [0.58, 0.82],
  [0.78, 1.00],
];

/* ─────────────────────────────────────────────
   GLASS SLIDE  (un componente por slide → hooks válidos)
   ───────────────────────────────────────────── */
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function GlassSlide({
  slide,
  scrollYProgress,
  enter,
  exit,
  zIndex,
}: {
  slide: Slide;
  scrollYProgress: MotionValue<number>;
  enter: number;
  exit: number;
  zIndex: number;
}) {
  const r: [number, number, number, number] = [
    clamp01(enter - 0.05),
    clamp01(enter + 0.08),
    clamp01(exit  - 0.08),
    clamp01(exit),
  ];

  const opacity = useTransform(scrollYProgress, r, [0, 1, 1, 0]);
  const scale   = useTransform(scrollYProgress, r, [0.93, 1, 1, 0.90]);
  const y       = useTransform(scrollYProgress, r, [44, 0, 0, -32]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, scale, y, zIndex }}
    >
      <div className="glass-card w-[min(660px,90vw)] h-[78vh] flex flex-col overflow-hidden">

        {/* ── Foto / gradiente placeholder ── */}
        <div className="relative flex-[0_0_56%] overflow-hidden">
          {slide.foto ? (
            <img
              src={slide.foto}
              alt={slide.titulo}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full relative" style={{ background: slide.gradient }}>
              <svg
                className="absolute inset-0 m-auto opacity-10"
                width="120" height="120" viewBox="0 0 120 120"
                fill="none" aria-hidden="true"
              >
                <circle cx="60" cy="60" r="55" stroke="#F5C01A" strokeWidth="1"/>
                <path
                  d="M60 20 C40 35 20 35 5 50 C20 65 20 85 5 100 C20 85 40 85 60 100 C80 85 100 85 115 100 C100 85 100 65 115 50 C100 35 80 35 60 20Z"
                  stroke="#F5C01A" strokeWidth="0.8"
                />
                <circle cx="60" cy="60" r="12" stroke="#F5C01A" strokeWidth="0.8"/>
              </svg>
            </div>
          )}

          {/* Bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(13,13,13,0.85), transparent)" }}
          />

          {/* Tag badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.35em] uppercase"
            style={{
              background: "rgba(13,13,13,0.75)",
              border: "1px solid rgba(245,192,26,0.45)",
              color: "#F5C01A",
              fontFamily: "var(--font-cinzel)",
              backdropFilter: "blur(8px)",
              borderRadius: "2px",
            }}
          >
            {slide.tag}
          </div>
        </div>

        {/* ── Texto + CTA ── */}
        <div className="flex flex-col justify-between flex-1 px-7 py-6">
          <div>
            <h2
              className="leading-none mb-2"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(36px, 6vw, 54px)",
                color: "#F5F0E8",
                letterSpacing: "0.02em",
              }}
            >
              {slide.titulo}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(245,240,232,0.55)", fontFamily: "var(--font-body)" }}
            >
              {slide.sub}
            </p>
          </div>

          <MagneticButton
            className="self-start cursor-pointer"
            onClick={() => {
              document.querySelector(slide.href)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <button
              className="px-6 py-2.5 text-xs tracking-[0.3em] uppercase transition-colors"
              style={{
                fontFamily: "var(--font-cinzel)",
                border: "1px solid rgba(245,192,26,0.55)",
                color: "#F5C01A",
                background: "rgba(245,192,26,0.04)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,192,26,0.10)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,192,26,0.04)"; }}
            >
              {slide.cta} →
            </button>
          </MagneticButton>
        </div>

      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS DOT  (componente propio → hooks válidos)
   ───────────────────────────────────────────── */
function ProgressDot({
  scrollYProgress,
  enter,
  exit,
}: {
  scrollYProgress: MotionValue<number>;
  enter: number;
  exit: number;
}) {
  const rd: [number, number, number, number] = [
    clamp01(enter - 0.05),
    clamp01(enter + 0.06),
    clamp01(exit  - 0.06),
    clamp01(exit),
  ];
  const dotOpacity = useTransform(scrollYProgress, rd, [0.22, 1, 1, 0.22]);
  const dotH       = useTransform(scrollYProgress, rd, [10, 28, 28, 10]);
  return (
    <motion.div
      className="w-[3px] rounded-full"
      style={{ height: dotH, opacity: dotOpacity, background: "#F5C01A" }}
    />
  );
}

/* ─────────────────────────────────────────────
   HERO SCROLL GLASS  — componente principal
   ───────────────────────────────────────────── */
export default function HeroScrollGlass() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Parallax del texto decorativo de fondo */
  const bgTextY    = useTransform(scrollYProgress, [0, 1], [0, -80]);
  /* Glow que pulsa con el scroll */
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.90, 0.35]);
  /* CTA final */
  const ctaOpacity = useTransform(scrollYProgress, [0.84, 0.92], [0, 1]);
  const ctaY       = useTransform(scrollYProgress, [0.84, 0.92], [20, 0]);
  /* Scroll hint */
  const hintOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  return (
    <section ref={sectionRef} className="exploded-section damask-bg">
      <div className="exploded-sticky">

        {/* ── Glow radial ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(245,192,26,0.10) 0%, transparent 60%)",
            opacity: glowOpacity,
          }}
        />

        {/* ── Texto decorativo de fondo ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          style={{ y: bgTextY }}
        >
          <span
            className="text-[20vw] font-black leading-none select-none whitespace-nowrap"
            style={{
              fontFamily: "var(--font-bebas)",
              color: "rgba(245,192,26,0.03)",
              letterSpacing: "-0.02em",
            }}
          >
            SHISHA VAPER
          </span>
        </motion.div>

        {/* ── Cards apiladas ── */}
        <div className="absolute inset-0 flex items-center justify-center">
          {SLIDES.map((slide, i) => (
            <GlassSlide
              key={i}
              slide={slide}
              scrollYProgress={scrollYProgress}
              enter={RANGES[i][0]}
              exit={RANGES[i][1]}
              zIndex={i + 1}
            />
          ))}
        </div>

        {/* ── Progress dots — lateral derecho ── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {RANGES.map(([enter, exit], i) => (
            <ProgressDot
              key={i}
              scrollYProgress={scrollYProgress}
              enter={enter}
              exit={exit}
            />
          ))}
        </div>

        {/* ── CTA final ── */}
        <motion.div
          className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <MagneticButton
            className="cursor-pointer"
            onClick={() => {
              document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <button
              className="px-8 py-3 text-sm tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-cinzel)",
                border: "1px solid rgba(245,192,26,0.6)",
                color: "#F5C01A",
                background: "rgba(13,13,13,0.85)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,192,26,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(13,13,13,0.85)"; }}
            >
              Ver toda la colección
            </button>
          </MagneticButton>
        </motion.div>

        {/* ── Scroll hint ── */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{ opacity: hintOpacity }}
        >
          <span
            className="text-[9px] tracking-[0.4em] uppercase"
            style={{ color: "rgba(245,192,26,0.4)", fontFamily: "var(--font-cinzel)" }}
          >
            Scroll para descubrir
          </span>
          <motion.div
            className="w-px h-7 bg-[rgba(245,192,26,0.3)]"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

      </div>
    </section>
  );
}
