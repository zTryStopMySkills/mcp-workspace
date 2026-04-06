"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, MessageCircle, FolderOpen, X, Loader2 } from "lucide-react";
import type { SearchResult } from "@/types";

const TYPE_ICONS = {
  document: <FileText size={14} className="text-[#00D4AA]" />,
  message: <MessageCircle size={14} className="text-indigo-400" />,
  workspace_item: <FolderOpen size={14} className="text-amber-400" />
};

const TYPE_LABELS = {
  document: "Documento",
  message: "Mensaje",
  workspace_item: "Escritorio"
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Abrir con Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelected(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setSelected(0);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[selected]) {
      router.push(results[selected].href);
      setOpen(false);
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/8 text-[#8B95A9] hover:text-white hover:bg-white/[0.07] transition-all text-sm w-full max-w-xs"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Buscar…</span>
        <kbd className="text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono">Ctrl K</kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
            >
              <div className="bg-[#0D1117] border border-white/12 rounded-2xl shadow-2xl overflow-hidden" style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,170,0.1)" }}>
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
                  {loading ? (
                    <Loader2 size={16} className="text-[#00D4AA] animate-spin shrink-0" />
                  ) : (
                    <Search size={16} className="text-[#8B95A9] shrink-0" />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar documentos, mensajes, escritorio…"
                    className="flex-1 bg-transparent text-white placeholder-[#8B95A9] text-sm focus:outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-[#8B95A9] hover:text-white transition-colors shrink-0">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Results */}
                {results.length > 0 ? (
                  <ul className="py-2 max-h-80 overflow-y-auto">
                    {results.map((r, i) => (
                      <li key={r.id + r.type}>
                        <Link
                          href={r.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                            i === selected ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                          }`}
                          onMouseEnter={() => setSelected(i)}
                        >
                          <div className="shrink-0">{TYPE_ICONS[r.type]}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{r.title}</p>
                            <p className="text-xs text-[#8B95A9]/60 truncate">{r.subtitle}</p>
                          </div>
                          <span className="text-[10px] text-[#8B95A9]/40 shrink-0 border border-white/8 rounded px-1.5 py-0.5">
                            {TYPE_LABELS[r.type]}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : query.length >= 2 && !loading ? (
                  <div className="py-10 text-center text-sm text-[#8B95A9]/60">
                    Sin resultados para &ldquo;{query}&rdquo;
                  </div>
                ) : query.length < 2 ? (
                  <div className="py-8 text-center text-xs text-[#8B95A9]/40">
                    Escribe al menos 2 caracteres para buscar
                  </div>
                ) : null}

                {/* Footer hint */}
                <div className="flex items-center gap-3 px-4 py-2.5 border-t border-white/8 text-[10px] text-[#8B95A9]/40">
                  <span><kbd className="font-mono bg-white/5 border border-white/10 rounded px-1">↑↓</kbd> navegar</span>
                  <span><kbd className="font-mono bg-white/5 border border-white/10 rounded px-1">Enter</kbd> abrir</span>
                  <span><kbd className="font-mono bg-white/5 border border-white/10 rounded px-1">Esc</kbd> cerrar</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
