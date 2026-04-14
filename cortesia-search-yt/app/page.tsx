"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatNumber, timeAgo, coefficientLabel, type YTVideo } from "@/lib/youtube";
import { VIDEO_PRESETS } from "@/lib/ai-presets";

export default function Dashboard() {
  const [trending, setTrending] = useState<YTVideo[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [quota, setQuota] = useState({ used: 0, limit: 10000, pct: 0 });

  useEffect(() => {
    fetch("/api/quota")
      .then(r => r.json())
      .then(d => { if (d.used !== undefined) setQuota({ used: d.used, limit: d.limit, pct: d.pct }); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const after = new Date();
    after.setDate(after.getDate() - 7);
    fetch(`/api/youtube/search?q=AI+tools&publishedAfter=${after.toISOString()}&order=viewCount&maxResults=5`)
      .then(r => r.json())
      .then(d => setTrending(d.videos || []))
      .catch(() => {})
      .finally(() => setTrendingLoading(false));
  }, []);

  const features = [
    { icon: "🔥", label: "Inteligencia Viral", desc: "Vídeos IA/tech que explotan en relación al tamaño de su canal", href: "/viral", color: "#EF4444" },
    { icon: "📊", label: "SERP Analyzer", desc: "Analiza la competencia real de una keyword antes de crear el vídeo", href: "/serp", color: "#F97316" },
    { icon: "🎯", label: "Nichos Ocultos", desc: "Canales IA/tech con alta eficiencia y tendencia de crecimiento", href: "/niches", color: "#A855F7" },
    { icon: "🔑", label: "Keywords", desc: "Autocomplete de YouTube + análisis IA + optimizador de títulos A/B", href: "/keywords", color: "#3B82F6" },
    { icon: "🖼️", label: "Miniaturas IA", desc: "Analiza patrones virales y genera miniaturas con Flux + Claude Vision", href: "/thumbnails", color: "#22C55E" },
    { icon: "🔖", label: "Guardados + Watchlist", desc: "Colección personal + 12 canales de referencia IA monitorizados", href: "/saved", color: "#EAB308" },
  ];

  const quotaColor = quota.pct > 80 ? "#EF4444" : quota.pct > 50 ? "#EAB308" : "#22C55E";

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="section-title">⚡ Dashboard IA</h1>
        <p className="section-sub">Tu centro de inteligencia viral para el nicho de IA y tecnología en YouTube</p>
      </div>

      {/* Quota tracker */}
      <div className="card" style={{ padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>📊 Cuota API YouTube hoy</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: quotaColor }}>{quota.used.toLocaleString()} / 10,000 unidades ({quota.pct}%)</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${quota.pct}%`, background: quotaColor, transition: "width 0.5s ease" }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-subtle)", flexShrink: 0 }}>
          Búsqueda viral ≈ 102 u<br />Análisis nicho ≈ 123 u
        </div>
      </div>

      {/* AI Quick Searches */}
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>🚀 Búsquedas rápidas IA</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {VIDEO_PRESETS.map(p => (
            <Link key={p} href={`/viral?q=${encodeURIComponent(p)}`} style={{ textDecoration: "none" }}>
              <span style={{
                display: "inline-block", fontSize: 12, padding: "6px 14px", borderRadius: 20,
                background: "var(--surface)", color: "var(--text-muted)",
                border: "1px solid var(--border)", cursor: "pointer",
              }}>{p}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending AI this week */}
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>🔥 Trending IA esta semana</div>
        {trendingLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 48, borderRadius: 8 }} />
            ))}
          </div>
        ) : trending.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--text-subtle)" }}>No se pudieron cargar los vídeos trending.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {trending.map(v => {
              const coeff = coefficientLabel(v.viralCoefficient);
              return (
                <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <img src={v.thumbnailUrl} alt="" style={{ width: 72, height: 41, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{v.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 2 }}>{v.channelTitle} · {formatNumber(v.viewCount)} views · {timeAgo(v.publishedAt)}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: coeff.color, background: coeff.bg, padding: "3px 8px", borderRadius: 6, flexShrink: 0 }}>{coeff.label}</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {features.map(({ icon, label, desc, href, color }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div className="card" style={{ padding: 18, cursor: "pointer", height: "100%" }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{desc}</div>
              <div style={{ marginTop: 14, height: 2, background: color, borderRadius: 1, opacity: 0.6 }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick start workflow */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>⚡ Flujo recomendado para IA/tech</div>
        <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            'SERP Analyzer: busca tu keyword objetivo (ej: "claude api tutorial") — ¿puedes competir?',
            'Inteligencia Viral: busca el mismo tema → filtra por canal Micro (<10K) → selecciona los mejores',
            'Generar ideas: selecciona 3-5 vídeos virales → "💡 Generar ideas con IA" → elige una idea',
            'Keywords: busca la keyword elegida → analiza con IA → optimiza tu título con A/B',
            'Miniaturas IA: analiza el patrón de thumbnails del nicho → genera variaciones con Flux',
            'Crea el vídeo. Repite el ciclo cada semana con nuevas tendencias.',
          ].map((step, i) => (
            <li key={i} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
