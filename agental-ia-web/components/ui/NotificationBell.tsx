"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, FileText, MessageCircle, Calculator, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Notification {
  id: string;
  type: "doc_assigned" | "message" | "quotation" | "system";
  title: string;
  body: string;
  url?: string | null;
  read_at: string | null;
  created_at: string;
}

const TYPE_ICON: Record<Notification["type"], React.ReactNode> = {
  doc_assigned: <FileText size={13} />,
  message: <MessageCircle size={13} />,
  quotation: <Calculator size={13} />,
  system: <Zap size={13} />,
};

export function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read_at).length;

  useEffect(() => {
    if (!session) return;

    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});

    const channel = supabase
      .channel("notifications-bell")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `agent_id=eq.${session.user.id}`,
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: "all" }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
  }

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl text-[#8B95A9] hover:text-white hover:bg-white/5 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-black"
            style={{ background: "#00D4AA" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-11 w-80 rounded-2xl shadow-2xl overflow-hidden z-50"
          style={{ background: "#0D1117", border: "1px solid #ffffff12" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <p className="text-sm font-semibold text-white">Notificaciones</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#00D4AA] transition-colors">
                <CheckCheck size={12} /> Marcar todo leído
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-8">Sin notificaciones</p>
            ) : (
              notifications.slice(0, 20).map(n => (
                <div
                  key={n.id}
                  onClick={() => { markRead(n.id); setOpen(false); }}
                  className={`flex gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/[0.03] transition-colors ${!n.read_at ? "bg-[#00D4AA]/4" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${!n.read_at ? "bg-[#00D4AA]/20 text-[#00D4AA]" : "bg-white/5 text-slate-400"}`}>
                    {TYPE_ICON[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    {n.url ? (
                      <Link href={n.url} className="text-xs font-semibold text-white hover:text-[#00D4AA] line-clamp-1 transition-colors">
                        {n.title}
                      </Link>
                    ) : (
                      <p className="text-xs font-semibold text-white line-clamp-1">{n.title}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      {new Date(n.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {!n.read_at && (
                    <div className="w-2 h-2 rounded-full bg-[#00D4AA] shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
