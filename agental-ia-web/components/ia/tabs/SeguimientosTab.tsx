"use client";

import { useState } from "react";
import { MessageCircle, Mail, CheckCircle2, Phone } from "lucide-react";
import { IAResponseBlock } from "../shared/IAResponseBlock";
import { IAErrorAlert } from "../shared/IAErrorAlert";
import { IALoadingDots } from "../shared/IALoadingDots";
import type { OverdueFollowUp } from "@/types/ia";

interface SeguimientosTabProps {
  overdueFollowUps: OverdueFollowUp[];
}

type ChannelOpt = "whatsapp" | "email";

interface RowState {
  channel: ChannelOpt;
  generatedText: string;
  isLoading: boolean;
  error: string | null;
}

export function SeguimientosTab({ overdueFollowUps }: SeguimientosTabProps) {
  const [rows, setRows] = useState<Record<string, RowState>>(
    Object.fromEntries(
      overdueFollowUps.map((f) => [
        f.id,
        { channel: "whatsapp", generatedText: "", isLoading: false, error: null },
      ])
    )
  );

  const updateRow = (id: string, patch: Partial<RowState>) =>
    setRows((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const handleGenerate = async (followUp: OverdueFollowUp) => {
    const rowState = rows[followUp.id];
    if (rowState.isLoading) return;

    updateRow(followUp.id, { isLoading: true, generatedText: "", error: null });

    try {
      const res = await fetch("/api/ia/seguimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotationId: followUp.id, channel: rowState.channel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error generando mensaje");
      updateRow(followUp.id, { generatedText: data.text ?? "" });
    } catch (e) {
      updateRow(followUp.id, { error: e instanceof Error ? e.message : "Error desconocido" });
    } finally {
      updateRow(followUp.id, { isLoading: false });
    }
  };

  const getDaysOverdue = (date: string) => {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  };

  if (overdueFollowUps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/25 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} className="text-[#00D4AA]" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">¡Estás al día!</h3>
        <p className="text-sm text-slate-400 max-w-xs">
          No tienes seguimientos vencidos. Sigue así para mantener tu pipeline activo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">
        {overdueFollowUps.length} seguimiento{overdueFollowUps.length > 1 ? "s" : ""} pendiente{overdueFollowUps.length > 1 ? "s" : ""}.
        Genera el mensaje adecuado para cada uno.
      </p>

      {overdueFollowUps.map((followUp) => {
        const row = rows[followUp.id];
        const daysOverdue = getDaysOverdue(followUp.follow_up_date);
        const whatsappLink =
          row.channel === "whatsapp" && followUp.client_phone && row.generatedText
            ? `https://wa.me/${followUp.client_phone.replace(/\D/g, "")}?text=${encodeURIComponent(row.generatedText)}`
            : null;

        return (
          <div
            key={followUp.id}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{followUp.client_name}</p>
                {followUp.plan_name && (
                  <p className="text-xs text-slate-400 mt-0.5">{followUp.plan_name}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {followUp.client_phone && (
                  <a
                    href={`tel:${followUp.client_phone}`}
                    className="text-slate-400 hover:text-white transition-colors"
                    title={followUp.client_phone}
                  >
                    <Phone size={14} />
                  </a>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/15 border border-red-400/25 text-red-400">
                  {daysOverdue}d vencido
                </span>
              </div>
            </div>

            {/* Channel toggle + generate */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5">
                <button
                  onClick={() => updateRow(followUp.id, { channel: "whatsapp" })}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    row.channel === "whatsapp"
                      ? "bg-[#00D4AA]/15 text-[#00D4AA]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <MessageCircle size={12} />
                  WA
                </button>
                <button
                  onClick={() => updateRow(followUp.id, { channel: "email" })}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    row.channel === "email"
                      ? "bg-[#00D4AA]/15 text-[#00D4AA]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Mail size={12} />
                  Email
                </button>
              </div>

              <button
                onClick={() => handleGenerate(followUp)}
                disabled={row.isLoading}
                className="flex-1 py-1.5 rounded-lg bg-[#00D4AA]/15 border border-[#00D4AA]/25 text-[#00D4AA] text-xs font-semibold hover:bg-[#00D4AA]/25 transition-colors disabled:opacity-40"
              >
                {row.isLoading ? "Generando..." : row.generatedText ? "Regenerar" : "Generar mensaje"}
              </button>
            </div>

            {row.error && <IAErrorAlert message={row.error} onRetry={() => handleGenerate(followUp)} />}
            {row.isLoading && !row.generatedText && <IALoadingDots />}
            {row.generatedText && (
              <IAResponseBlock
                text={row.generatedText}
                compact
                extraActions={
                  whatsappLink ? (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                    >
                      <MessageCircle size={12} />
                      Abrir WA
                    </a>
                  ) : null
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
