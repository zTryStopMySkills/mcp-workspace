"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3,
  Images, Settings, LogOut, Menu, X, ExternalLink
} from "lucide-react";
import { isAdminAuthed, adminLogout } from "@/lib/utils";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/ventas", label: "Ventas", icon: ShoppingCart },
  { href: "/admin/inventario", label: "Inventario", icon: BarChart3 },
  { href: "/admin/galeria", label: "Galería", icon: Images },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") { setAuthed(true); return; }
    if (!isAdminAuthed()) { router.replace("/admin/login"); return; }
    setAuthed(true);
  }, [pathname, router]);

  function handleLogout() {
    adminLogout();
    router.push("/admin/login");
  }

  if (!authed || pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen flex bg-[#0A0A0A]" style={{ fontFamily: "var(--font-body, Inter)" }}>
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0D0D0D] border-r border-[rgba(245,192,26,0.12)] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[rgba(245,192,26,0.12)]">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[20px] text-[#F5C01A] leading-none"
                style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
              >
                SHISHA VAPER
              </p>
              <p
                className="text-[9px] text-[rgba(245,192,26,0.5)] tracking-[0.4em] uppercase mt-0.5"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Panel de Gestión
              </p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[rgba(245,240,232,0.4)]">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navLinks.map(({ href, label, icon: Icon, exact }) => (
            <a
              key={href}
              href={href}
              className={`admin-sidebar-link ${isActive(href, exact) ? "active" : ""}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-[rgba(245,192,26,0.12)] space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-sidebar-link"
          >
            <ExternalLink size={16} />
            <span>Ver web</span>
          </a>
          <button onClick={handleLogout} className="admin-sidebar-link w-full text-left">
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#0D0D0D]/95 backdrop-blur border-b border-[rgba(245,192,26,0.12)] px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[rgba(245,240,232,0.5)] hover:text-[#F5C01A] transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="flex items-center gap-3">
            <div
              className="text-xs text-[rgba(245,192,26,0.6)] tracking-widest uppercase hidden sm:block"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Admin
            </div>
            <div className="w-8 h-8 rounded-full bg-[rgba(245,192,26,0.15)] border border-[rgba(245,192,26,0.3)] flex items-center justify-center">
              <span className="text-[#F5C01A] text-xs" style={{ fontFamily: "var(--font-bebas)" }}>A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-5 md:p-7"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
