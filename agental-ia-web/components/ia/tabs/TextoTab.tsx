"use client";

import { useState } from "react";
import { Wand2, MessageCircle, Mail, Phone, ExternalLink } from "lucide-react";
import { IAResponseBlock } from "../shared/IAResponseBlock";
import { IAErrorAlert } from "../shared/IAErrorAlert";
import { IALoadingDots } from "../shared/IALoadingDots";
import type { Quotation } from "@/types";
import type { TextoChannel, TextoObjective } from "@/types/ia";

interface TextoTabProps {
  quotations: Quotation[];
}

const channels: { value: TextoChannel; label: string; icon: React.ElementType }[] = [
  { value: "email", label: "Email", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "llamada", label: "Script llamada", icon: Phone },
];

const objectives: { value: TextoObjective; label: string }[] = [
  { value: "first_contact", label: "Primer contacto" },
  { value: "follow_up", label: "Seguimiento" },
  { value: "close", label: "Cierre de venta" },
  { value: "custom", label: "Personalizado" },
];

export function TextoTab({ quotations }: TextoTabProps) {
  const [selectedQuotationId, setSelectedQuotationId] = useState("");
  const [channel, setChannel] = useState<TextoChannel>("whatsapp");
  const [objective, setObjective] = useState<TextoObjective>("follow_up");
  const [customInstruction, setCustomInstruction] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedQuotation = quotations.find((q) => q.id === selectedQuotationId);

  const handleGenerate = async () => {
    if (!selectedQuotationId || isLoading) return;
    setIsLoading(true);
    setGeneratedText("");
    setError(null);

    try {
      const res = await fetch("/api/ia/texto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotationId: selectedQuotationId,
          channel,
          objective,
          customInstruction: objective === "custom" ? customInstruction : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error generando texto");
      setGeneratedText(data.text ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappLink =
    channel === "whatsapp" && selectedQuotation?.client_phone && generatedText
      ? `https://wa.me/${selectedQuotation.client_phone.replace(/\D/g, "")}?text=${encodeURIComponent(generatedText)}`
      : null;

  return (
    <div className="space-y-5">
      {/* Step 1: Config */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Wand2 size={16} className="text-[#00D4AA]" />
          Configurar generación
        </h3>

        {/* Quotation selector */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Propuesta</label>
          <select
            value={selectedQuotationId}
            onChange={(e) => setSelectedQuotationId(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D4AA]/50 appearance-none"
          >
            <option value="">Selecciona una propuesta...</option>
            {quotations.map((q) => (
              <option key={q.id} value={q.id}>
                {q.client_name} — {q.plan_name} ({q.total_once.toLocaleString("es-ES")}€) [{q.status}]
              </option>
            ))}
          </select>
        </div>

        {/* Channel */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Canal</label>
          <div className="flex gap-2">
            {channels.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setChannel(value)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  channel === value
                    ? "bg-[#00D4AA]/15 border-[#00D4AA]/40 text-[#00D4AA]"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Objective */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Objetivo</label>
          <div className="grid grid-cols-2 gap-2">
            {objectives.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setObjective(value)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  objective === value
                    ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom instruction */}
        {objective === "custom" && (
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Instrucción personalizada</label>
            <textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Describe qué quieres comunicar..."
              rows={2}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4AA]/50 resize-none"
            />
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!selectedQuotationId || isLoading}
          className="w-full py-2.5 rounded-xl bg-[#00D4AA] text-black text-sm font-semibold hover:bg-[#2DD4BF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Wand2 size={15} />
          {isLoading ? "Generando..." : "Generar texto"}
        </button>
      </div>

      {/* Step 2: Output */}
      {error && <IAErrorAlert message={error} onRetry={handleGenerate} />}
      {isLoading && !generatedText && <IALoadingDots />}
      {generatedText && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Texto generado</h3>
          <IAResponseBlock
            text={generatedText}
            extraActions={
              whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors"
                >
                  <ExternalLink size={13} />
                  Abrir en WhatsApp
                </a>
              ) : null
            }
          />
        </div>
      )}
    </div>
  );
}
