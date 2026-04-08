"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { DocToast } from "./DocToast";
import { IAWidget } from "@/components/ia/IAWidget";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0A0F1E]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (desktop + mobile) */}
        <header className="flex items-center gap-3 px-4 py-2.5 border-b border-white/8 bg-[#0A0F1E]/80 backdrop-blur sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <Menu size={22} />
          </button>
          <span className="lg:hidden font-bold text-white shrink-0">
            Agental<span className="text-[#00D4AA]">.IA</span>
          </span>
          <div className="flex-1 max-w-sm mx-auto lg:mx-0">
            <GlobalSearch />
          </div>
          <NotificationBell />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <DocToast />
      <IAWidget />
    </div>
  );
}
