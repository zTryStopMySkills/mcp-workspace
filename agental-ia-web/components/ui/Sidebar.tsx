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
  Monitor,
  Shield,
  Radar,
  Radio,
  Network,
  Clapperboard,
  Wrench,
  Wallet,
  BookMarked,
  Archive,
  HelpCircle,
  Map as MapIcon,
  Terminal,
  Brain
} from "lucide-react";
import { initials } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { NotificationBell } from "./NotificationBell";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

// Mi espacio — ruta personal del usuario (disponible para todos)
const agentLinks = [
  { href: "/chat", label: "Chat Equipo", icon: MessageCircle },
  { href: "/documentos", label: "Documentos", icon: FolderOpen },
  { href: "/workspace", label: "Mi Escritorio", icon: Monitor },
  { href: "/guia", label: "Guía de uso", icon: HelpCircle },
  { href: "/rag", label: "Cerebro IA", icon: Brain }
];

// Contenido — visible para admin y editor
const contenidoLinks = [
  { href: "/contenido", label: "Contenido YouTube", icon: Clapperboard },
  { href: "/comunidad", label: "Comunidad", icon: Users },
  { href: "/proyectos", label: "Proyectos Técnicos", icon: Wrench },
  { href: "/negocio", label: "Negocio", icon: Wallet },
  { href: "/wiki", label: "Base de Conocimiento", icon: BookMarked }
];

// Herramientas CortesIA — integraciones externas (admin only)
const integracionesLinks = [
  { href: "/mando", label: "Centro de Mando", icon: Radar },
  { href: "/mando/cortesia", label: "Bot — Detecciones", icon: Radio },
  { href: "/mando/comandos", label: "Bot — Comandos", icon: Terminal },
  { href: "/mando/nexus", label: "Nexus Hub Pipeline", icon: Network }
];

// Admin
const adminLinks = [
  { href: "/admin", label: "Panel Admin", icon: LayoutDashboard },
  { href: "/admin/agentes", label: "Agentes", icon: Users },
  { href: "/admin/academy", label: "Academy", icon: BookMarked },
  { href: "/admin/documentos", label: "Subir Docs", icon: Upload },
  { href: "/admin/audit", label: "Auditoría", icon: Shield },
  { href: "/roadmap", label: "Roadmap & gaps", icon: MapIcon },
  { href: "/legacy", label: "Legacy tools", icon: Archive }
];

const CHAT_SEEN_KEY = "cortesia_chat_last_seen";

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user.role;
  const isAdmin = role === "admin";
  const isEditor = role === "editor" || isAdmin;
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadDocsCount, setUnreadDocsCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

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
    const msgsName = `sidebar-messages-${session?.user?.id ?? "x"}`;
    const staleMsg = supabase.getChannels().find(c => c.topic === `realtime:${msgsName}`);
    if (staleMsg) supabase.removeChannel(staleMsg);
    const channel = supabase
      .channel(msgsName)
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

  // Fetch overdue follow-ups count for IA badge
  useEffect(() => {
    fetch("/api/ia/context")
      .then((r) => r.json())
      .then((d) => setOverdueCount(d.overdueCount ?? 0))
      .catch(() => {});
  }, []);

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
    const docsName = `sidebar-docs-${session?.user?.id ?? "x"}`;
    const staleDocs = supabase.getChannels().find(c => c.topic === `realtime:${docsName}`);
    if (staleDocs) supabase.removeChannel(staleDocs);
    const channel = supabase
      .channel(docsName)
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
        <Link href="/mando" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#7DD3FC]/30 bg-[#0D1117] flex items-center justify-center shrink-0">
            <Image
              src="/logo.jpg"
              alt="CortesIA"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg tracking-tight truncate">
            <span className="text-[#C9A84C]">Cortes</span>
            <span className="text-[#7DD3FC]">IA</span>
            <span className="text-[#8B95A9] text-xs font-medium ml-1">Corp</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          <NotificationBell />
          <button
            onClick={onClose}
            className="lg:hidden text-[#8B95A9] hover:text-white transition-colors ml-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p className="text-xs font-medium text-[#8B95A9]/70 uppercase tracking-wider px-3 mb-2">
          Mi espacio
        </p>
        {agentLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          const isChat = link.href === "/chat";
          const isDocs = link.href === "/documentos";
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#7DD3FC]/15 text-[#7DD3FC] border border-[#7DD3FC]/25"
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
              {active && <ChevronRight size={14} className="ml-auto text-[#7DD3FC]/70" />}
            </Link>
          );
        })}

        {isEditor && (
          <>
            <p className="text-xs font-medium text-[#8B95A9]/70 uppercase tracking-wider px-3 mt-5 mb-2">
              Contenido
            </p>
            {contenidoLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#7DD3FC]/15 text-[#7DD3FC] border border-[#7DD3FC]/25"
                      : "text-[#8B95A9] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                  {active && <ChevronRight size={14} className="ml-auto text-[#7DD3FC]/70" />}
                </Link>
              );
            })}
          </>
        )}

        {isAdmin && (
          <>
            <p className="text-xs font-medium text-[#8B95A9]/70 uppercase tracking-wider px-3 mt-5 mb-2">
              Integraciones
            </p>
            {integracionesLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#7DD3FC]/15 text-[#7DD3FC] border border-[#7DD3FC]/25"
                      : "text-[#8B95A9] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                  {active && <ChevronRight size={14} className="ml-auto text-[#7DD3FC]/70" />}
                </Link>
              );
            })}

            <p className="text-xs font-medium text-[#8B95A9]/70 uppercase tracking-wider px-3 mt-5 mb-2">
              Administración
            </p>
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              const isLegacy = link.href === "/legacy";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/25"
                      : isLegacy
                      ? "text-[#8B95A9]/50 hover:text-[#8B95A9] hover:bg-white/5 italic"
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
            <div className="w-9 h-9 rounded-full bg-[#7DD3FC]/20 border border-[#7DD3FC]/30 flex items-center justify-center text-xs font-bold text-[#7DD3FC] shrink-0 group-hover:border-[#7DD3FC]/60 transition-colors">
              {session?.user.name ? initials(session.user.name) : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-[#7DD3FC] transition-colors">{session?.user.name}</p>
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
