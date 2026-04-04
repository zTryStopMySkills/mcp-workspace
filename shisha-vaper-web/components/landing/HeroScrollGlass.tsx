"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

/* ─────────────────────────────────────────────
   SLIDES — una por categoría
   ───────────────────────────────────────────── */
interface Slide {
  img: string;
  isPhoto?: boolean;
  tag: string;
  titulo: string;
  sub: string;
  cta: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    img: "/images/product-shisha.svg",
    tag: "SHISHAS",
    titulo: "Shishas & Cachimbas",
    sub: "Modelos de importación exclusivos. Cristal artesanal, latón y acero inoxidable.",
    cta: "Ver shishas",
    href: "#productos",
  },
  {
    img: "/images/product-vaper.svg",
    tag: "VAPERS",
    titulo: "Vapers & Desechables",
    sub: "Las últimas tecnologías de vapeo. Box mods, pods y desechables de alta gama.",
    cta: "Ver vapers",
    href: "#productos",
  },
  {
    img: "/images/shisha-bowl.svg",
    tag: "MAZAS & TABACO",
    titulo: "Mazas & Tabacos",
    sub: "Más de 50 sabores disponibles. Al Fakher · Adalya · Fumari · Darkside.",
    cta: "Ver mazas",
    href: "#productos",
  },
  {
    img: "/images/shisha-shaft.svg",
    tag: "ACCESORIOS",
    titulo: "Accesorios & Carbones",
    sub: "Todo lo que necesitas para disfrutar al máximo tu shisha o vaper.",
    cta: "Ver accesorios",
    href: "#productos",
  },
  {
    img: "/images/vaper-pod.svg",
    tag: "LÍQUIDOS & PODS",
    titulo: "Líquidos & Cargas",
    sub: "Sales de nicotina, base libre, pods de repuesto y accesorios de vapeo.",
    cta: "Ver líquidos",
    href: "#productos",
  },
  {
    img: "/logo-oficial.jpg",
    isPhoto: true,
    tag: "TIENDA",
    titulo: "Shisha Vaper Sevilla",
    sub: "Más que una tienda — un espacio para la comunidad. Encuéntranos en Sevilla.",
    cta: "Cómo llegar",
    href: "#contacto",
  },
];

/* Productos en los laterales, uno por slide */
const SIDE_PAIRS: [string, string][] = [
  ["/images/shisha-base.svg",    "/images/shisha-bowl.svg"],
  ["/images/vaper-pod.svg",      "/images/product-vaper.svg"],
  ["/images/shisha-bowl.svg",    "/images/shisha-shaft.svg"],
  ["/images/shisha-shaft.svg",   "/images/shisha-base.svg"],
  ["/images/vaper-pod.svg",      "/images/product-vaper.svg"],
  ["/images/product-shisha.svg", "/images/vaper-pod.svg"],
];

/* ─────────────────────────────────────────────
   VARIANTES DE ANIMACIÓN
   ───────────────────────────────────────────── */
const cardVariants = {
  enter: (d: number) => ({ opacity: 0, y: d > 0 ? 55 : -55, scale: 0.95 }),
  center: { opacity: 1, y: 0, scale: 1 },
  exit: (d: number) => ({ opacity: 0, y: d > 0 ? -55 : 55, scale: 0.95 }),
};

const sideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 70 : -70, scale: 0.8 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -70 : 70, scale: 0.8 }),
};

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
   ───────────────────────────────────────────── */
