"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#precios", label: "Precios" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#resenas", label: "Reseñas" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#0A0F1E]/85 border-b border-white/10 shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotateY: 20, rotateX: -5, translateZ: 10, transformPerspective: 500 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/logo.png"
              alt="Agentalia-webs"
              width={52}
              height={52}
              className="object-contain drop-shadow-[0_0_8px_rgba(0,212,170,0.3)] group-hover:drop-shadow-[0_0_14px_rgba(0,212,170,0.5)] transition-all duration-300"
            />
          </motion.div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-[#C9A84C]">Agentalia</span>
            <span className="text-[#00D4AA]">-webs</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleLinkClick(l.href)}
              className="text-sm text-[#8B95A9] hover:text-white transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-[#00D4AA] after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <motion.button
          onClick={() => handleLinkClick("#presupuesto")}
          whileHover={{ y: -3, rotateX: -10, rotateY: 3, scale: 1.04, transformPerspective: 600, boxShadow: "0 12px 30px rgba(0,212,170,0.35)" }}
          whileTap={{ scale: 0.96, rotateX: 6, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="hidden md:block bg-[#00D4AA] text-black font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          Solicitar presupuesto
        </motion.button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0D1117]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4"
          >
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleLinkClick(l.href)}
                className="block w-full text-left text-[#8B95A9] hover:text-white text-base py-2 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => handleLinkClick("#presupuesto")}
              className="block w-full bg-[#00D4AA] text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#00D4AA]/80 transition-all mt-2"
            >
              Solicitar presupuesto gratis
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
