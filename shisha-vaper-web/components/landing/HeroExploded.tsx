"use client";
import { lazy, Suspense, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useScrollProgress } from "@/components/premium/useScrollProgress";
import MagneticButton from "@/components/ui/MagneticButton";

const ProductViewer3D = lazy(() => import("@/components/ProductViewer3D"));

const PHASES = [
  { progress: 0,    label: "La shisha perfecta",    sub: "Descubre cada componente" },
  { progress: 0.3,  label: "Ingeniería de detalle",  sub: "Cada pieza, su propósito" },
  { progress: 0.65, label: "Craftsmanship puro",     sub: "Cuenco · Vástago · Manguera · Vaso" },
  { progress: 0.9,  label: "Todo en uno",            sub: "La experiencia completa" },
];

export default function HeroExploded() {
  const sectionRef = useRef<HTMLElement>(null);

  // Raw scroll progress 0→1 while the section is in view
  const rawProgress = useScrollProgress(sectionRef, {
    start: "top top",
    end:   "bottom bottom",
  });

  // Smooth the progress so it feels organic even without Lenis
  const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 20 });

  // Which phase label to show
  const currentPhase = PHASES.reduce((acc, phase) =>
    rawProgress >= phase.progress ? phase : acc
  , PHASES[0]);

  // Parallax text — moves up as user scrolls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={sectionRef} className="exploded-section damask-bg">

      {/* ── Sticky canvas ── */}
      <div className="exploded-sticky">

        {/* Background radial glow that intensifies with progress */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(245,192,26,0.12) 0%, transparent 65%)",
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]),
          }}
        />

        {/* 3D model — full viewport, centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Suspense fallback={null}>
            <ProductViewer3D
              type="shisha"
              explodedProgress={rawProgress}
              className="w-full h-full max-w-lg"
            />
          </Suspense>
        </div>

        {/* ── Text overlay — top left ── */}
        <motion.div
          className="absolute left-8 top-1/4 z-10 pointer-events-none"
          style={{ y: textY }}
        >
          <motion.p
            key={currentPhase.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="text-[10px] tracking-[0.4em] uppercase mb-2"
            style={{ color: "rgba(245,192,26,0.6)", fontFamily: "var(--font-cinzel)" }}
          >
            {currentPhase.sub}
          </motion.p>

          <motion.h2
            key={currentPhase.label + "_h"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-none"
            style={{
              fontFamily: "var(--font-bebas)",
              color: "#F5F0E8",
              textShadow: "0 0 60px rgba(245,192,26,0.15)",
            }}
          >
            {currentPhase.label}
          </motion.h2>
        </motion.div>

        {/* ── Progress indicator — right side ── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {PHASES.map((phase, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              animate={{
                height: rawProgress >= phase.progress ? 28 : 12,
                backgroundColor: rawProgress >= phase.progress ? "#F5C01A" : "rgba(245,192,26,0.25)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* ── CTA — appears at final phase ── */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
          animate={{ opacity: rawProgress > 0.88 ? 1 : 0, y: rawProgress > 0.88 ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <MagneticButton
            className="cursor-pointer"
            onClick={() => {
              document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <button
              className="px-8 py-3 text-sm tracking-[0.3em] uppercase border border-[rgba(245,192,26,0.5)] text-[#F5C01A] hover:bg-[rgba(245,192,26,0.08)] transition-colors"
              style={{ fontFamily: "var(--font-cinzel)", background: "rgba(13,13,13,0.8)" }}
            >
              Ver colección
            </button>
          </MagneticButton>
        </motion.div>

        {/* ── Scroll hint — disappears quickly ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ opacity: rawProgress < 0.08 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="text-[9px] tracking-[0.4em] uppercase"
            style={{ color: "rgba(245,192,26,0.4)", fontFamily: "var(--font-cinzel)" }}
          >
            Scroll para explorar
          </span>
          <motion.div
            className="w-px h-8 bg-[rgba(245,192,26,0.3)]"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </motion.div>

      </div>
    </section>
  );
}
