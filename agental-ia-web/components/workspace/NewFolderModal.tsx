"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, FolderPlus, Loader2 } from "lucide-react";
import type { WorkspaceFolder } from "@/types";

const COLORS = [
  { hex: "#00D4AA", label: "Teal" },
  { hex: "#C9A84C", label: "Gold" },
  { hex: "#8B5CF6", label: "Purple" },
  { hex: "#EF4444", label: "Red" },
  { hex: "#3B82F6", label: "Blue" },
  { hex: "#EC4899", label: "Pink" },
  { hex: "#22C55E", label: "Green" },
  { hex: "#F97316", label: "Orange" }
];

interface NewFolderModalProps {
  parentId: string | null;
  onCreated: (folder: WorkspaceFolder) => void;
  onClose: () => void;
}

export function NewFolderModal({ parentId, onCreated, onClose }: NewFolderModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#00D4AA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!name.trim()) { setError("El nombre es obligatorio"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/workspace/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), parent_id: parentId, color })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Error al crear carpeta"); return; }
    onCreated(data as WorkspaceFolder);
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
      >
        <div className="bg-[#0D1117] border border-white/12 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FolderPlus size={18} className="text-[#00D4AA]" />
              <h2 className="font-semibold text-white">Nueva carpeta</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre</label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") onClose(); }}
                placeholder="Mi carpeta"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c.hex)}
                    title={c.label}
                    className={`w-7 h-7 rounded-full transition-all ${
                      color === c.hex ? "ring-2 ring-white ring-offset-2 ring-offset-[#0D1117] scale-110" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/8">
              <svg viewBox="0 0 48 40" fill="none" className="w-10 h-8 shrink-0">
                <path
                  d="M2 8C2 5.8 3.8 4 6 4H18L22 8H42C44.2 8 46 9.8 46 12V34C46 36.2 44.2 38 42 38H6C3.8 38 2 36.2 2 34V8Z"
                  fill={color}
                  fillOpacity="0.25"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path d="M2 14H46" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
              </svg>
              <span className="text-sm text-slate-300 truncate">{name || "Mi carpeta"}</span>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-black bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-50 rounded-xl transition-colors"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Crear
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
