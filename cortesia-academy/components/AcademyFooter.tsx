"use client";

import Link from "next/link";

export function AcademyFooter() {
  return (
    <footer className="relative border-t border-white/5 py-10 mt-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B95A9]">
        <div>
          © {new Date().getFullYear()} <span className="text-white font-semibold">CortesIA Academy</span> — Parte de CortesIA Corporation
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:text-white">
            Entrar
          </Link>
          <a href="https://cortesia.ai" className="hover:text-white">
            Canal YouTube
          </a>
          <a href="mailto:hola@cortesia.ai" className="hover:text-white">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
