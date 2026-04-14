"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const nav = [
  { href: "/", icon: "⚡", label: "Dashboard" },
  { href: "/viral", icon: "🔥", label: "Inteligencia Viral" },
  { href: "/serp", icon: "📊", label: "SERP Analyzer" },
  { href: "/niches", icon: "🎯", label: "Nichos Ocultos" },
  { href: "/keywords", icon: "🔑", label: "Keywords" },
  { href: "/thumbnails", icon: "🖼️", label: "Miniaturas IA" },
  { href: "/saved", icon: "🔖", label: "Guardados" },
  { href: "/guide", icon: "📖", label: "Guía de uso" },
];

export default function Sidebar() {
  const path = usePathname();

  const [apiStatus, setApiStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    fetch("/api/youtube/search?q=test&maxResults=1")
      .then(r => r.ok ? setApiStatus("ok") : setApiStatus("error"))
      .catch(() => setApiStatus("error"));
  }, []);

  const statusLabel = apiStatus === "ok" ? "● Conectado" : apiStatus === "error" ? "● Sin conexión" : "○ Verificando...";
  const statusColor = apiStatus === "ok" ? "#22C55E" : apiStatus === "error" ? "#EF4444" : "#EAB308";

  return (
    <aside style={{
      width: 220,
      minHeight: "100vh",
      background: "var(--card)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "20px 12px",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "4px 12px 20px", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "var(--accent)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>▶</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Cortesia</div>
            <div style={{ fontSize: 10, color: "var(--text-subtle)", letterSpacing: "0.05em" }}>SEARCH YT</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${path === href ? " active" : ""}`}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom info */}
      <div style={{
        padding: "12px",
        borderTop: "1px solid var(--border)",
        marginTop: 12,
      }}>
        <div style={{ fontSize: 11, color: "var(--text-subtle)", lineHeight: 1.5 }}>
          YouTube API<br />
          <span style={{ color: statusColor, fontSize: 11 }}>{statusLabel}</span>
        </div>
      </div>
    </aside>
  );
}
