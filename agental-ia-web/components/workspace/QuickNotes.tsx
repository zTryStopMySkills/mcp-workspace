"use client";

import { useState, useEffect, useRef } from "react";
import { StickyNote, Check } from "lucide-react";

export function QuickNotes() {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/workspace/preferences")
      .then((r) => r.json())
      .then((p) => {
        setNotes(p.quick_notes ?? "");
        setLoaded(true);
      });
  }, []);

  function handleChange(value: string) {
    setNotes(value);
    setSaved(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await fetch("/api/workspace/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quick_notes: value })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  }

  if (!loaded) return null;

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StickyNote size={14} className="text-[#C9A84C]" />
          <span className="text-xs font-medium text-slate-400">Notas rápidas</span>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-[10px] text-green-400">
            <Check size={10} />
            Guardado
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Apunta algo rápido… ideas, recordatorios, notas de llamadas"
        rows={4}
        className="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
      />
    </div>
  );
}
