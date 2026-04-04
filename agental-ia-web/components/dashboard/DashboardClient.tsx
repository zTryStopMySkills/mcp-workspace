"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, MessageCircle, ArrowRight, FileText } from "lucide-react";
import type { DocumentWithStatus } from "@/types";
import { formatDate, fileTypeIcon, isNewDoc } from "@/lib/utils";

interface DashboardClientProps {
  agentName: string;
  agentNick: string;
  docs: DocumentWithStatus[];
  unseenCount: number;
  recentMessages: number;
}

export function DashboardClient({ agentName, agentNick, docs, unseenCount, recentMessages }: DashboardClientProps) {
  const hour = new Date().getHours();
  const greeting = hour < 13 ? "Buenos días" : hour < 20 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-slate-400 text-sm mb-1">{greeting},</p>
        <h1 className="text-3xl font-bold text-white">
          {agentName} <span className="text-slate-500 text-lg font-normal">@{agentNick}</span>
        </h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8"
      >
        <StatCard
          icon={<FolderOpen size={20} className="text-indigo-400" />}
          label="Docs sin leer"
          value={unseenCount}
          color="indigo"
          href="/documentos"
        />
        <StatCard
          icon={<MessageCircle size={20} className="text-amber-400" />}
          label="Mensajes (24h)"
          value={recentMessages}
          color="amber"
          href="/chat"
        />
        <StatCard
          icon={<FileText size={20} className="text-purple-400" />}
          label="Total documentos"
          value={docs.length}
          color="purple"
          href="/documentos"
        />
      </motion.div>

      {/* Recent docs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Documentos recientes</h2>
          <Link href="/documentos" className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FolderOpen size={36} className="mx-auto mb-3 opacity-40" />
            <p>Aún no hay documentos compartidos.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={`/documentos/${doc.id}`}
                  className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors group"
                >
                  <span className="text-2xl">{fileTypeIcon(doc.file_type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(doc.created_at)}</p>
                  </div>
                  {(doc.is_new || (doc.seen_at === null && isNewDoc(doc.created_at))) && (
                    <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full shrink-0">
                      NUEVO
                    </span>
                  )}
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
      >
        <Link
          href="/chat"
          className="flex items-center gap-4 p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl hover:bg-indigo-600/20 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
            <MessageCircle size={20} className="text-indigo-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Ir al chat</p>
            <p className="text-xs text-slate-400">Habla con el equipo</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition-colors" />
        </Link>

        <Link
          href="/documentos"
          className="flex items-center gap-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl hover:bg-amber-500/20 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-500/40 flex items-center justify-center">
            <FolderOpen size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Ver documentos</p>
            <p className="text-xs text-slate-400">Catálogos, contratos y más</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-amber-400 transition-colors" />
        </Link>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, color, href }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "indigo" | "amber" | "purple";
  href: string;
}) {
  const colors = {
    indigo: "bg-indigo-600/10 border-indigo-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    purple: "bg-purple-500/10 border-purple-500/20"
  };

  return (
    <Link href={href} className={`p-5 ${colors[color]} border rounded-2xl hover:brightness-125 transition-all`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="text-xs text-slate-400">{label}</p>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </Link>
  );
}
