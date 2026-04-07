"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Toast {
  id: string;
  title: string;
  docId: string;
}

export function DocToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("doc-toast")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "documents" },
        (payload) => {
          if (pathname === "/documentos") return;
          const doc = payload.new as { id: string; title: string; visibility: string };
          if (doc.visibility !== "all") return;

          const toast: Toast = { id: crypto.randomUUID(), title: doc.title, docId: doc.id };
          setToasts(prev => [...prev.slice(-2), toast]);
          setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 6000);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session, pathname]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-[#0D1117] border border-[#00D4AA]/30 rounded-2xl shadow-2xl shadow-black/50 max-w-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00D4AA]/15 border border-[#00D4AA]/25 flex items-center justify-center shrink-0">
              <FolderOpen size={15} className="text-[#00D4AA]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">Nuevo documento</p>
              <Link
                href={`/documentos/${toast.docId}`}
                className="text-xs text-[#00D4AA] truncate hover:underline block"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              >
                {toast.title}
              </Link>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-500 hover:text-white transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
