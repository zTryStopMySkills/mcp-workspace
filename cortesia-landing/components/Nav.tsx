"use client";

import { useState, useEffect } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1117]/95 backdrop-blur-md border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#C9A84C]">Cortes</span>
          <span className="text-[#7DD3FC]">IA</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#8B95A9]">
          <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
          <a href="#academy" className="hover:text-white transition-colors">Academy</a>
          <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
          <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
        </div>

        <a
          href="#academy"
          className="px-4 py-2 rounded-lg bg-[#C9A84C] text-[#0D1117] text-sm font-semibold hover:bg-[#C9A84C]/90 transition-colors"
        >
          Academy →
        </a>
      </nav>
    </header>
  );
}
