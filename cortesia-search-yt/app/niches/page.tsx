"use client";
import { useState } from "react";
import type { YTChannel } from "@/lib/youtube";
import { formatNumber, timeAgo, trendLabel, sizeCategoryLabel } from "@/lib/youtube";
import { CHANNEL_PRESETS, trackQuotaUsage } from "@/lib/ai-presets";

type SortKey = "nicheScore" | "efficiencyRatio" | "recentAvgViews" | "trendRatio" | "subscriberCount";
type Analysis = Record<string, string>;

// ─── Channel Card ─────────────────────────────────────────────────────────────

function ChannelCard({ channel, onSave, saved }: { channel: YTChannel; onSave: (c: YTChannel) => void; saved: boolean }) {
  const ytUrl = `https://youtube.com/channel/${channel.id}`;
  const trend = trendLabel(channel.growthTrend);
  const size = sizeCategoryLabel(channel.sizeCategory);
  const nicheColor = channel.nicheScore >= 70 ? "#22C55E" : channel.nicheScore >= 45 ? "#EAB308" : channel.nicheScore >= 20 ? "#3B82F6" : "#71717A";

  return (
    <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {channel.thumbnailUrl
          ? <img src={channel.thumbnailUrl} alt={channel.title} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--border)", flexShrink: 0 }} />
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.3, marginBottom: 4 }}>{channel.title}</div>
          </a>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: size.color, background: `${size.color}18`, padding: "1px 7px", borderRadius: 4 }}>
              {size.label}
            </span>
            {channel.country !== "—" && (
              <span style={{ fontSize: 11, color: "var(--text-subtle)", background: "var(--bg)", padding: "1px 7px", borderRadius: 4 }}>
                {channel.country}
              </span>
            )}
          </div>
        </div>
        {/* Niche score ring */}
        <div style={{
          width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
          background: `conic-gradient(${nicheColor} ${channel.nicheScore * 3.6}deg, var(--border) 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "var(--card)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 0,
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: nicheColor, lineHeight: 1 }}>{channel.nicheScore}</div>
            <div style={{ fontSize: 8, color: "var(--text-subtle)", lineHeight: 1 }}>oport.</div>
          </div>
        </div>
      </div>

      {/* Description */}
      {channel.description && (
        <div style={{ fontSize: 12, color: "var(--text-subtle)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {channel.description}
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[
          { label: "Suscriptores", val: formatNumber(channel.subscriberCount), color: "var(--text)" },
          { label: "Total vídeos", val: String(channel.videoCount), color: "var(--text)" },
          { label: "Subs/mes", val: `${channel.uploadsPerMonth}/mes`, color: "var(--text)" },
          { label: "Avg views (hist.)", val: formatNumber(channel.avgViewsPerVideo), color: "var(--text-muted)" },
          { label: "Avg views (rec.)", val: channel.recentAvgViews > 0 ? formatNumber(channel.recentAvgViews) : "—", color: channel.recentAvgViews > channel.avgViewsPerVideo ? "#22C55E" : "var(--text-muted)" },
          { label: "Views totales", val: formatNumber(channel.totalViewCount), color: "var(--text-muted)" },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ background: "var(--bg)", borderRadius: 6, padding: "6px 8px" }}>
            <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Key metrics */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Efficiency ratio */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>Eficiencia (views÷subs)</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: channel.efficiencyRatio >= 1 ? "#22C55E" : channel.efficiencyRatio >= 0.3 ? "#EAB308" : "#71717A" }}>
              {channel.efficiencyRatio}x
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              width: `${Math.min(channel.efficiencyRatio * 50, 100)}%`,
              background: channel.efficiencyRatio >= 1 ? "#22C55E" : channel.efficiencyRatio >= 0.3 ? "#EAB308" : "#3B82F6",
            }} />
          </div>
        </div>

        {/* Growth trend */}
        {channel.growthTrend !== "unknown" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>Tendencia reciente</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {channel.recentAvgViews > 0 && (
                <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>
                  {channel.trendRatio > 1 ? "+" : ""}{Math.round((channel.trendRatio - 1) * 100)}% vs media
                </span>
              )}
              <span style={{
                fontSize: 11, fontWeight: 700, color: trend.color,
                background: `${trend.color}15`, padding: "2px 8px", borderRadius: 6,
              }}>
                {trend.icon} {trend.label}
              </span>
            </div>
          </div>
        )}

        {/* Niche score bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>Score oportunidad de nicho</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${channel.nicheScore}%`, background: nicheColor, transition: "width 0.8s ease" }} />
          </div>
        </div>
      </div>

      {/* Opportunity badge */}
      {channel.nicheScore >= 60 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8 }}>
          <span style={{ fontSize: 14 }}>🎯</span>
          <span style={{ fontSize: 12, color: "#22C55E", fontWeight: 600 }}>
            Alta oportunidad · Canal eficiente en nicho accesible
          </span>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--text-subtle)", flex: 1 }}>Creado {timeAgo(channel.publishedAt)}</span>
        <button
          className="btn-ghost"
          style={{ fontSize: 12, padding: "5px 10px", opacity: saved ? 0.5 : 1 }}
          onClick={() => onSave(channel)}
          disabled={saved}
        >
          {saved ? "✅ Guardado" : "🔖 Guardar"}
        </button>
      </div>
    </div>
  );
}