export default function HeroScrollGlass() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const sectionRef  = useRef<HTMLElement>(null);
  const activeRef   = useRef(0);   // siempre sincronizado con active
  const inView      = useRef(false);
  const locked      = useRef(false);
  const touchStartY = useRef(0);

  /* Avanzar o retroceder slide */
  const go = useCallback((delta: number) => {
    if (locked.current) return;
    const cur  = activeRef.current;
    const next = Math.max(0, Math.min(SLIDES.length - 1, cur + delta));
    if (next === cur) return;

    locked.current = true;
    setTimeout(() => { locked.current = false; }, 750);

    activeRef.current = next;
    setDir(delta > 0 ? 1 : -1);
    setActive(next);
  }, []);

  const getLenis = () =>
    typeof window !== "undefined"
      ? (window as unknown as Record<string, { stop: () => void; start: () => void }>).__lenis
      : null;

  /* Wheel-jacking: 1 tick = 1 slide, Lenis pausado mientras estamos en la sección */
  useEffect(() => {
    const sect = sectionRef.current;
    if (!sect) return;

    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.intersectionRatio >= 0.75;
        if (inView.current) {
          getLenis()?.stop();
        } else {
          getLenis()?.start();
        }
      },
      { threshold: [0, 0.75, 1] },
    );
    io.observe(sect);

    const onWheel = (e: WheelEvent) => {
      if (!inView.current) return;
      const cur = activeRef.current;

      /* Último slide + scroll abajo → reanudar Lenis y dejar pasar */
      if (cur >= SLIDES.length - 1 && e.deltaY > 0) {
        getLenis()?.start();
        return;
      }
      /* Primer slide + scroll arriba → dejar pasar */
      if (cur <= 0 && e.deltaY < 0) {
        getLenis()?.start();
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();
      go(e.deltaY > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      getLenis()?.start(); // siempre restaurar al desmontar
      window.removeEventListener("wheel", onWheel, { capture: true });
      io.disconnect();
    };
  }, [go]);

  /* Touch (mobile) */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
  };

  const slide = SLIDES[active];
  const [leftImg, rightImg] = SIDE_PAIRS[active];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden damask-bg"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Glow de fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(245,192,26,0.09) 0%, transparent 65%)",
        }}
      />

      {/* Logo — fondo a baja opacidad */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-oficial.jpg"
          alt=""
          className="w-[clamp(200px,30vw,340px)] object-contain select-none"
          style={{
            opacity: 0.09,
            filter: "drop-shadow(0 0 60px rgba(245,192,26,0.4))",
          }}
        />
      </div>

      {/* ── Producto lateral IZQUIERDO ── */}
      <div className="absolute left-[3%] lg:left-[5%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none z-10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`left-${active}`}
            custom={dir}
            variants={sideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leftImg}
              alt=""
              className="w-20 h-20 object-contain"
              style={{ filter: "drop-shadow(0 0 16px rgba(245,192,26,0.4))" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Producto lateral DERECHO ── */}
      <div className="absolute right-[3%] lg:right-[5%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none z-10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`right-${active}`}
            custom={dir}
            variants={sideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rightImg}
              alt=""
              className="w-20 h-20 object-contain"
              style={{ filter: "drop-shadow(0 0 16px rgba(245,192,26,0.4))" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slide principal ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card w-[min(660px,90vw)] flex flex-col overflow-hidden"
            style={{ height: "72vh" }}
          >
            {/* Área de imagen */}
            <div className="relative flex-[0_0_56%] overflow-hidden bg-[#0D0D0D] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.img}
                alt={slide.titulo}
                className={`transition-all duration-500 ${
                  slide.isPhoto
                    ? "w-full h-full object-cover object-center opacity-75"
                    : "w-[65%] max-w-[220px] object-contain"
                }`}
                style={
                  !slide.isPhoto
                    ? { filter: "drop-shadow(0 0 28px rgba(245,192,26,0.35))" }
                    : undefined
                }
              />

              {/* Fade inferior */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(13,13,13,0.92), transparent)",
                }}
              />

              {/* Tag */}
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

              {/* Contador */}
              <div
                className="absolute top-4 right-4 text-[11px]"
                style={{
                  color: "rgba(245,192,26,0.35)",
                  fontFamily: "var(--font-cinzel)",
                }}
              >
                {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
              </div>
            </div>

            {/* Texto y CTA */}
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
                  style={{ color: "rgba(245,240,232,0.55)" }}
                >
                  {slide.sub}
                </p>
              </div>

              <MagneticButton
                className="self-start cursor-pointer"
                onClick={() => {
                  document
                    .querySelector(slide.href)
                    ?.scrollIntoView({ behavior: "smooth" });
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(245,192,26,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(245,192,26,0.04)";
                  }}
                >
                  {slide.cta} →
                </button>
              </MagneticButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots — clicables */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const d = i - activeRef.current;
              if (d === 0) return;
              activeRef.current = i;
              setDir(d > 0 ? 1 : -1);
              setActive(i);
            }}
            className="w-[3px] rounded-full cursor-pointer transition-all duration-300"
            style={{
              height: i === active ? "28px" : "10px",
              background:
                i === active
                  ? "#F5C01A"
                  : "rgba(245,192,26,0.25)",
            }}
          />
        ))}
      </div>

      {/* Scroll hint */}
      {active < SLIDES.length - 1 && (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span
            className="text-[9px] tracking-[0.4em] uppercase"
            style={{
              color: "rgba(245,192,26,0.35)",
              fontFamily: "var(--font-cinzel)",
            }}
          >
            Scroll
          </span>
          <motion.div
            className="w-px h-6 bg-[rgba(245,192,26,0.3)]"
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </div>
      )}
    </section>
  );
}
