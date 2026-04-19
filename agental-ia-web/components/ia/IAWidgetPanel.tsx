"use client";

import { useState } from "react";
import { Brain, Wand2, ExternalLink, Send, TrendingUp } from "lucide-react";
import Link from "next/link";
import { IAResponseBlock } from "./shared/IAResponseBlock";
import { IAErrorAlert } from "./shared/IAErrorAlert";
import { IALoadingDots } from "./shared/IALoadingDots";
import type { TextoChannel, TextoObjective } from "@/types/ia";
import type { Quotation } from "@/types";

type WidgetTab = "coach" | "texto" | "cerebro";

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
          <span className="text-[#7DD3FC]">IA</span> Comercial
        </p>
        <Link
          href="/ia"
          className="text-xs text-slate-400 hover:text-[#7DD3FC] flex items-center gap-1 transition-colors"
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
              ? "bg-[#7DD3FC]/15 text-[#7DD3FC] border border-[#7DD3FC]/25"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <TrendingUp size={13} />
          Coach
        </button>
        <button
          onClick={() => setActiveTab("texto")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "texto"
              ? "bg-[#7DD3FC]/15 text-[#7DD3FC] border border-[#7DD3FC]/25"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Wand2 size={13} />
          Texto
        </button>
        <button
          onClick={() => setActiveTab("cerebro")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "cerebro"
              ? "bg-[#7DD3FC]/15 text-[#7DD3FC] border border-[#7DD3FC]/25"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Brain size={13} />
          Cerebro
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
        {activeTab === "cerebro" && <MiniBrainTab />}
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
        body: JSON.stringify({ question: q }),
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
          className="w-full py-2 rounded-lg bg-[#7DD3FC]/15 border border-[#7DD3FC]/25 text-[#7DD3FC] text-xs font-semibold hover:bg-[#7DD3FC]/25 transition-colors disabled:opacity-40"
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
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#7DD3FC]/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="px-2.5 py-1.5 rounded-lg bg-[#7DD3FC] text-black hover:bg-[#2DD4BF] transition-colors disabled:opacity-40"
        >
          <Send size={12} />
        </button>
      </form>

      {text && (
        <Link
          href="/ia?tab=coach"
          className="block text-center text-xs text-slate-400 hover:text-[#7DD3FC] transition-colors"
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
        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#7DD3FC]/50 appearance-none"
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
                ? "bg-[#7DD3FC]/15 border-[#7DD3FC]/30 text-[#7DD3FC]"
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
        className="w-full py-1.5 rounded-lg bg-[#7DD3FC]/15 border border-[#7DD3FC]/25 text-[#7DD3FC] text-xs font-semibold hover:bg-[#7DD3FC]/25 transition-colors disabled:opacity-40"
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
          className="block text-center text-xs text-slate-400 hover:text-[#7DD3FC] transition-colors"
        >
          Abre el generador completo →
        </Link>
      )}
    </div>
  );
}

function MiniBrainTab() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<{ source: string; section: string | null; similarity: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || isLoading) return;
    setIsLoading(true);
    setAnswer("");
    setSources([]);
    setError(null);
    setQuestion("");

    const res = await fetch("/api/rag/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: q }], limit: 4 }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Error ${res.status}` }));
      setError(err.error ?? "Error desconocido");
      setIsLoading(false);
      return;
    }

    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6);
        if (payload === "[DONE]") break;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "sources") setSources(ev.sources);
          else if (ev.type === "text") setAnswer((a) => a + ev.text);
        } catch {}
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-2.5">
      <form onSubmit={handleSubmit} className="flex gap-1.5">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pregunta sobre el proyecto..."
          disabled={isLoading}
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#7DD3FC]/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="px-2.5 py-1.5 rounded-lg bg-[#7DD3FC] text-black hover:bg-[#2DD4BF] transition-colors disabled:opacity-40"
        >
          <Send size={12} />
        </button>
      </form>

      {isLoading && !answer && <IALoadingDots />}
      {error && <IAErrorAlert message={error} onRetry={() => {}} />}
      {answer && <IAResponseBlock text={answer} isStreaming={isLoading} compact />}
      {sources.length > 0 && !isLoading && (
        <p className="text-[10px] text-slate-500">
          {sources.length} fuente{sources.length > 1 ? "s" : ""}:{" "}
          {sources.map((s) => s.source.split("/").pop()).join(", ")}
        </p>
      )}

      <Link
        href="/rag"
        className="block text-center text-xs text-slate-400 hover:text-[#7DD3FC] transition-colors"
      >
        Abrir Cerebro completo →
      </Link>
    </div>
  );
}
