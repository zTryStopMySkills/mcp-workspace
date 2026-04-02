"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, MapPin, Clock, Phone } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import content from "@/data/content.json";

export default function Contact() {
  const [form, setForm] = useState({ nombre: "", telefono: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const whatsappUrl = content.negocio.whatsapp
    ? `https://wa.me/${content.negocio.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(content.config.whatsappMensaje)}`
    : null;

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (!content.negocio.whatsapp) {
      setSent(true);
      return;
    }
    const msg = `Hola, soy ${form.nombre}. ${form.mensaje}${form.telefono ? ` Mi teléfono: ${form.telefono}` : ""}`;
    const url = `https://wa.me/${content.negocio.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setSent(true);
  }

  return (
    <section id="contacto" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 damask-bg opacity-40" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(245,192,26,0.07) 0%, transparent 60%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 justify-center mb-4"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#F5C01A]" />
            <span
              className="text-[11px] tracking-[0.4em] text-[#F5C01A] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Estamos aquí
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#F5C01A]" />
          </motion.div>
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-[clamp(40px,7vw,72px)] leading-none text-white"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.03em" }}
          >
            ENCUÉNTRANOS <span style={{ color: "#F5C01A" }}>Y ESCRÍBENOS</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left — info */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* Headline */}
            <p
              className="text-2xl text-[rgba(245,240,232,0.8)]"
              style={{ fontFamily: "var(--font-cinzel)", fontWeight: 600 }}
            >
              ¿Preguntas sobre algún producto?
            </p>
            <p className="text-[rgba(245,240,232,0.55)] leading-relaxed">
              Escríbenos por WhatsApp o pásate por la tienda. Te asesoramos sin compromiso y te ayudamos a elegir la shisha o vaper perfectos para ti.
            </p>

            {/* Info items */}
            <div className="space-y-4 mt-6">
              {[
                {
                  icon: MapPin,
                  label: "Dirección",
                  value: content.negocio.direccion || "Sevilla, España",
                },
                {
                  icon: Phone,
                  label: "Teléfono",
                  value: content.negocio.telefono || "Próximamente",
                },
                {
                  icon: Clock,
                  label: "Horario",
                  value: content.negocio.horario.semana || "Consultar horario en Instagram",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-[rgba(245,192,26,0.2)] bg-[rgba(245,192,26,0.05)]">
                    <Icon size={16} className="text-[#F5C01A]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-0.5"
                      style={{ fontFamily: "var(--font-cinzel)" }}>
                      {label}
                    </p>
                    <p className="text-sm text-[rgba(245,240,232,0.7)]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-4 pt-4">
              <a
                href={content.config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-5 py-2.5 border border-[rgba(245,192,26,0.25)] text-[rgba(245,192,26,0.7)] hover:text-[#F5C01A] hover:border-[rgba(245,192,26,0.5)] transition-all text-sm"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                <InstagramIcon size={15} />
                Instagram
              </a>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-all text-sm font-semibold"
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: "0.06em" }}
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              )}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-[rgba(245,192,26,0.2)] bg-[rgba(245,192,26,0.04)]">
                <div
                  className="text-6xl text-[#F5C01A] mb-4"
                  style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.05em" }}
                >
                  ✦
                </div>
                <h3
                  className="text-2xl text-white mb-2"
                  style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
                >
                  MENSAJE ENVIADO
                </h3>
                <p className="text-[rgba(245,240,232,0.55)] text-sm">
                  Te responderemos lo antes posible.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ nombre: "", telefono: "", mensaje: "" }); }}
                  className="mt-6 text-[rgba(245,192,26,0.6)] hover:text-[#F5C01A] text-xs tracking-widest uppercase transition-colors"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleWhatsApp} className="space-y-4">
                {[
                  { name: "nombre" as const, label: "Tu nombre", type: "text", placeholder: "¿Cómo te llamamos?", required: true },
                  { name: "telefono" as const, label: "Teléfono (opcional)", type: "tel", placeholder: "Ej: 626 98 43 52", required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label
                      className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-2"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      value={form[field.name]}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      className="w-full bg-[#111] border border-[rgba(245,192,26,0.2)] text-[rgba(245,240,232,0.8)] placeholder-[rgba(245,240,232,0.2)] px-4 py-3 text-sm focus:outline-none focus:border-[rgba(245,192,26,0.5)] transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label
                    className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-2"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    ¿En qué podemos ayudarte?
                  </label>
                  <textarea
                    placeholder="Cuéntanos qué buscas..."
                    required
                    rows={4}
                    value={form.mensaje}
                    onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                    className="w-full bg-[#111] border border-[rgba(245,192,26,0.2)] text-[rgba(245,240,232,0.8)] placeholder-[rgba(245,240,232,0.2)] px-4 py-3 text-sm focus:outline-none focus:border-[rgba(245,192,26,0.5)] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-colors flex items-center justify-center gap-3 font-semibold"
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", letterSpacing: "0.08em" }}
                >
                  <Send size={18} />
                  {content.negocio.whatsapp ? "ENVIAR POR WHATSAPP" : "ENVIAR CONSULTA"}
                </button>
                <p className="text-[10px] text-[rgba(245,240,232,0.3)] text-center tracking-wider">
                  Respondemos en menos de 24 horas
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
