"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  MessageCircle,
  FolderOpen,
  Users,
  Upload,
  LogOut,
  X,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Monitor,
  Shield,
  Calculator,
  Hash,
  History
} from "lucide-react";
import { initials } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const agentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat Comunidad", icon: MessageCircle },
  { href: "/documentos", label: "Documentos", icon: FolderOpen },
  { href: "/workspace", label: "Mi Escritorio", icon: Monitor },
  { href: "/tarificador", label: "Tarificador", icon: Calculator },
  { href: "/curso", label: "Curso Comercial", icon: GraduationCap },
  { href: "/guia", label: "Guía de uso", icon: BookOpen }
];

const adminLinks = [
  { href: "/admin", label: "Panel Admin", icon: LayoutDashboard },
  { href: "/admin/agentes", label: "Agentes", icon: Users },
  { href: "/admin/documentos", label: "Subir Docs", icon: Upload },
  { href: "/admin/canales", label: "Canales", icon: Hash },
  { href: "/admin/audit", label: "Auditoría", icon: Shield }
];

const CHAT_SEEN_KEY = "agental_chat_last_seen";

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "admin";
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadDocsCount, setUnreadDocsCount] = useState(0);

  // Track unread messages: compare latest message timestamp vs last visit
  useEffect(() => {
    const lastSeen = localStorage.getItem(CHAT_SEEN_KEY) ?? new Date(0).toISOString();

    // Initial count from API
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .gt("created_at", lastSeen)
      .then(({ count }) => setUnreadCount(count ?? 0));

    // Realtime: increment badge on new message if not on chat page
    const channel = supabase
      .channel("sidebar-messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        const currentPath = window.location.pathname;
        if (currentPath !== "/chat") {
          setUnreadCount((n) => n + 1);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Reset badge when entering chat
  useEffect(() => {
    if (pathname === "/chat") {
      localStorage.setItem(CHAT_SEEN_KEY, new Date().toISOString());
      setUnreadCount(0);
    }
  }, [pathname]);

  // Track unread documents
  const fetchUnreadDocs = () => {
    fetch("/api/documents/unread-count")
      .then((r) => r.json())
      .then((data) => setUnreadDocsCount(data.count ?? 0))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUnreadDocs();

    // Realtime: refetch cuando llega un doc nuevo o una asignación nueva
    const channel = supabase
      .channel("sidebar-docs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "documents" }, () => {
        if (window.location.pathname !== "/documentos") fetchUnreadDocs();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "document_assignments" }, () => {
        if (window.location.pathname !== "/documentos") fetchUnreadDocs();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Reset badge cuando entra a documentos
  useEffect(() => {
    if (pathname === "/documentos") {
      setUnreadDocsCount(0);
    }
  }, [pathname]);

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#00D4AA]/30 bg-[#0D1117] flex items-center justify-center shrink-0">
            <Image
              src="/logo.jpg"
              alt="Agental.IA"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg tracking-tight truncate">
            <span className="text-[#C9A84C]">Agental</span>
            <span className="text-[#00D4AA]">.IA</span>
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-[#8B95A9] hover:text-white transition-colors ml-2 shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {isAdmin && (
          <p className="text-xs font-medium text-[#8B95A9]/70 uppercase tracking-wider px-3 mb-2">
            Mi espacio
          </p>
        )}
        {agentLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          const isChat = link.href === "/chat";
          const isDocs = link.href === "/documentos";
          return (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25"
                    : "text-[#8B95A9] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {link.label}
                {isChat && unreadCount > 0 && !active && (
                  <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                {isDocs && unreadDocsCount > 0 && !active && (
                  <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-[#C9A84C] text-black text-[10px] font-bold flex items-center justify-center">
                    {unreadDocsCount > 99 ? "99+" : unreadDocsCount}
                  </span>
                )}
                {active && <ChevronRight size={14} className="ml-auto text-[#00D4AA]/70" />}
              </Link>
              {link.href === "/tarificador" && (pathname === "/tarificador" || pathname.startsWith("/tarificador/")) && (
                <Link
                  href="/tarificador/historial"
                  onClick={onClose}
                  className={`flex items-center gap-2 pl-10 pr-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    pathname === "/tarificador/historial"
                      ? "bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <History size={13} />
                  Historial de propuestas
                </Link>
              )}
            </div>
          );
        })}

        {isAdmin && (
          <>
            <p className="text-xs font-medium text-[#8B95A9]/70 uppercase tracking-wider px-3 mt-5 mb-2">
              Administración
            </p>
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/25"
                      : "text-[#8B95A9] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                  {active && <ChevronRight size={14} className="ml-auto text-[#C9A84C]/70" />}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] border border-white/8">
          <Link href="/perfil" onClick={onClose} className="flex items-center gap-3 flex-1 min-w-0 group">
            <div className="w-9 h-9 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/30 flex items-center justify-center text-xs font-bold text-[#00D4AA] shrink-0 group-hover:border-[#00D4AA]/60 transition-colors">
              {session?.user.name ? initials(session.user.name) : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-[#00D4AA] transition-colors">{session?.user.name}</p>
              <p className="text-xs text-[#8B95A9]">@{session?.user.nick}</p>
            </div>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-[#8B95A9] hover:text-red-400 transition-colors shrink-0"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/[0.03] border-r border-white/8 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-[#0D1117] border-r border-white/8 z-50"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
