"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, FolderInput, ChevronRight, Home, Loader2 } from "lucide-react";
import type { WorkspaceFolder } from "@/types";

interface MoveFolderModalProps {
  folders: WorkspaceFolder[];
  currentFolderId: string | null;
  itemCount: number;
  onMove: (targetFolderId: string) => void;
  onClose: () => void;
}

export function MoveFolderModal({ folders, currentFolderId, itemCount, onMove, onClose }: MoveFolderModalProps) {
  const [browsing, setBrowsing] = useState<string | null>(null);
  const [path, setPath] = useState<WorkspaceFolder[]>([]);
  const [moving, setMoving] = useState(false);

  const visible = folders.filter((f) => f.parent_id === browsing && f.id !== currentFolderId);

  function navigateIn(folder: WorkspaceFolder) {
    setBrowsing(folder.id);
    setPath((p) => [...p, folder]);
  }

  function navigateTo(index: number) {
    if (index === -1) { setBrowsing(null); setPath([]); }
    else { setBrowsing(path[index].id); setPath(path.slice(0, index + 1)); }
  }

  async function handleMove() {
    if (!browsing) return;
    setMoving(true);
    onMove(browsing);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
      >
        <div className="bg-[#0D1117] border border-white/12 rounded-2xl shadow-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderInput size={16} className="text-[#00D4AA]" />
              <h2 className="font-semibold text-white text-sm">
                Mover {itemCount} {itemCount === 1 ? "archivo" : "archivos"}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16} /></button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-xs mb-3 flex-wrap">
            <button onClick={() => navigateTo(-1)}
              className={`flex items-center gap-1 transition-colors ${!browsing ? "text-[#00D4AA]" : "text-slate-400 hover:text-white"}`}>
              <Home size={11} /> Inicio
            </button>
            {path.map((f, i) => (
              <span key={f.id} className="flex items-center gap-1">
                <ChevronRight size={10} className="text-slate-600" />
                <button onClick={() => navigateTo(i)}
                  className={`transition-colors ${i === path.length - 1 ? "text-white" : "text-slate-400 hover:text-white"}`}>
                  {f.name}
                </button>
              </span>
            ))}
          </div>

          {/* Folder list */}
          <div className="space-y-1 max-h-52 overflow-y-auto mb-4">
            {visible.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No hay subcarpetas aquí</p>
            ) : (
              visible.map((f) => {
                const hasChildren = folders.some((c) => c.parent_id === f.id);
                return (
                  <div key={f.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    browsing === f.id ? "bg-[#00D4AA]/15 border border-[#00D4AA]/25" : "hover:bg-white/5 border border-transparent"
                  }`}
                    onClick={() => setBrowsing(f.id)}
                  >
                    <svg viewBox="0 0 24 20" fill="none" className="w-5 h-4 shrink-0">
                      <path d="M1 4C1 2.9 1.9 2 3 2H9L11 4H21C22.1 4 23 4.9 23 6V17C23 18.1 22.1 19 21 19H3C1.9 19 1 18.1 1 17V4Z"
                        fill={f.color} fillOpacity="0.25" stroke={f.color} strokeWidth="1.5" />
                    </svg>
                    <span className="text-sm text-slate-200 flex-1 truncate">{f.name}</span>
                    {hasChildren && (
                      <button onClick={(e) => { e.stopPropagation(); navigateIn(f); }}
                        className="text-slate-500 hover:text-white p-0.5 rounded transition-colors">
                        <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {browsing && (
            <p className="text-xs text-slate-500 mb-4">
              Destino: <span className="text-[#00D4AA]">{path[path.length - 1]?.name}</span>
            </p>
          )}

          <div className="flex gap-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 text-sm text-slate-400 bg-white/5 border border-white/10 rounded-xl hover:text-white transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleMove}
              disabled={!browsing || moving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-black bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-40 rounded-xl transition-colors"
            >
              {moving && <Loader2 size={13} className="animate-spin" />}
              Mover aquí
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
