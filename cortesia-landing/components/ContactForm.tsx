"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", service: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Rellena todos los campos obligatorios.");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Error al enviar. Escríbenos a hola@cortesia.ai");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
          <CheckCircle2 size={28} className="text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">¡Mensaje enviado!</h3>
        <p className="text-[#8B95A9] text-sm max-w-sm">
          Te respondemos en menos de 24 horas. Si es urgente escríbenos directamente a{" "}
          <a href="mailto:hola@cortesia.ai" className="text-[#C9A84C]">hola@cortesia.ai</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#8B95A9] mb-1.5">Nombre *</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-[#8B95A9]/50 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#8B95A9] mb-1.5">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-[#8B95A9]/50 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#8B95A9] mb-1.5">¿Qué necesitas?</label>
        <select
          value={form.service}
          onChange={(e) => update("service", e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors appearance-none"
        >
          <option value="" className="bg-[#161B22]">Selecciona un servicio</option>
          <option value="web" className="bg-[#161B22]">Web profesional</option>
          <option value="ia" className="bg-[#161B22]">Agente IA</option>
          <option value="consultoria" className="bg-[#161B22]">Consultoría</option>
          <option value="academy" className="bg-[#161B22]">Academy (duda)</option>
          <option value="otro" className="bg-[#161B22]">Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#8B95A9] mb-1.5">Mensaje *</label>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Cuéntanos qué necesitas..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-[#8B95A9]/50 text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-[#C9A84C] text-[#0D1117] font-bold text-sm hover:bg-[#C9A84C]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Enviando...</>
        ) : (
          <><Send size={15} /> Enviar mensaje</>
        )}
      </button>
    </form>
  );
}
