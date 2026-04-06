"use client";

import Link from "next/link";
import { Trash2, ExternalLink, Pin, PinOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkspaceItem } from "@/types";
// WorkspaceItem imported for type casting below
import { fileTypeIcon, formatDate, formatFileSize } from "@/lib/utils";
import { STATUS_LABELS } from "./ItemCard";

interface ListViewProps {
  items: WorkspaceItem[];
  selectedIds?: Set<string>;
  selectionMode?: boolean;
  onSelect?: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<WorkspaceItem>) => void;
  onDeleteItem: (id: string) => void;
  onMarkSeen: (item: WorkspaceItem) => void;
}

export function ListView({ items, selectedIds, selectionMode, onSelect, onUpdateItem, onDeleteItem, onMarkSeen }: ListViewProps) {
  if (items.length === 0) return null;

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[20px_auto_1fr_120px_90px_80px_80px] gap-3 px-4 py-2.5 bg-white/[0.03] border-b border-white/8 text-xs font-medium text-slate-500 uppercase tracking-wider">
        <span />
        <span className="w-6" />
        <span>Nombre</span>
        <span>Estado</span>
        <span>Fecha</span>
        <span>Tamaño</span>
        <span />
      </div>

      <AnimatePresence>
        {items.map((item, i) => {
          const doc = item.document;
          if (!doc) return null;
          const status = (item.status ?? "new") as string;
          const st = STATUS_LABELS[status] ?? STATUS_LABELS.new;
          const isSelected = selectedIds?.has(item.id) ?? false;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (selectionMode && onSelect) onSelect(item.id); }}
              className={`group grid grid-cols-[20px_auto_1fr_120px_90px_80px_80px] gap-3 items-center px-4 py-3 transition-colors ${
                isSelected ? "bg-[#00D4AA]/8" : "hover:bg-white/[0.04]"
              } ${i < items.length - 1 ? "border-b border-white/[0.05]" : ""} ${selectionMode ? "cursor-pointer" : ""}`}
            >
              {/* Checkbox */}
              {onSelect ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
                  className={`transition-all ${isSelected || selectionMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isSelected ? "bg-[#00D4AA] border-[#00D4AA]" : "border-white/30 bg-black/40 hover:border-[#00D4AA]/60"
                  }`}>
                    {isSelected && <Check size={9} className="text-black" strokeWidth={3} />}
                  </div>
                </button>
              ) : <span />}

              <span className="text-lg w-6">{fileTypeIcon(doc.file_type)}</span>

              <div className="min-w-0 flex items-center gap-2">
                {item.pinned && <Pin size={10} className="text-[#C9A84C] shrink-0" fill="#C9A84C" />}
                <Link
                  href={`/documentos/${doc.id}`}
                  onClick={() => onMarkSeen(item)}
                  className="text-sm text-slate-200 hover:text-white truncate transition-colors"
                >
                  {doc.title}
                </Link>
              </div>

              <div>
                <select
                  value={status}
                  onChange={(e) => onUpdateItem(item.id, { status: e.target.value as WorkspaceItem["status"] })}
                  className={`text-[10px] border px-2 py-1 rounded-lg bg-transparent cursor-pointer focus:outline-none w-full ${st.color}`}
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k} className="bg-[#0D1117] text-white">{v.label}</option>
                  ))}
                </select>
              </div>

              <span className="text-xs text-slate-500">{formatDate(doc.created_at)}</span>
              <span className="text-xs text-slate-600">{doc.file_size ? formatFileSize(doc.file_size) : "—"}</span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                <button
                  onClick={() => onUpdateItem(item.id, { pinned: !item.pinned })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    item.pinned ? "text-[#C9A84C]" : "text-slate-500 hover:text-[#C9A84C]"
                  }`}
                >
                  {item.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
