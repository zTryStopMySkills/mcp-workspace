"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import type { WorkspaceItem } from "@/types";

interface UploadModalProps {
  folderId: string | null;
  onUploaded: (item: WorkspaceItem) => void;
  onClose: () => void;
}

export function UploadModal({ folderId, onUploaded, onClose }: UploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function addFiles(incoming: File[]) {
    setFiles((prev) => [...prev, ...incoming]);
  }

  async function handleUpload() {
    if (files.length === 0 || !folderId) {
      setError(folderId ? "Selecciona al menos un archivo" : "Abre una carpeta antes de subir archivos");
      return;
    }
    setError("");
    setUploading(true);
    setProgress({ current: 0, total: files.length });

    try {
      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length });
        const fd = new FormData();
        fd.append("file", files[i]);
        fd.append("folder_id", folderId);

        const res = await fetch("/api/workspace/upload", { method: "POST", body: fd });
        const data = await res.json();

        if (!res.ok) {
          setError(`Error en "${files[i].name}": ${data.error ?? "Error desconocido"}`);
          return;
        }

        // Build a minimal WorkspaceItem to update UI
        if (data.id) {
          onUploaded({ id: `tmp-${Date.now()}`, folder_id: folderId, agent_id: "", document_id: data.id, sent_by: null, seen_at: new Date().toISOString(), status: "reviewed", pinned: false, created_at: new Date().toISOString(), document: data } as WorkspaceItem);
        }
      }
      onClose();
    } catch {
      setError("Error inesperado al subir. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  function handleClose() {
    setError("");
    setFiles([]);
    onClose();
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={handleClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
      >
        <div className="bg-[#0D1117] border border-white/12 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Upload size={16} className="text-[#00D4AA]" />
              <h2 className="font-semibold text-white">Subir archivos</h2>
            </div>
            <button onClick={handleClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
          </div>

          {!folderId && (
            <div className="mb-4 px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
              Abre una carpeta primero para subir archivos dentro de ella.
            </div>
          )}

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(Array.from(e.dataTransfer.files)); }}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-4 ${
              dragOver ? "border-[#00D4AA] bg-[#00D4AA]/5" : "border-white/15 hover:border-white/30"
            }`}
          >
            <Upload size={24} className="mx-auto mb-2 text-slate-500" />
            <p className="text-sm text-slate-400">
              Arrastra archivos o <span className="text-[#00D4AA] underline">haz clic</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">PDF, DOCX, MD, TXT, imágenes, vídeos…</p>
            <input ref={fileRef} type="file" multiple onChange={(e) => addFiles(Array.from(e.target.files ?? []))} className="hidden" />
          </div>

          {files.length > 0 && (
            <div className="space-y-1.5 mb-4 max-h-36 overflow-y-auto">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-slate-300">
                  <span className="flex-1 truncate">{f.name}</span>
                  <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="text-slate-500 hover:text-white shrink-0"><X size={11} /></button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

          <div className="flex gap-2">
            <button onClick={handleClose} className="flex-1 py-2.5 text-sm text-slate-400 bg-white/5 border border-white/10 rounded-xl hover:text-white transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0 || !folderId}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-black bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-50 rounded-xl transition-colors"
            >
              {uploading && <Loader2 size={14} className="animate-spin" />}
              {uploading ? `Subiendo ${progress.current}/${progress.total}…` : `Subir${files.length > 1 ? ` ${files.length} archivos` : ""}`}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
