"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, Trash2, Pin, PinOff, Check, MoveDown } from "lucide-react";
import type { WorkspaceItem } from "@/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fileTypeIcon, formatDate } from "@/lib/utils";
import { STATUS_LABELS } from "./ItemCard";

const COLUMNS = [
  { key: "new",       label: "Nuevo",      accent: "#00D4AA" },
  { key: "reviewed",  label: "Revisado",   accent: "#8B95A9" },
  { key: "pending",   label: "Pendiente",  accent: "#C9A84C" },
  { key: "completed", label: "Completado", accent: "#22C55E" }
];

interface BoardViewProps {
  items: WorkspaceItem[];
  loadingItems: boolean;
  selectedIds?: Set<string>;
  selectionMode?: boolean;
  onSelect?: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<WorkspaceItem>) => void;
  onDeleteItem: (id: string) => void;
  onMarkSeen: (item: WorkspaceItem) => void;
}

export function BoardView({ items, loadingItems, selectedIds, selectionMode, onSelect, onUpdateItem, onDeleteItem, onMarkSeen }: BoardViewProps) {
  const dragItem = useRef<WorkspaceItem | null>(null);

  function handleDragStart(item: WorkspaceItem) {
    dragItem.current = item;
  }

  function handleDrop(targetStatus: string) {
    const item = dragItem.current;
    if (!item || item.status === targetStatus) return;
    onUpdateItem(item.id, { status: targetStatus as WorkspaceItem["status"] });
    dragItem.current = null;
  }

  if (loadingItems) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-[#00D4AA]/50" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const colItems = items.filter((i) => (i.status ?? "new") === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.key)}
            className="flex flex-col min-h-[200px]"
          >
            {/* Column header */}
            <div
              className="flex items-center justify-between px-3 py-2 rounded-xl mb-3 border"
              style={{
                backgroundColor: `${col.accent}12`,
                borderColor: `${col.accent}30`
              }}
            >
              <span className="text-xs font-semibold" style={{ color: col.accent }}>
                {col.label}
              </span>
              <span
                className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${col.accent}20`, color: col.accent }}
              >
                {colItems.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 flex-1">
              <AnimatePresence>
                {colItems.map((item) => {
                  const doc = item.document;
                  if (!doc) return null;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      draggable={!selectionMode}
                      onDragStart={() => !selectionMode && handleDragStart(item)}
                      onClick={() => { if (selectionMode && onSelect) onSelect(item.id); }}
                      className={`group relative p-3 border rounded-xl transition-colors ${
                        selectionMode ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
                      } ${
                        (selectedIds?.has(item.id))
                          ? "bg-[#00D4AA]/10 border-[#00D4AA]/40"
                          : "bg-white/[0.04] hover:bg-white/[0.07] border-white/8"
                      }`}
                    >
                      {/* Checkbox */}
                      {onSelect && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
                          className={`absolute top-2 right-2 transition-all ${
                            selectedIds?.has(item.id) || selectionMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
                            selectedIds?.has(item.id) ? "bg-[#00D4AA] border-[#00D4AA]" : "border-white/30 bg-black/40 hover:border-[#00D4AA]/60"
                          }`}>
                            {selectedIds?.has(item.id) && <Check size={9} className="text-black" strokeWidth={3} />}
                          </div>
                        </button>
                      )}
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-base shrink-0">{fileTypeIcon(doc.file_type)}</span>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/documentos/${doc.id}`}
                            onClick={() => onMarkSeen(item)}
                            className="text-xs font-medium text-slate-200 hover:text-white line-clamp-2 leading-snug"
                          >
                            {doc.title}
                          </Link>
                          <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(doc.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {item.sent_by && !item.seen_at && (
                          <span className="text-[10px] text-[#C9A84C]">📨 Admin</span>
                        )}
                        <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onUpdateItem(item.id, { pinned: !item.pinned })}
                            className={`p-1 rounded transition-colors ${item.pinned ? "text-[#C9A84C]" : "text-slate-600 hover:text-[#C9A84C]"}`}
                          >
                            {item.pinned ? <PinOff size={11} /> : <Pin size={11} />}
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 rounded text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {colItems.length === 0 && (
                <div
                  className="flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-8 gap-2"
                  style={{ borderColor: `${col.accent}40` }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${col.accent}20` }}>
                    <MoveDown size={16} style={{ color: col.accent }} />
                  </div>
                  <p className="text-xs font-semibold" style={{ color: col.accent }}>Arrastra aquí</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
