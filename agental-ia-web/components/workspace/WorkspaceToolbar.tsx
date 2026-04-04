"use client";

import { LayoutGrid, List, Columns, SortAsc, SortDesc, Plus, Upload, FileText } from "lucide-react";
import type { ViewMode, SortMode } from "./WorkspaceClient";

interface WorkspaceToolbarProps {
  viewMode: ViewMode;
  sortMode: SortMode;
  onViewChange: (v: ViewMode) => void;
  onSortChange: (s: SortMode) => void;
  onNewFolder: () => void;
  onUpload: () => void;
  onNewDoc: () => void;
}

const VIEWS: { key: ViewMode; icon: React.ReactNode; label: string }[] = [
  { key: "grid", icon: <LayoutGrid size={15} />, label: "Cuadrícula" },
  { key: "list", icon: <List size={15} />, label: "Lista" },
  { key: "board", icon: <Columns size={15} />, label: "Board" }
];

const SORTS = [
  { key: "name-asc", label: "Nombre A-Z" },
  { key: "name-desc", label: "Nombre Z-A" },
  { key: "date-desc", label: "Más reciente" },
  { key: "date-asc", label: "Más antiguo" }
];

export function WorkspaceToolbar({
  viewMode, sortMode, onViewChange, onSortChange,
  onNewFolder, onUpload, onNewDoc
}: WorkspaceToolbarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {/* View toggle */}
      <div className="flex bg-white/[0.04] border border-white/10 rounded-xl p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => onViewChange(v.key)}
            title={v.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === v.key
                ? "bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {v.icon}
            <span className="hidden sm:inline">{v.label}</span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="relative group">
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white/[0.04] border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
          {sortMode.includes("asc") ? <SortAsc size={14} /> : <SortDesc size={14} />}
          <span className="hidden sm:inline text-xs">Ordenar</span>
        </button>
        <div className="absolute right-0 top-full mt-1 w-40 bg-[#0D1117] border border-white/10 rounded-xl overflow-hidden z-20 hidden group-hover:block shadow-2xl">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => onSortChange(s.key as SortMode)}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                sortMode === s.key
                  ? "text-[#00D4AA] bg-[#00D4AA]/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onUpload}
        className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
      >
        <Upload size={14} />
        <span className="hidden sm:inline text-xs">Subir</span>
      </button>

      <button
        onClick={onNewDoc}
        className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
      >
        <FileText size={14} />
        <span className="hidden sm:inline text-xs">Nuevo doc</span>
      </button>

      <button
        onClick={onNewFolder}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#00D4AA] hover:bg-[#00D4AA]/80 text-black font-semibold rounded-xl text-sm transition-colors"
      >
        <Plus size={14} />
        <span className="hidden sm:inline text-xs">Carpeta</span>
      </button>
    </div>
  );
}
