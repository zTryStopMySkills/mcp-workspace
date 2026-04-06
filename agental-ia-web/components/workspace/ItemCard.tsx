"use client";

import { motion } from "framer-motion";
import { Trash2, ExternalLink, Pin, PinOff, Check } from "lucide-react";
import Link from "next/link";
import type { WorkspaceItem } from "@/types";
import { fileTypeIcon, fileTypeBadgeColor, formatDate, formatFileSize } from "@/lib/utils";

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: "Nuevo",      color: "bg-[#00D4AA]/15 text-[#00D4AA] border-[#00D4AA]/30" },
  reviewed:  { label: "Visto",      color: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
  pending:   { label: "Pendiente",  color: "bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/30" },
  completed: { label: "Completado", color: "bg-green-500/15 text-green-400 border-green-500/30" }
};

interface ItemCardProps {
  item: WorkspaceItem;
  selected?: boolean;
  selectionMode?: boolean;
  onSelect?: () => void;
  onDelete: () => void;
  onOpen: () => void;
  onPin: () => void;
  onStatusChange: (s: string) => void;
}

export function ItemCard({ item, selected, selectionMode, onSelect, onDelete, onOpen, onPin, onStatusChange }: ItemCardProps) {
  const doc = item.document;
  if (!doc) return null;

  const status = (item.status ?? "new") as string;
  const st = STATUS_LABELS[status] ?? STATUS_LABELS.new;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={() => { if (selectionMode && onSelect) onSelect(); }}
      className={`group relative flex flex-col gap-3 p-4 border rounded-xl transition-all ${
        selectionMode ? "cursor-pointer" : ""
      } ${
        selected
          ? "bg-[#00D4AA]/10 border-[#00D4AA]/40 ring-1 ring-[#00D4AA]/30"
          : "bg-white/[0.03] hover:bg-white/[0.06] border-white/8 hover:border-white/15"
      }`}
    >
      {/* Checkbox */}
      {onSelect && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`absolute top-2 right-2 transition-all z-10 ${
            selected || selectionMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${
            selected ? "bg-[#00D4AA] border-[#00D4AA]" : "border-white/30 bg-black/40 hover:border-[#00D4AA]/60"
          }`}>
            {selected && <Check size={9} className="text-black" strokeWidth={3} />}
          </div>
        </button>
      )}
      {/* Pin indicator */}
      {item.pinned && (
        <div className="absolute top-2 left-2">
          <Pin size={11} className="text-[#C9A84C]" fill="#C9A84C" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-0.5">{fileTypeIcon(doc.file_type)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate leading-snug pr-2">{doc.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-[10px] border px-1.5 py-0.5 rounded-full ${fileTypeBadgeColor(doc.file_type)}`}>
              {doc.file_type.toUpperCase()}
            </span>
            <span className="text-[11px] text-slate-500">{formatDate(doc.created_at)}</span>
            {doc.file_size && <span className="text-[11px] text-slate-600">{formatFileSize(doc.file_size)}</span>}
          </div>
          {doc.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{doc.description}</p>
          )}
        </div>
      </div>

      {/* Status + actions row */}
      <div className="flex items-center justify-between gap-2">
        <select
          value={status}
          onChange={(e) => { e.stopPropagation(); onStatusChange(e.target.value); }}
          className={`text-[10px] border px-2 py-1 rounded-lg bg-transparent cursor-pointer focus:outline-none transition-colors ${st.color}`}
        >
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k} className="bg-[#0D1117] text-white">{v.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onPin}
            className={`p-1.5 rounded-lg transition-colors ${
              item.pinned
                ? "bg-[#C9A84C]/20 text-[#C9A84C]"
                : "bg-white/5 hover:bg-[#C9A84C]/15 text-slate-500 hover:text-[#C9A84C]"
            }`}
            title={item.pinned ? "Desanclar" : "Anclar arriba"}
          >
            {item.pinned ? <PinOff size={12} /> : <Pin size={12} />}
          </button>
          <Link
            href={`/documentos/${doc.id}`}
            onClick={onOpen}
            className="p-1.5 rounded-lg bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 text-[#00D4AA] transition-colors"
            title="Abrir"
          >
            <ExternalLink size={12} />
          </Link>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            title="Quitar de carpeta"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {item.sent_by && !item.seen_at && (
        <p className="text-[10px] text-[#C9A84C]">📨 Enviado por admin</p>
      )}
    </motion.div>
  );
}
