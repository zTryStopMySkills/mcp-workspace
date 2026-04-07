"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "#servicios", label: "Servicios mensuales" },
    { id: "#precios", label: "Precios y planes" },
    { id: "#como-funciona", label: "Cómo funciona" },
    { id: "#resenas", label: "Reseñas de clientes" },
    { id: "#presupuesto", label: "Solicitar presupuesto" },
  ];

  return (
    <footer className="bg-[#0A0F1E] border-t border-white/8 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Agentalia-webs"
                width={52}
                height={52}
                className="object-contain drop-shadow-[0_0_8px_rgba(0,212,170,0.2)]"
              />
              <span className="font-bold text-lg">
                <span className="text-[#C9A84C]">Agentalia</span>
                <span className="text-[#00D4AA]">-webs</span>
              </span>
            </div>
            <p className="text-[#8B95A9] text-sm leading-relaxed max-w-xs">
              Tu negocio, en internet. Sin complicaciones. Webs profesionales para negocios locales en toda España.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white font-semibold text-sm mb-4">Navegación</p>
            <div className="space-y-2.5">
              {navLinks.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  onClick={() => scrollTo(l.id)}
                  className="block text-[#8B95A9] text-sm hover:text-[#00D4AA] transition-colors"
                >
                  {l.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white font-semibold text-sm mb-4">Contacto directo</p>
            <p className="text-[#8B95A9] text-sm mb-5 leading-relaxed">
              ¿Prefieres hablar directamente? Escríbenos por WhatsApp y te respondemos en minutos.
            </p>
            <a
              href="https://wa.me/34600000000?text=Hola,%20me%20interesa%20una%20web%20para%20mi%20negocio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-3 rounded-xl text-sm hover:bg-[#25D366]/85 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#25D366]/20"
            >
              <MessageCircle size={16} />
              Contactar por WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-[#8B95A9] text-xs">
            © 2025 Agentalia-webs · Todos los derechos reservados
          </p>
          <p className="text-[#8B95A9]/50 text-xs">
            Diseñado y desarrollado con orgullo en España
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
