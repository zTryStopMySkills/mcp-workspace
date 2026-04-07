"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

export default function StickyBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) setVisible(window.scrollY > 800);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const handleCTA = () => {
    document.querySelector("#presupuesto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl mb-4 mx-4 sm:mx-auto px-4">
            <div className="bg-[#0D1117]/95 backdrop-blur-xl border border-[#00D4AA]/20 rounded-2xl shadow-2xl shadow-black/50 px-5 py-4 flex items-center gap-4">
              {/* Dot indicator */}
              <div className="relative shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D4AA] block" />
                <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#00D4AA] animate-ping opacity-60" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold leading-tight">
                  Plazas limitadas para mayo
                </p>
                <p className="text-[#8B95A9] text-xs mt-0.5 hidden sm:block">
                  Tu web lista en 7 días. Presupuesto gratis y sin compromiso.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={handleCTA}
                className="shrink-0 flex items-center gap-2 bg-[#00D4AA] text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#00b894] transition-colors whitespace-nowrap"
              >
                Pedir presupuesto
                <ArrowRight size={15} />
              </button>

              {/* Dismiss */}
              <button
                onClick={() => { setDismissed(true); setVisible(false); }}
                className="shrink-0 text-[#8B95A9] hover:text-white transition-colors p-1"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
