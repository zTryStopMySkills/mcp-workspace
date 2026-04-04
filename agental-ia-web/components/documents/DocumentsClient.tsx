"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, Search, Filter } from "lucide-react";
import type { DocumentWithStatus, FileType } from "@/types";
import { formatDate, fileTypeIcon, fileTypeBadgeColor, formatFileSize } from "@/lib/utils";

interface DocumentsClientProps {
  initialDocs: DocumentWithStatus[];
  agentId: string;
}

const fileTypes: { label: string; value: FileType | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "PDF", value: "pdf" },
  { label: "Imágenes", value: "image" },
  { label: "Vídeos", value: "video" },
  { label: "Texto", value: "text" },
  { label: "Otros", value: "other" }
];

export function DocumentsClient({ initialDocs }: DocumentsClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FileType | "all">("all");

  const filtered = initialDocs.filter((doc) => {
    const matchSearch =
      search === "" ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || doc.file_type === filter;
    return matchSearch && matchFilter;
  });

  const unseenCount = initialDocs.filter((d) => d.seen_at === null).length;

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Documentos</h1>
          {unseenCount > 0 && (
            <span className="text-sm bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full">
              {unseenCount} nuevos
            </span>
          )}
        </div>
        <p className="text-slate-400 text-sm">Materiales compartidos por el administrador</p>
      </motion.div>

      {/* Search + filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mt-6 mb-8"
      >
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar documentos..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter size={14} className="text-slate-500 shrink-0" />
          {fileTypes.map((ft) => (
            <button
              key={ft.value}
              onClick={() => setFilter(ft.value)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                filter === ft.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>{search || filter !== "all" ? "No se encontraron documentos con ese filtro." : "Aún no hay documentos."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/documentos/${doc.id}`}
                className="flex flex-col p-5 bg-white/[0.04] border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all group h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{fileTypeIcon(doc.file_type)}</span>
                  <div className="flex gap-2">
                    {doc.seen_at === null && (
                      <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                        NUEVO
                      </span>
                    )}
                    <span className={`text-xs border px-2 py-0.5 rounded-full ${fileTypeBadgeColor(doc.file_type)}`}>
                      {doc.file_type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{doc.description}</p>
                )}
                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <span>{formatDate(doc.created_at)}</span>
                  {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
