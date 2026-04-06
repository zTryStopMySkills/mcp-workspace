"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Edit2, Trash2, Check, X } from "lucide-react";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    color: string;
    item_count?: number;
    created_at: string;
  };
  selected?: boolean;
  selectionMode?: boolean;
  onSelect?: () => void;
  onOpen: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}

export function FolderCard({ folder, selected, selectionMode, onSelect, onOpen, onDelete, onRename }: FolderCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (renaming) inputRef.current?.select();
  }, [renaming]);

  function submitRename() {
    if (newName.trim() && newName.trim() !== folder.name) onRename(newName.trim());
    setRenaming(false);
  }

  function handleClick() {
    if (renaming) return;
    if (selectionMode && onSelect) { onSelect(); return; }
    onOpen();
  }

  const FolderSvg = () => (
    <svg viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-10">
      <path
        d="M2 8C2 5.8 3.8 4 6 4H18L22 8H42C44.2 8 46 9.8 46 12V34C46 36.2 44.2 38 42 38H6C3.8 38 2 36.2 2 34V8Z"
        fill={folder.color} fillOpacity={selected ? 0.45 : 0.25}
        stroke={folder.color} strokeWidth="2" strokeLinejoin="round"
      />
      <path d="M2 14H46" stroke={folder.color} strokeWidth="1.5" strokeOpacity="0.5" />
    </svg>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group"
    >
      <button
        onClick={handleClick}
        className={`w-full p-4 border rounded-2xl transition-all text-left flex flex-col items-center gap-2 ${
          selected
            ? "bg-[#00D4AA]/10 border-[#00D4AA]/40 ring-1 ring-[#00D4AA]/30"
            : "bg-white/[0.03] hover:bg-white/[0.07] border-white/8 hover:border-white/15"
        }`}
      >
        <FolderSvg />
        {renaming ? (
          <div className="w-full flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitRename(); if (e.key === "Escape") setRenaming(false); }}
              className="flex-1 min-w-0 bg-white/10 border border-[#00D4AA]/40 rounded-lg px-2 py-1 text-xs text-white outline-none text-center"
            />
            <button onClick={submitRename} className="text-[#00D4AA] hover:text-white shrink-0"><Check size={13} /></button>
            <button onClick={() => { setRenaming(false); setNewName(folder.name); }} className="text-slate-500 hover:text-white shrink-0"><X size={13} /></button>
          </div>
        ) : (
          <span className="text-xs font-medium text-slate-200 text-center leading-tight truncate w-full px-1">
            {folder.name}
          </span>
        )}
        <span className="text-xs text-slate-600">
          {folder.item_count ?? 0} {(folder.item_count ?? 0) === 1 ? "archivo" : "archivos"}
        </span>
      </button>

      {/* Checkbox (selection mode or hover) */}
      {onSelect && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`absolute top-2 left-2 transition-all ${
            selected || selectionMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-colors ${
            selected ? "bg-[#00D4AA] border-[#00D4AA]" : "border-white/30 bg-black/40 hover:border-[#00D4AA]/60"
          }`}>
            {selected && <Check size={10} className="text-black" strokeWidth={3} />}
          </div>
        </button>
      )}

      {/* Context menu */}
      {!selectionMode && (
        <div ref={menuRef} className="absolute top-2 right-2">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-black/40 text-slate-400 hover:text-white"
          >
            <MoreVertical size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-[#111827] border border-white/10 rounded-xl overflow-hidden z-30 shadow-2xl">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setRenaming(true); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Edit2 size={12} /> Renombrar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={12} /> Eliminar
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
