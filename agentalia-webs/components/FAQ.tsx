"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Tilt3D from "./Tilt3D";
import ParallaxSection from "./ParallaxSection";

const faqs = [
  {
    q: "¿Cuánto tiempo tardáis en entregar?",
    a: "Para el plan Básico entregamos en 24-72 horas desde que confirmamos el pedido. Para los planes Estándar y Premium, entre 1 y 7 días laborables. Los proyectos SaaS o a medida tienen plazo personalizado según complejidad.",
  },
  {
    q: "¿Necesito tener hosting y dominio?",
    a: "No es necesario. Ofrecemos dominio .es o .com por 15€/año y hosting por 100€/año. Si ya tienes tu propio dominio u hosting, lo usamos sin coste adicional.",
  },
  {
    q: "¿Puedo actualizar mi web después?",
    a: "Sí. Con nuestro servicio de mantenimiento desde 39€/mes puedes solicitar cambios de contenido, nuevas fotos, actualizaciones de precios, etc. sin límite. También puedes contratar actualizaciones puntuales.",
  },
  {
    q: "¿Hacéis webs para cualquier tipo de negocio?",
    a: "Sí, trabajamos con todo tipo de negocios locales: restaurantes, bares, tiendas de ropa, clínicas, academias, peluquerías, gimnasios, fontaneros, inmobiliarias... Si tienes un negocio, tenemos experiencia en tu sector.",
  },
  {
    q: "¿Qué pasa si no estoy satisfecho?",
    a: "Trabajamos contigo hasta que estés 100% satisfecho antes de publicar la web. Incluimos hasta 3 rondas de revisiones sin coste adicional. Tu aprobación es necesaria para publicar.",
  },
  {
    q: "¿Tengo que saber de tecnología?",
    a: "En absoluto. Nos encargamos de todo: diseño, desarrollo, publicación y configuración. Tú solo tienes que contarnos qué quieres y darnos tu logo y fotos si tienes. Nosotros hacemos el resto.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 md:px-12 bg-[#0D1117]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <ParallaxSection depth={0.08}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#00D4AA] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
              Preguntas frecuentes
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Tus <span className="text-gradient-teal">dudas</span>, resueltas
            </h2>
            <p className="text-[#8B95A9] max-w-xl mx-auto">
              Todo lo que necesitas saber antes de empezar.
            </p>
          </motion.div>
        </ParallaxSection>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const xFrom = i % 2 === 0 ? -50 : 50;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: xFrom }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tilt3D intensity={4} glare={false} scale={1.01}>
                  <div
                    className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "border-l-[3px] border-l-[#00D4AA] border-t-[#00D4AA]/20 border-r-[#00D4AA]/20 border-b-[#00D4AA]/20 bg-[#00D4AA]/[0.02]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left group"
                    >
                      <span className={`font-semibold pr-4 text-sm md:text-base transition-colors duration-200 ${
                        isOpen ? "text-gradient-teal" : "text-white group-hover:text-[#00D4AA]/80"
                      }`}>
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="shrink-0"
                      >
                        <Plus size={18} className={isOpen ? "text-[#00D4AA]" : "text-[#8B95A9]"} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-[#8B95A9] text-sm leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Tilt3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
