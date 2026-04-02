"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Check } from "lucide-react";
import { getContent, saveContent } from "@/lib/utils";
import defaultContent from "@/data/content.json";

type ContentData = typeof defaultContent;

export default function AdminConfiguracion() {
  const [data, setData] = useState<ContentData | null>(null);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    nombre: "",
    slogan: "",
    direccion: "",
    telefono: "",
    whatsapp: "",
    email: "",
    instagram: "",
    horarioSemana: "",
    horarioFinSemana: "",
    adminPassword: "",
    whatsappMensaje: "",
    mostrarPrecios: true,
  });

  useEffect(() => {
    const d = getContent();
    setData(d);
    setConfig({
      nombre: d.negocio.nombre,
      slogan: d.negocio.slogan,
      direccion: d.negocio.direccion,
      telefono: d.negocio.telefono,
      whatsapp: d.negocio.whatsapp,
      email: d.negocio.email,
      instagram: d.config.instagram,
      horarioSemana: d.negocio.horario.semana,
      horarioFinSemana: d.negocio.horario.fin_semana,
      adminPassword: d.config.adminPassword,
      whatsappMensaje: d.config.whatsappMensaje,
      mostrarPrecios: d.config.mostrarPrecios,
    });
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    const updated: ContentData = {
      ...data,
      negocio: {
        ...data.negocio,
        nombre: config.nombre,
        slogan: config.slogan,
        direccion: config.direccion,
        telefono: config.telefono,
        whatsapp: config.whatsapp,
        email: config.email,
        horario: { semana: config.horarioSemana, fin_semana: config.horarioFinSemana },
      },
      config: {
        ...data.config,
        instagram: config.instagram,
        adminPassword: config.adminPassword,
        whatsappMensaje: config.whatsappMensaje,
        mostrarPrecios: config.mostrarPrecios,
      },
    };
    saveContent(updated);
    setData(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data) return null;

  const fields: { key: keyof typeof config; label: string; type?: string; placeholder?: string; rows?: number }[] = [
    { key: "nombre", label: "Nombre del negocio", placeholder: "Shisha Vaper Sevilla" },
    { key: "slogan", label: "Slogan", placeholder: "El Ritual del Placer" },
    { key: "direccion", label: "Dirección", placeholder: "Calle, número, Sevilla" },
    { key: "telefono", label: "Teléfono", type: "tel", placeholder: "+34 600 000 000" },
    { key: "whatsapp", label: "Número WhatsApp (sin +)", placeholder: "34600000000" },
    { key: "email", label: "Email", type: "email", placeholder: "info@shishavapersvl.com" },
    { key: "instagram", label: "URL de Instagram", placeholder: "https://www.instagram.com/shisha_vaper_sevilla/" },
    { key: "horarioSemana", label: "Horario semana", placeholder: "L-V 10:00-21:00" },
    { key: "horarioFinSemana", label: "Horario fin de semana", placeholder: "S-D 11:00-21:00" },
    { key: "whatsappMensaje", label: "Mensaje WhatsApp por defecto", rows: 2 },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-[clamp(28px,5vw,42px)] text-white leading-none mb-1"
          style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
          CONFIGURACIÓN
        </h1>
        <p className="text-sm text-[rgba(245,240,232,0.45)]">Datos del negocio y ajustes generales</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Business info section */}
        <div className="bg-[#0D0D0D] border border-[rgba(245,192,26,0.12)] rounded-sm p-5 space-y-4">
          <h2 className="text-base text-[#F5C01A]" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}>
            DATOS DEL NEGOCIO
          </h2>
          {fields.filter((f) => !["adminPassword", "whatsappMensaje"].includes(f.key)).map((f) => (
            <div key={f.key}>
              <label className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-1.5"
                style={{ fontFamily: "var(--font-cinzel)" }}>
                {f.label}
              </label>
              {f.rows ? (
                <textarea
                  rows={f.rows}
                  value={config[f.key] as string}
                  onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
                  className="w-full bg-[#111] border border-[rgba(245,192,26,0.15)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)] resize-none"
                  placeholder={f.placeholder}
                />
              ) : (
                <input
                  type={f.type || "text"}
                  value={config[f.key] as string}
                  onChange={(e) => setConfig({ ...config, [f.key]: e.target.value })}
                  className="w-full bg-[#111] border border-[rgba(245,192,26,0.15)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)]"
                  placeholder={f.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        {/* Admin config */}
        <div className="bg-[#0D0D0D] border border-[rgba(245,192,26,0.12)] rounded-sm p-5 space-y-4">
          <h2 className="text-base text-[#F5C01A]" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}>
            AJUSTES ADMIN
          </h2>

          {/* Whatsapp message */}
          <div>
            <label className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-1.5"
              style={{ fontFamily: "var(--font-cinzel)" }}>
              Mensaje WhatsApp predeterminado
            </label>
            <textarea
              rows={2}
              value={config.whatsappMensaje}
              onChange={(e) => setConfig({ ...config, whatsappMensaje: e.target.value })}
              className="w-full bg-[#111] border border-[rgba(245,192,26,0.15)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)] resize-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-1.5"
              style={{ fontFamily: "var(--font-cinzel)" }}>
              Nueva contraseña admin
            </label>
            <input
              type="password"
              value={config.adminPassword}
              onChange={(e) => setConfig({ ...config, adminPassword: e.target.value })}
              className="w-full bg-[#111] border border-[rgba(245,192,26,0.15)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)]"
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          {/* Mostrar precios toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setConfig({ ...config, mostrarPrecios: !config.mostrarPrecios })}
              className={`w-11 h-6 rounded-full transition-colors relative ${config.mostrarPrecios ? "bg-[#F5C01A]" : "bg-[rgba(255,255,255,0.1)]"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${config.mostrarPrecios ? "translate-x-6" : "translate-x-1"}`}
              />
            </div>
            <span className="text-sm text-[rgba(245,240,232,0.65)]">Mostrar precios en la web</span>
          </label>
        </div>

        {/* Save button */}
        <motion.button
          type="submit"
          className={`w-full py-3.5 flex items-center justify-center gap-2.5 font-semibold transition-colors ${
            saved ? "bg-emerald-500 text-white" : "bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A]"
          }`}
          style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: "0.08em" }}
          whileTap={{ scale: 0.98 }}
        >
          {saved ? (
            <>
              <Check size={18} />
              GUARDADO
            </>
          ) : (
            <>
              <Save size={18} />
              GUARDAR CAMBIOS
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
