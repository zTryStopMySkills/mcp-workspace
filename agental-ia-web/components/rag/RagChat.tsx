"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, ChevronDown, ChevronUp, Brain } from "lucide-react";

type Source = { source: string; section: string | null; similarity: number };
type Message = { id: string; role: "user" | "assistant"; content: string; sources?: Source[] };

const SUGGESTIONS = [
  "¿Cómo funciona el flujo completo de detección bot → cockpit → vídeo?",
  "¿Qué tablas hay en Supabase y para qué sirve cada una?",
  "¿Cuál es el stack técnico de cada módulo del ecosistema?",
  "¿Cómo se conecta el bot al Cockpit en tiempo real?",
  "¿Qué env vars necesita cada proyecto desplegado en Vercel?",
];

export function RagChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSources, setShowSources] = useState<Record<string, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text?: string) {
    const query = (text ?? input).trim();
    if (!query || loading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: query };
    const aId = crypto.randomUUID();
    setMessages((p) => [...p, userMsg, { id: aId, role: "assistant", content: "", sources: [] }]);
    setInput("");
    setLoading(true);

    const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
    const res = await fetch("/api/rag/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Error ${res.status}` }));
      setMessages((p) =>
        p.map((m) =>
          m.id === aId
            ? { ...m, content: `No se pudo obtener respuesta: ${err.error ?? res.status}` }
            : m
        )
      );
      setLoading(false);
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
          if (ev.type === "sources") setMessages((p) => p.map((m) => m.id === aId ? { ...m, sources: ev.sources } : m));
          else if (ev.type === "text") setMessages((p) => p.map((m) => m.id === aId ? { ...m, content: m.content + ev.text } : m));
        } catch {}
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center mt-16 gap-6">
            <div className="text-center text-[#9CA3AF]">
              <Brain className="mx-auto mb-3 opacity-30 text-[#7DD3FC]" size={44} />
              <p className="text-lg font-semibold text-white">Cerebro IA — CortesIA</p>
              <p className="text-sm mt-1">Pregunta sobre cualquier aspecto del ecosistema</p>
            </div>
            <div className="w-full max-w-xl grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="text-left text-sm text-[#9CA3AF] hover:text-white bg-[#1F2937] hover:bg-[#374151] border border-white/10 rounded-lg px-4 py-2.5 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[82%] rounded-xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-[#7DD3FC]/15 text-white border border-[#7DD3FC]/25"
                : "bg-[#1F2937] text-[#E5E7EB] border border-white/10"
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.content}
                {msg.role === "assistant" && loading && !msg.content && (
                  <Loader2 size={13} className="animate-spin inline ml-1 text-[#7DD3FC]" />
                )}
              </p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 border-t border-white/10 pt-2">
                  <button onClick={() => setShowSources((s) => ({ ...s, [msg.id]: !s[msg.id] }))}
                    className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#7DD3FC] transition-colors">
                    {showSources[msg.id] ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    {msg.sources.length} fuente{msg.sources.length > 1 ? "s" : ""}
                  </button>
                  {showSources[msg.id] && (
                    <ul className="mt-1 space-y-0.5">
                      {msg.sources.map((s, i) => (
                        <li key={i} className="text-xs">
                          <span className="text-[#7DD3FC]/60">{s.source}</span>
                          {s.section && <span className="text-[#6B7280]"> › {s.section}</span>}
                          <span className="ml-1 text-[#4B5563]">({Math.round(s.similarity * 100)}%)</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Pregunta sobre el ecosistema CortesIA..."
            disabled={loading}
            className="flex-1 bg-[#1F2937] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B5563] focus:outline-none focus:border-[#7DD3FC]/40 transition-colors" />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="bg-[#7DD3FC]/15 hover:bg-[#7DD3FC]/25 border border-[#7DD3FC]/25 text-[#7DD3FC] rounded-lg px-4 py-2.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
        <p className="text-xs text-[#374151] mt-2 text-center">Respuestas basadas en la documentación interna indexada</p>
      </div>
    </div>
  );
}