// ─── Table row ────────────────────────────────────────────────────────────────

function ChannelTableRow({ channel, onSave, saved }: { channel: YTChannel; onSave: (c: YTChannel) => void; saved: boolean }) {
  const ytUrl = `https://youtube.com/channel/${channel.id}`;
  const trend = trendLabel(channel.growthTrend);
  const size = sizeCategoryLabel(channel.sizeCategory);
  const nicheColor = channel.nicheScore >= 70 ? "#22C55E" : channel.nicheScore >= 45 ? "#EAB308" : "#71717A";

  return (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
      <td style={{ padding: "10px 12px", maxWidth: 220 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {channel.thumbnailUrl && <img src={channel.thumbnailUrl} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />}
          <div>
            <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{channel.title}</div>
            </a>
            <span style={{ fontSize: 10, color: size.color }}>{size.label}</span>
          </div>
        </div>
      </td>
      <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{formatNumber(channel.subscriberCount)}</td>
      <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13, color: "var(--text-muted)" }}>{formatNumber(channel.avgViewsPerVideo)}</td>
      <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13, color: channel.recentAvgViews > channel.avgViewsPerVideo ? "#22C55E" : "var(--text-muted)" }}>
        {channel.recentAvgViews > 0 ? formatNumber(channel.recentAvgViews) : "—"}
      </td>
      <td style={{ padding: "10px 12px", textAlign: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: channel.efficiencyRatio >= 1 ? "#22C55E" : channel.efficiencyRatio >= 0.3 ? "#EAB308" : "#71717A" }}>
          {channel.efficiencyRatio}x
        </span>
      </td>
      <td style={{ padding: "10px 12px", textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: trend.color, background: `${trend.color}15`, padding: "2px 8px", borderRadius: 6 }}>
          {trend.icon} {channel.recentAvgViews > 0 ? `${Math.round((channel.trendRatio - 1) * 100) > 0 ? "+" : ""}${Math.round((channel.trendRatio - 1) * 100)}%` : "?"}
        </span>
      </td>
      <td style={{ padding: "10px 12px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
          <div style={{ width: 50, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${channel.nicheScore}%`, background: nicheColor, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: nicheColor, fontWeight: 700, minWidth: 22 }}>{channel.nicheScore}</span>
        </div>
      </td>
      <td style={{ padding: "10px 12px" }}>
        <button onClick={() => onSave(channel)} disabled={saved} style={{ fontSize: 11, color: saved ? "var(--text-subtle)" : "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
          {saved ? "✅" : "🔖"}
        </button>
      </td>
    </tr>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function NichesPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<YTChannel[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nicheScore");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [filterSize, setFilterSize] = useState("");

  async function searchWithQuery(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const res = await fetch(`/api/youtube/channels?q=${encodeURIComponent(q)}&maxResults=15`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChannels(data.channels || []);
      trackQuotaUsage(123);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  function search() { searchWithQuery(query); }

  async function analyzeWithAI() {
    if (!channels.length) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "channels", data: sorted }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error en análisis IA");
    } finally {
      setAnalyzing(false);
    }
  }

  async function saveChannel(ch: YTChannel) {
    if (savedIds.has(ch.id)) return;
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "channel", item: { channel_id: ch.id, title: ch.title, thumbnail_url: ch.thumbnailUrl, subscriber_count: ch.subscriberCount, avg_views_per_video: ch.avgViewsPerVideo, growth_score: ch.nicheScore } }),
      });
      if (!res.ok) throw new Error("Error guardando canal");
      setSavedIds(prev => new Set([...prev, ch.id]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    }
  }

  const filteredChannels = filterSize
    ? channels.filter(c => c.sizeCategory === filterSize)
    : channels;

  const sorted = [...filteredChannels].sort((a, b) => {
    switch (sortKey) {
      case "nicheScore":      return b.nicheScore - a.nicheScore;
      case "efficiencyRatio": return b.efficiencyRatio - a.efficiencyRatio;
      case "recentAvgViews":  return b.recentAvgViews - a.recentAvgViews;
      case "trendRatio":      return b.trendRatio - a.trendRatio;
      case "subscriberCount": return b.subscriberCount - a.subscriberCount;
      default: return 0;
    }
  });

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "nicheScore",      label: "🎯 Oportunidad" },
    { key: "efficiencyRatio", label: "⚡ Eficiencia" },
    { key: "trendRatio",      label: "📈 Tendencia" },
    { key: "recentAvgViews",  label: "🔥 Views recientes" },
    { key: "subscriberCount", label: "👥 Suscriptores" },
  ];

  const sizeFilters = [
    { key: "", label: "Todos" },
    { key: "micro", label: "Micro 1K-10K" },
    { key: "small", label: "Small 10K-100K" },
    { key: "medium", label: "Medium 100K-1M" },
    { key: "large", label: "Large >1M" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title">🎯 Nichos Ocultos</h1>
        <p className="section-sub">
          Analiza canales en profundidad · Métricas: eficiencia, tendencia de crecimiento reciente, score de oportunidad
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <input
          className="input"
          style={{ flex: "1 1 300px" }}
          placeholder='Busca un nicho IA: "AI automation", "cursor ai", "n8n workflows"...'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
        />
        <button className="btn-primary" onClick={search} disabled={loading} style={{ minWidth: 120 }}>
          {loading ? <><span className="spinner" /> Analizando...</> : "🎯 Analizar"}
        </button>
      </div>

      {/* AI preset chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: "var(--text-subtle)", alignSelf: "center", marginRight: 2 }}>Nichos IA:</span>
        {CHANNEL_PRESETS.map(p => (
          <button key={p} onClick={() => { setQuery(p); searchWithQuery(p); }} style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 20,
            background: query === p ? "var(--accent-dim)" : "var(--card)",
            color: query === p ? "var(--accent)" : "var(--text-muted)",
            border: `1px solid ${query === p ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
            cursor: "pointer",
          }}>{p}</button>
        ))}
      </div>

      {/* Info box explaining the analysis */}
      {channels.length === 0 && !loading && (
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>¿Qué analiza esta herramienta?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { icon: "⚡", label: "Eficiencia", desc: "Views medias ÷ suscriptores. Si es >1x, el canal genera más views de los que sus subs explicarían." },
              { icon: "📈", label: "Tendencia reciente", desc: "Compara los últimos 5 vídeos con la media histórica del canal. Si sube, el canal está en racha." },
              { icon: "🎯", label: "Score oportunidad", desc: "Combina eficiencia + tamaño ideal + tendencia. Canales con >60 puntos = nicho con entrada viable." },
              { icon: "🔄", label: "Frecuencia", desc: "Uploads por mes. Nichos activos tienen más oportunidad de aparecer en feed." },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{icon} {label}</div>
                <div style={{ fontSize: 12, color: "var(--text-subtle)", lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: 12, marginBottom: 16, color: "#EF4444", fontSize: 13 }}>
          {error}
        </div>
      )}

      {(channels.length > 0 || loading) && (
        <>
          {/* Size filter */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>Tamaño:</span>
            {sizeFilters.map(({ key, label }) => (
              <button key={key} onClick={() => setFilterSize(key)}
                style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: filterSize === key ? "var(--accent-dim)" : "var(--card)", color: filterSize === key ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${filterSize === key ? "rgba(239,68,68,0.3)" : "var(--border)"}` }}>
                {label}
              </button>
            ))}
          </div>

          {/* Sort + view mode */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {!loading && <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{sorted.length} canales · Ordenar:</span>}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {sortOptions.map(({ key, label }) => (
                <button key={key} onClick={() => setSortKey(key)}
                  style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: sortKey === key ? "var(--accent)" : "var(--card)", color: sortKey === key ? "white" : "var(--text-muted)", border: `1px solid ${sortKey === key ? "var(--accent)" : "var(--border)"}` }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {["grid", "table"].map(m => (
                <button key={m} onClick={() => setViewMode(m as "grid" | "table")}
                  style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", background: viewMode === m ? "var(--card-hover)" : "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                  {m === "grid" ? "⊞" : "≡"} {m}
                </button>
              ))}
              <button className="btn-ghost" onClick={analyzeWithAI} disabled={analyzing} style={{ fontSize: 12, padding: "4px 12px" }}>
                {analyzing ? <><span className="spinner" /> IA...</> : "🤖 Análisis IA"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* AI Analysis */}
      {analysis && (
        <div className="analysis-box" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>📊 Análisis de Nicho — Claude IA</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10, marginBottom: 12 }}>
            {[
              { key: "nicho_detectado", label: "Nicho detectado", color: "#A855F7" },
              { key: "nivel_saturacion", label: "Nivel de saturación", color: "#EAB308" },
              { key: "oportunidad_entrada", label: "Cómo entrar", color: "#22C55E" },
            ].map(({ key, label, color }) => analysis[key] && (
              <div key={key} style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{analysis[key]}</div>
              </div>
            ))}
          </div>
          {analysis.subnicho_sin_explotar && (
            <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
              <div style={{ color: "#A855F7", fontWeight: 800, fontSize: 11, marginBottom: 4 }}>💎 SUBNICHO SIN EXPLOTAR</div>
              <div style={{ fontSize: 13, color: "var(--text)" }}>{analysis.subnicho_sin_explotar}</div>
            </div>
          )}
          {analysis.estrategia_crecimiento && (
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>Estrategia: </span>{analysis.estrategia_crecimiento}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid-results">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 11, width: "40%" }} />
                </div>
                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
              </div>
              <div className="skeleton" style={{ height: 60, width: "100%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 40, width: "100%" }} />
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid-results">
          {sorted.map(c => <ChannelCard key={c.id} channel={c} onSave={saveChannel} saved={savedIds.has(c.id)} />)}
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                {["Canal", "Subs", "Avg views", "Views rec.", "Eficiencia", "Tendencia", "Oportunidad", ""].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: h === "Canal" ? "left" : "center", fontSize: 11, color: "var(--text-subtle)", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(c => <ChannelTableRow key={c.id} channel={c} onSave={saveChannel} saved={savedIds.has(c.id)} />)}
            </tbody>
          </table>
        </div>
      )}

      {!loading && channels.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-subtle)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <div style={{ fontSize: 15 }}>Busca un nicho para descubrir oportunidades</div>
        </div>
      )}
    </div>
  );
}
