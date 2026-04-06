"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, FileText, MessageCircle, Calculator, Info, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Notification } from "@/types";
import { formatTime } from "@/lib/utils";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  doc_assigned: <FileText size={13} className="text-amber-400" />,
  message: <MessageCircle size={13} className="text-indigo-400" />,
  quotation: <Calculator size={13} className="text-[#00D4AA]" />,
  system: <Info size={13} className="text-slate-400" />,
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unread = notifications.filter(n => !n.read_at).length;

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("notifications-bell")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 50));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: "all" }) });
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
  }

  async function markRead(id: string) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [id] }) });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  }

  function handleClick(n: Notification) {
    if (!n.read_at) markRead(n.id);
    setOpen(false);
    if (n.href) router.push(n.href);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00D4AA] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="absolute right-0 top-10 w-80 bg-[#0D1117] border border-white/12 rounded-2xl shadow-2xl overflow-hidden z-50"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.7)" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <span className="text-sm font-semibold text-white">Notificaciones</span>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-[#00D4AA] hover:text-white transition-colors">
                    Marcar todo leído
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  <Bell size={24} className="mx-auto mb-2 opacity-30" />
                  Sin notificaciones
                </div>
              ) : (
                notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors border-b border-white/5 last:border-0 ${
                      !n.read_at ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <div className="shrink-0 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center mt-0.5">
                      {TYPE_ICONS[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${!n.read_at ? "text-white font-medium" : "text-slate-300"}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-slate-500 truncate mt-0.5">{n.body}</p>}
                      <p className="text-[10px] text-slate-600 mt-1">{formatTime(n.created_at)}</p>
                    </div>
                    {!n.read_at && <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] shrink-0 mt-1.5" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
