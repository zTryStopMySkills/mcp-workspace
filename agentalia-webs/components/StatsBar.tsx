"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Tilt3D from "./Tilt3D";

const stats = [
  { value: 50, suffix: "+", label: "webs entregadas", gold: false },
  { value: 24, suffix: "h", label: "entrega básico desde", gold: true },
  { value: 100, suffix: "%", label: "satisfacción garantizada", gold: false },
  { value: 7, suffix: " días", label: "máx. entrega premium", gold: false },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsBar() {
  return (
    <section className="relative bg-gradient-to-r from-[#0A0F1E] via-[#071A1A] to-[#0A0F1E] border-y border-[#00D4AA]/10 py-14 overflow-hidden">
      {/* Glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#00D4AA]/5 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#C9A84C]/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center"
            >
              <Tilt3D intensity={8} glare={false} scale={1.05}>
                <div className="px-8 md:px-14 py-4 text-center group">
                  <div
                    className={`text-5xl md:text-6xl font-black tabular-nums leading-none mb-2 ${
                      stat.gold ? "text-shimmer" : "text-[#00D4AA]"
                    }`}
                    style={{ transform: "translateZ(20px)", display: "block" }}
                  >
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <div
                    className="text-[#8B95A9] text-xs tracking-widest uppercase font-medium"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              </Tilt3D>
              {i < stats.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-white/15 to-transparent shrink-0"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
