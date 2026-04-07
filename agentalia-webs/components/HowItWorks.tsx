"use client";

import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { ClipboardList, PhoneCall, Rocket } from "lucide-react";
import { useRef, useEffect } from "react";
import Tilt3D from "./Tilt3D";
import ParallaxSection from "./ParallaxSection";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Cuéntanos tu negocio",
    description: "Rellenas nuestro formulario en 2 minutos. Sin tecnicismos, sin complicaciones. Solo cuéntanos qué haces y qué necesitas.",
    color: "#00D4AA",
  },
  {
    icon: PhoneCall,
    number: "02",
    title: "Te llamamos gratis",
    description: "Un agente especialista te contacta, analiza tu negocio y diseña una propuesta personalizada adaptada a tu sector y presupuesto.",
    color: "#C9A84C",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Tu web online",
    description: "Diseñamos, desarrollamos y publicamos tu web en 1-7 días laborables. Tú solo tienes que validar y dar el visto bueno.",
    color: "#00D4AA",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  // Spotlight follows cursor
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const spotX = useSpring(mouseX, { stiffness: 80, damping: 22 });
  const spotY = useSpring(mouseY, { stiffness: 80, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  const origins = [
    { x: -80, y: 0 },
    { x: 0, y: 60 },
    { x: 80, y: 0 },
  ];

  // SVG path drawing
  const stepsRef = useRef<HTMLDivElement>(null);
  const pathInView = useInView(stepsRef, { once: true, margin: "-80px" });
  const rawPath = useSpring(0, { stiffness: 55, damping: 22 });
  useEffect(() => {
    if (pathInView) rawPath.set(1);
  }, [pathInView, rawPath]);

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-24 px-6 md:px-12 bg-[#0D1117] overflow-hidden"
    >
      {/* Interactive cursor spotlight */}
      <motion.div
        style={{
          x: spotX,
          y: spotY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 70%)",
        }}
        className="pointer-events-none absolute w-[600px] h-[600px] rounded-full"
        aria-hidden
      />

      {/* Decorative glassmorphism background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-[#00D4AA]/[0.05] blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 1.5 }}
          className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#C9A84C]/[0.05] blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.8 }}
          className="absolute top-1/3 right-8 w-28 h-10 rounded-full bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 left-8 w-14 h-14 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00D4AA]/50"
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #00D4AA 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <ParallaxSection depth={0.08}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00D4AA] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
              Proceso
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Cómo <span className="text-gradient-teal">funciona</span>
            </h2>
            <p className="text-[#8B95A9] max-w-2xl mx-auto text-lg">
              De cero a web profesional en tres pasos simples. Sin complicaciones técnicas.
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Steps */}
        <div ref={stepsRef} className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Animated SVG path connecting the 3 step icons — desktop only */}
          <svg
            viewBox="0 0 1200 100"
            className="pointer-events-none absolute hidden md:block w-full top-0 left-0"
            style={{ top: "112px", zIndex: 0 }}
            aria-hidden
          >
            <motion.path
              d="M 180 50 C 340 20, 420 80, 600 50 C 780 20, 860 80, 1020 50"
              stroke="#00D4AA"
              strokeOpacity="0.3"
              strokeWidth="1.5"
              strokeDasharray="7 5"
              fill="none"
              strokeLinecap="round"
              style={{ pathLength: rawPath }}
            />
            {/* Glowing orbs at endpoints */}
            <motion.circle cx="180" cy="50" r="4" fill="#00D4AA" fillOpacity="0.4" style={{ opacity: rawPath }} />
            <motion.circle cx="600" cy="50" r="4" fill="#C9A84C" fillOpacity="0.4" style={{ opacity: rawPath }} />
            <motion.circle cx="1020" cy="50" r="4" fill="#00D4AA" fillOpacity="0.4" style={{ opacity: rawPath }} />
          </svg>
            {steps.map((step, i) => {
            const Icon = step.icon;
            const { x, y } = origins[i];
            const isGold = step.color === "#C9A84C";
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x, y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt3D intensity={10} scale={1.03}>
                  <div
                    className="relative glass-card rounded-2xl p-8 text-center hover:border-[#00D4AA]/30 transition-colors duration-300 hover:shadow-xl hover:shadow-[#00D4AA]/5 group overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Subtle gradient top-edge accent */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-60"
                      style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }}
                    />

                    {/* Step badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-5 border ${
                        isGold
                          ? "bg-[#C9A84C]/10 border-[#C9A84C]/25 text-[#C9A84C]"
                          : "bg-[#00D4AA]/10 border-[#00D4AA]/25 text-[#00D4AA]"
                      }`}
                      style={{ transform: "translateZ(25px)" }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ background: step.color }} />
                      Paso {step.number}
                    </div>

                    {/* Icon with pulse ring on hover */}
                    <div
                      className="relative w-20 h-20 mx-auto mb-6"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                        style={{ background: `${step.color}20` }}
                        animate={{ scale: [1, 1.18, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      />
                      <div
                        className="relative w-full h-full rounded-2xl flex items-center justify-center transition-all"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}22, ${step.color}08)`,
                          border: `1px solid ${step.color}30`,
                        }}
                      >
                        <Icon size={32} style={{ color: step.color }} />
                      </div>
                    </div>

                    <h3
                      className="text-xl font-bold text-white mb-3"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-[#8B95A9] leading-relaxed text-sm"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      {step.description}
                    </p>

                    {/* Bottom glow on hover */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${step.color}, transparent)` }}
                    />
                  </div>
                </Tilt3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
