"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const SENTENCE =
  "Cada negocio local merece una presencia digital que trabaje por él las 24 horas del día. " +
  "Nosotros construimos esa herramienta — rápida, bonita y preparada para crecer.";

const words = SENTENCE.split(" ");

// Alternating accent colors for highlighted words to give a vibrant gradient feel
const ACCENT_COLORS = ["#00D4AA", "#C9A84C", "#ffffff", "#00D4AA", "#C9A84C"];

function WordSpan({
  word,
  i,
  total,
  scrollYProgress,
}: {
  word: string;
  i: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = Math.max(0, (i / total) - 0.04);
  const end = Math.min(1, (i + 1) / total + 0.04);

  const color = useTransform(
    scrollYProgress,
    [start, end],
    ["#2a3547", ACCENT_COLORS[i % ACCENT_COLORS.length]]
  );

  return (
    <motion.span style={{ color }} className="inline-block">
      {word}
    </motion.span>
  );
}

export default function ScrollHighlightText() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.15"],
  });

  return (
    <section className="py-28 px-6 md:px-12 bg-[#0A0F1E] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00D4AA]/4 rounded-full blur-[120px]" />
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00D4AA] mb-8 block"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          Nuestra misión
        </motion.span>

        <p className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug md:leading-tight flex flex-wrap justify-center gap-x-[0.28em] gap-y-1">
          {words.map((word, i) => (
            <WordSpan
              key={i}
              word={word}
              i={i}
              total={words.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  );
}
