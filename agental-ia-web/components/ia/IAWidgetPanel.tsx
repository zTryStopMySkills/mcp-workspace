"use client";

import { useState } from "react";
import { Brain, Wand2, ExternalLink, Send } from "lucide-react";
import Link from "next/link";
import { IAResponseBlock } from "./shared/IAResponseBlock";
import { IAErrorAlert } from "./shared/IAErrorAlert";
import { IALoadingDots } from "./shared/IALoadingDots";
import type { TextoChannel, TextoObjective } from "@/types/ia";
import type { Quotation } from "@/types";

type WidgetTab = "coach" | "texto";

interface IAWidgetPanelProps {
  quotations: Quotation[];
  agentStats?: object;
  teamStats?: object;
  overdueCount?: number;
}

export function IAWidgetPanel({ quotations, agentStats, teamStats, overdueCount = 0 }: IAWidgetPanelProps) {
  const [activeTab, setActiveTab] = useState<WidgetTab>("coach");

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <p className="text-sm font-semibold text-white">
          <span className="text-[#00D4AA]">IA</span> Comercial
        </p>
        <Link
          href="/ia"
          className="text-xs text-slate-400 hover:text-[#00D4AA] flex items-center gap-1 transition-colors"
        >
          <ExternalLink size={12} />
          Ver completo
        </Link>
      </div>

      {/* Mini tabs */}
      <div className="flex gap-1 p-2 border-b border-white/8">
        <button
          onClick={() => setActiveTab("coach")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "coach"
              ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Brain size={13} />
          Coach
        </button>
        <button
          onClick={() => setActiveTab("texto")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "texto"
              ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Wand2 size={13} />
          Texto
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "coach" && (
          <MiniCoachTab
            agentStats={agentStats}
            teamStats={teamStats}
            overdueCount={overdueCount}
          />
        )}
        {activeTab === "texto" && <MiniTextoTab quotations={quotations} />}
      </div>
    </div>
  );
}

function MiniCoachTab({
  agentStats,
  teamStats,
  overdueCount,
}: {
  agentStats?: object;
  teamStats?: object;
  overdueCount?: number;
}) {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoach = async (q?: string) => {
    if (!agentStats || !teamStats) return;
    setIsLoading(true);
    setText("");
    setError(null);

    try {
      const res = await fetch("/api/ia/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, agentStats, teamStats, overdueCount: overdueCount ?? 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setText(data.text ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    fetchCoach(question.trim());
    setQuestion("");
  };

  return (
    <div className="space-y-3">
      {!text && !isLoading && !error && (
        <button
          onClick={() => fetchCoach()}
          disabled={!agentStats}
          className="w-full py-2 rounded-lg bg-[#00D4AA]/15 border border-[#00D4AA]/25 text-[#00D4AA] text-xs font-semibold hover:bg-[#00D4AA]/25 transition-colors disabled:opacity-40"
        >
          Obtener consejo rápido
        </button>
      )}

      {error && <IAErrorAlert message={error} onRetry={() => fetchCoach()} />}
      {isLoading && !text && <IALoadingDots />}
      {(text || (isLoading && text)) && (
        <IAResponseBlock text={text} isStreaming={isLoading} compact />
      )}

      <form onSubmit={handleSubmit} className="flex gap-1.5">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pregunta al coach..."
          disabled={isLoading}
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4AA]/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="px-2.5 py-1.5 rounded-lg bg-[#00D4AA] text-black hover:bg-[#2DD4BF] transition-colors disabled:opacity-40"
        >
          <Send size={12} />
        </button>
      </form>

      {text && (
        <Link
          href="/ia?tab=coach"
          className="block text-center text-xs text-slate-400 hover:text-[#00D4AA] transition-colors"
        >
          Ver análisis completo →
        </Link>
      )}
    </div>
  );
}

function MiniTextoTab({ quotations }: { quotations: Quotation[] }) {
  const [quotationId, setQuotationId] = useState("");
  const [channel, setChannel] = useState<TextoChannel>("whatsapp");
  const [objective, setObjective] = useState<TextoObjective>("follow_up");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedQ = quotations.find((q) => q.id === quotationId);
  const whatsappLink =
    channel === "whatsapp" && selectedQ?.client_phone && text
      ? `https://wa.me/${selectedQ.client_phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`
      : null;

  const handleGenerate = async () => {
    if (!quotationId || isLoading) return;
    setIsLoading(true);
    setText("");
    setError(null);
    try {
      const res = await fetch("/api/ia/texto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotationId, channel, objective }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setText(data.text ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <select
        value={quotationId}
        onChange={(e) => setQuotationId(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D4AA]/50 appearance-none"
      >
        <option value="">Selecciona propuesta...</option>
        {quotations.slice(0, 10).map((q) => (
          <option key={q.id} value={q.id}>
            {q.client_name} [{q.status}]
          </option>
        ))}
      </select>

      <div className="flex gap-1">
        {(["whatsapp", "email"] as TextoChannel[]).map((c) => (
          <button
            key={c}
            onClick={() => setChannel(c)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              channel === c
                ? "bg-[#00D4AA]/15 border-[#00D4AA]/30 text-[#00D4AA]"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {c === "whatsapp" ? "WhatsApp" : "Email"}
          </button>
        ))}
      </div>

      <select
        value={objective}
        onChange={(e) => setObjective(e.target.value as TextoObjective)}
        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none appearance-none"
      >
        <option value="first_contact">Primer contacto</option>
        <option value="follow_up">Seguimiento</option>
        <option value="close">Cierre</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={!quotationId || isLoading}
        className="w-full py-1.5 rounded-lg bg-[#00D4AA]/15 border border-[#00D4AA]/25 text-[#00D4AA] text-xs font-semibold hover:bg-[#00D4AA]/25 transition-colors disabled:opacity-40"
      >
        {isLoading ? "Generando..." : "Generar texto"}
      </button>

      {error && <IAErrorAlert message={error} />}
      {isLoading && !text && <IALoadingDots />}
      {text && (
        <IAResponseBlock
          text={text}
          compact
          extraActions={
            whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-400 hover:text-green-300 transition-colors"
              >
                → WA
              </a>
            ) : null
          }
        />
      )}

      {text && (
        <Link
          href="/ia?tab=textos"
          className="block text-center text-xs text-slate-400 hover:text-[#00D4AA] transition-colors"
        >
          Abre el generador completo →
        </Link>
      )}
    </div>
  );
}
