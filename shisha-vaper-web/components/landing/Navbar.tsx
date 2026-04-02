"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import InstagramIcon from "@/components/InstagramIcon";
import content from "@/data/content.json";

const links = [
  { href: "#productos", label: "Productos" },
  { href: "#categorias", label: "Categorías" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0D0D0D]/96 backdrop-blur-md border-b border-[rgba(245,192,26,0.15)] py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo — imagen real del negocio */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className={`relative overflow-hidden rounded-full transition-all duration-300 ${scrolled ? "w-10 h-10" : "w-12 h-12"}`}>
              <Image
                src="/logo.jpg"
                alt="Shisha Vaper Sevilla"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-[16px] tracking-[0.06em] text-[#F5C01A] group-hover:text-[#FFD84A] transition-colors"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                SHISHA VAPER SEVILLA
              </span>
              <span
                className="text-[9px] tracking-[0.4em] text-[rgba(245,192,26,0.55)] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Since 2025
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[13px] tracking-[0.12em] uppercase text-[rgba(245,240,232,0.65)] hover:text-[#F5C01A] transition-colors"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={content.config.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgba(245,240,232,0.5)] hover:text-[#F5C01A] transition-colors"
              title="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbCIxYiCXC3M8iEhOU0c"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-[rgba(245,240,232,0.5)] hover:text-[#F5C01A] transition-colors border border-[rgba(245,192,26,0.25)] hover:border-[rgba(245,192,26,0.6)] px-3 py-1.5"
              style={{ fontFamily: "var(--font-cinzel)" }}
              title="Únete al canal de WhatsApp"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Canal
            </a>
            {content.negocio.whatsapp && (
              <a
                href={`https://wa.me/${content.negocio.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(content.config.whatsappMensaje)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-[#F5C01A] hover:bg-[#FFD84A] text-[#0D0D0D] font-semibold tracking-[0.06em] uppercase transition-colors"
                style={{ fontFamily: "var(--font-bebas)", fontSize: "15px" }}
              >
                WhatsApp
              </a>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#F5C01A] p-1"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-[#0D0D0D]/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-6 text-[#F5C01A]"
            >
              <X size={28} />
            </button>

            {/* Logo in mobile menu */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
              <Image src="/logo.jpg" alt="Shisha Vaper Sevilla" fill className="object-cover" />
            </div>

            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-5xl text-[rgba(245,240,232,0.8)] hover:text-[#F5C01A] transition-colors"
                style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
              >
                {l.label}
              </a>
            ))}
            <a
              href={content.config.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[rgba(245,192,26,0.7)] hover:text-[#F5C01A] transition-colors mt-2"
            >
              <InstagramIcon size={20} />
              <span className="text-sm tracking-widest" style={{ fontFamily: "var(--font-cinzel)" }}>
                @shisha_vaper_sevilla
              </span>
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbCIxYiCXC3M8iEhOU0c"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-[rgba(245,192,26,0.3)] text-[rgba(245,192,26,0.7)] hover:text-[#F5C01A] hover:border-[rgba(245,192,26,0.6)] transition-colors"
              style={{ fontFamily: "var(--font-cinzel)", fontSize: "12px", letterSpacing: "0.2em" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              ÚNETE AL CANAL
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
