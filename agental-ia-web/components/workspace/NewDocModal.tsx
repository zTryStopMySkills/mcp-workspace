"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, FileText, Loader2, Eye, Code } from "lucide-react";
import type { WorkspaceItem } from "@/types";

type DocFormat = "txt" | "md" | "html";

interface NewDocModalProps {
  folderId: string | null;
  onCreated: (item: WorkspaceItem) => void;
  onClose: () => void;
}

export function NewDocModal({ folderId, onCreated, onClose }: NewDocModalProps) {
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<DocFormat>("txt");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!title.trim()) { setError("El título es obligatorio"); return; }
    if (!folderId) { setError("Abre una carpeta primero"); return; }
    setError("");
    setSaving(true);

    const fileName = `${title.trim().replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}.${format}`;
    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], fileName, { type: "text/plain" });

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder_id", folderId);
    fd.append("title", title.trim());

    const res = await fetch("/api/workspace/upload", { method: "POST", body: fd });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error ?? "Error al guardar"); return; }

    onCreated({ id: `tmp-${Date.now()}`, folder_id: folderId, agent_id: "", document_id: data.id, sent_by: null, seen_at: new Date().toISOString(), status: "reviewed", pinned: false, created_at: new Date().toISOString(), document: data } as WorkspaceItem);
    onClose();
  }

  const FORMATS: { key: DocFormat; label: string; placeholder: string }[] = [
    { key: "txt", label: "TXT", placeholder: "Escribe aquí tu texto plano…" },
    { key: "md",  label: "MD",  placeholder: "# Título\n\nEscribe en **Markdown**…" },
    { key: "html",label: "HTML",placeholder: "<!DOCTYPE html>\n<html>\n<body>\n\n</body>\n</html>" }
  ];

  const currentFormat = FORMATS.find((f) => f.key === format)!;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
      >
        <div className="bg-[#0D1117] border border-white/12 rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#00D4AA]" />
              <h2 className="font-semibold text-white">Nuevo documento</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>

          {!folderId && (
            <div className="mb-4 px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
              Abre una carpeta primero para guardar el documento dentro de ella.
            </div>
          )}

          {/* Title + format */}
          <div className="flex gap-3 mb-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del documento"
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
            />
            <div className="flex bg-white/[0.04] border border-white/10 rounded-xl p-0.5">
              {FORMATS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFormat(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    format === f.key
                      ? "bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/25"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editor / Preview toggle for MD */}
          {format === "md" && (
            <div className="flex gap-2 mb-2">
              <button onClick={() => setPreview(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${!preview ? "text-[#00D4AA] bg-[#00D4AA]/10" : "text-slate-500 hover:text-white"}`}>
                <Code size={12} /> Editor
              </button>
              <button onClick={() => setPreview(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${preview ? "text-[#00D4AA] bg-[#00D4AA]/10" : "text-slate-500 hover:text-white"}`}>
                <Eye size={12} /> Preview
              </button>
            </div>
          )}

          {/* Editor */}
          {preview && format === "md" ? (
            <div
              className="w-full h-64 px-4 py-3 bg-white/[0.03] border border-white/8 rounded-xl text-sm text-slate-300 overflow-y-auto prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content.replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }}
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={currentFormat.placeholder}
              rows={10}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/8 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00D4AA]/30 transition-colors resize-none font-mono"
            />
          )}

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-400 bg-white/5 border border-white/10 rounded-xl hover:text-white transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !folderId}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-black bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-50 rounded-xl transition-colors"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Guardar {format.toUpperCase()}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
