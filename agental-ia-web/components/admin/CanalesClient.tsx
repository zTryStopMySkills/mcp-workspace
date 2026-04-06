"use client";

import { useState } from "react";
import { Hash, Plus, Trash2, Loader2, Star } from "lucide-react";
import type { Channel } from "@/types";

const COLORS = [
  "#00D4AA", "#C9A84C", "#6366f1", "#ec4899", "#f97316", "#22c55e", "#3b82f6", "#a855f7"
];

interface Props { initialChannels: Channel[] }

export function CanalesClient({ initialChannels }: Props) {
  const [channels, setChannels] = useState(initialChannels);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim().toLowerCase().replace(/\s+/g, "-"), description: description.trim() || null, color }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al crear el canal"); return; }
      setChannels(prev => [...prev, data]);
      setName("");
      setDescription("");
      setColor(COLORS[0]);
    } catch { setError("Error de red"); } finally { setCreating(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este canal? Los mensajes del canal NO se eliminarán.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/channels/${id}`, { method: "DELETE" });
      setChannels(prev => prev.filter(c => c.id !== id));
    } catch { /* ignore */ } finally { setDeleting(null); }
  }

  return (
    <div className="space-y-6">
      {/* Channel list */}
      <div className="space-y-2">
        {channels.map(ch => (
          <div
            key={ch.id}
            className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: ch.color + "22", border: `1px solid ${ch.color}44` }}>
              <Hash size={16} style={{ color: ch.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">#{ch.name}</p>
                {ch.is_default && (
                  <span className="flex items-center gap-1 text-[10px] text-[#C9A84C] bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-1.5 py-0.5 rounded-full">
                    <Star size={9} /> Por defecto
                  </span>
                )}
              </div>
              {ch.description && <p className="text-xs text-slate-500 truncate">{ch.description}</p>}
            </div>
            {!ch.is_default && (
              <button
                onClick={() => handleDelete(ch.id)}
                disabled={deleting === ch.id}
                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
              >
                {deleting === ch.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Nuevo canal</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Nombre del canal</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ventas-norte"
              maxLength={40}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Descripción (opcional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Canal para el equipo de ventas norte"
              maxLength={100}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? "scale-125 border-white" : "border-transparent hover:scale-110"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-40 text-black font-semibold rounded-xl text-sm transition-colors"
        >
          {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Crear canal
        </button>
      </form>
    </div>
  );
}
