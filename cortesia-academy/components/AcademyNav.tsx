"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, GraduationCap } from "lucide-react";

export function AcademyNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? "bg-[#0D1117]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7DD3FC] to-[#C9A84C] flex items-center justify-center">
            <GraduationCap size={16} className="text-[#0D1117]" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-[#C9A84C]">Cortes</span>
            <span className="text-[#7DD3FC]">IA</span>
            <span className="text-[#8B95A9] text-xs font-medium ml-1.5">Academy</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <a
            href="#que-incluye"
            className="hidden sm:inline-block px-3 py-2 text-sm text-[#8B95A9] hover:text-white transition-colors"
          >
            Qué incluye
          </a>
          <a
            href="#precio"
            className="hidden sm:inline-block px-3 py-2 text-sm text-[#8B95A9] hover:text-white transition-colors"
          >
            Precio
          </a>
          <Link
            href="/login"
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/25 text-white text-sm font-medium transition-all"
          >
            <LogIn size={13} />
            Entrar
          </Link>
        </div>
      </div>
    </nav>
  );
}
