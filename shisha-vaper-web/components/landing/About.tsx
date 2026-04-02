"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "2025", label: "Fundación" },
  { value: "6+", label: "Categorías" },
  { value: "5★", label: "Valoración" },
  { value: "100%", label: "Satisfacción" },
];

export default function About() {
  return (
    <section id="nosotros" className="relative py-28 overflow-hidden">
      {/* Background ornament */}
      <div className="absolute inset-0 damask-bg" style={{ opacity: 0.5 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — visual */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            {/* Golden filigree frame */}
            <div className="relative aspect-[4/5] max-w-[420px] mx-auto">
              {/* Decorative border */}
              <div
                className="absolute inset-0 border border-[rgba(245,192,26,0.3)]"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              />
              <div
                className="absolute inset-[6px] border border-[rgba(245,192,26,0.15)]"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              />

              {/* Corner ornaments */}
              {[
                "top-0 left-0",
                "top-0 right-0 rotate-90",
                "bottom-0 right-0 rotate-180",
                "bottom-0 left-0 -rotate-90",
              ].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-8 h-8`}>
                  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                    <path d="M2 2 L14 2 L14 4 L4 4 L4 14 L2 14Z" fill="#F5C01A" opacity="0.8" />
                  </svg>
                </div>
              ))}

              {/* Content inside frame */}
              <div
                className="absolute inset-4 flex flex-col items-center justify-center text-center"
                style={{ background: "linear-gradient(135deg, #111111 0%, #0D0D0D 100%)" }}
              >
                {/* Arabic ornament SVG */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="mb-6"
                >
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="35" stroke="rgba(245,192,26,0.3)" strokeWidth="1" />
                    <circle cx="40" cy="40" r="26" stroke="rgba(245,192,26,0.15)" strokeWidth="1" />
                    <path
                      d="M40 8 L44 18 L54 15 L48 24 L58 28 L48 32 L52 42 L42 38 L40 50 L38 38 L28 42 L32 32 L22 28 L32 24 L26 15 L36 18Z"
                      fill="rgba(245,192,26,0.6)"
                    />
                    <circle cx="40" cy="40" r="6" fill="rgba(245,192,26,0.8)" />
                  </svg>
                </motion.div>

                <p
                  className="text-[clamp(28px,5vw,42px)] text-[#F5C01A] mb-2"
                  style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.05em" }}
                >
                  SHISHA VAPER
                </p>
                <p
                  className="text-[10px] tracking-[0.5em] text-[rgba(245,192,26,0.6)] uppercase mb-6"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  Sevilla
                </p>

                <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#F5C01A] to-transparent mb-6" />

                <p className="text-sm text-[rgba(245,240,232,0.5)] leading-relaxed px-4">
                  Donde la tradición árabe y la cultura vaper se encuentran en el corazón de Sevilla.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            {/* Section label */}
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[#F5C01A]" />
              <span
                className="text-[11px] tracking-[0.4em] text-[#F5C01A] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Nuestra Historia
              </span>
            </div>

            <h2
              className="text-[clamp(36px,6vw,64px)] leading-none text-white mb-6"
              style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.03em" }}
            >
              MÁS QUE
              <br />
              <span style={{ color: "#F5C01A" }}>UNA TIENDA</span>
            </h2>

            <p className="text-[rgba(245,240,232,0.7)] leading-relaxed mb-5 text-base">
              En Shisha Vaper Sevilla nació en 2025 con una misión clara: traer al corazón de Andalucía la mejor selección de shishas, vapers y accesorios que el mercado tiene para ofrecer.
            </p>
            <p className="text-[rgba(245,240,232,0.55)] leading-relaxed mb-8 text-base">
              Cada producto que entra en nuestra tienda pasa por un riguroso proceso de selección. No vendemos cualquier cosa — vendemos experiencias. Desde la cachimba tradicional árabe hasta el último pod system de alta gama, asesoramos a cada cliente para que encuentre exactamente lo que busca.
            </p>

            {/* Pull quote */}
            <div className="relative pl-5 mb-8 border-l-2 border-[#F5C01A]">
              <p
                className="text-xl text-[rgba(245,240,232,0.8)] italic"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                &ldquo;Cada calada, una historia&rdquo;
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-2xl text-[#F5C01A] mb-1"
                    style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[10px] text-[rgba(245,240,232,0.4)] tracking-widest uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
