"use client";

import { motion } from "framer-motion";
import { Trash2, FolderInput, CheckSquare, X, Square } from "lucide-react";
import { STATUS_LABELS } from "./ItemCard";

interface BulkActionBarProps {
  selectedCount: number;
  itemCount: number;       // how many of selected are items (not folders)
  folderCount: number;     // how many of selected are folders
  allCount: number;        // total visible items+folders
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onMoveSelected: () => void;
  onStatusSelected: (status: string) => void;
}

export function BulkActionBar({
  selectedCount, itemCount, folderCount, allCount,
  onSelectAll, onClearSelection, onDeleteSelected, onMoveSelected, onStatusSelected
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  const allSelected = selectedCount === allCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-[#0D1117]/95 backdrop-blur-md border border-[#00D4AA]/30 rounded-2xl shadow-2xl shadow-black/60"
    >
      {/* Select all / count */}
      <button
        onClick={allSelected ? onClearSelection : onSelectAll}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/8 transition-colors text-sm text-slate-300 hover:text-white"
      >
        {allSelected
          ? <CheckSquare size={15} className="text-[#00D4AA]" />
          : <Square size={15} className="text-slate-500" />
        }
        <span className="font-medium text-[#00D4AA]">{selectedCount}</span>
        <span className="text-slate-400 text-xs">seleccionado{selectedCount > 1 ? "s" : ""}</span>
      </button>

      <div className="w-px h-6 bg-white/10" />

      {/* Move — only for items */}
      {itemCount > 0 && (
        <button
          onClick={onMoveSelected}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#00D4AA]/15 border border-white/10 hover:border-[#00D4AA]/30 text-xs text-slate-300 hover:text-[#00D4AA] transition-all"
        >
          <FolderInput size={14} />
          Mover{itemCount < selectedCount ? ` ${itemCount}` : ""}
        </button>
      )}

      {/* Status — only for items */}
      {itemCount > 0 && (
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 text-xs text-slate-300 hover:text-white transition-all">
            <CheckSquare size={14} />
            Estado
          </button>
          <div className="absolute bottom-full mb-2 left-0 w-36 bg-[#0D1117] border border-white/12 rounded-xl overflow-hidden shadow-2xl hidden group-hover:block">
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => onStatusSelected(k)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors hover:bg-white/5 ${v.color.includes("00D4AA") ? "text-[#00D4AA]" : v.color.includes("C9A84C") ? "text-[#C9A84C]" : v.color.includes("green") ? "text-green-400" : "text-slate-400"}`}
              >
                <span className={`w-2 h-2 rounded-full border ${v.color}`} />
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Delete */}
      <button
        onClick={onDeleteSelected}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-xs text-red-400 hover:text-red-300 transition-all"
      >
        <Trash2 size={14} />
        Eliminar
      </button>

      <div className="w-px h-6 bg-white/10" />

      {/* Close */}
      <button
        onClick={onClearSelection}
        className="p-1.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
}
