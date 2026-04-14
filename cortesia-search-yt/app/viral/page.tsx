"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { YTVideo } from "@/lib/youtube";
import { formatNumber, timeAgo, coefficientLabel } from "@/lib/youtube";
import { VIDEO_PRESETS } from "@/lib/ai-presets";

type SortKey = "viralScore" | "viralCoefficient" | "viewCount" | "engagementRate" | "viewsPerDay";
type Analysis = Record<string, string | string[]>;

interface ContentIdea {
  titulo: string;
  hook: string;
  angulo_diferenciador: string;
  formato_recomendado: string;
  razon_viral: string;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#22C55E" : score >= 45 ? "#EAB308" : score >= 20 ? "#3B82F6" : "#71717A";
  return (
    <div style={{
      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
      background: `conic-gradient(${color} ${score * 3.6}deg, var(--border) 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%", background: "var(--card)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 800, color,
      }}>{score}</div>
    </div>
  );
}

function VideoCard({ video, onSave, saved, selected, onSelect }: {
  video: YTVideo; onSave: (v: YTVideo) => void; saved: boolean;
  selected: boolean; onSelect: (id: string) => void;
}) {
  const ytUrl = `https://youtube.com/watch?v=${video.id}`;
  const chanUrl = `https://youtube.com/channel/${video.channelId}`;
  const coeff = coefficientLabel(video.viralCoefficient);

  return (
    <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column", outline: selected ? "2px solid var(--accent)" : "none" }}>
      {/* Thumbnail */}
      <div style={{ position: "relative" }}>
        {/* Select checkbox */}
        <div
          onClick={() => onSelect(video.id)}
          style={{
            position: "absolute", top: 6, right: 6, zIndex: 2,
            width: 22, height: 22, borderRadius: 6, cursor: "pointer",
            background: selected ? "var(--accent)" : "rgba(0,0,0,0.6)",
            border: `2px solid ${selected ? "var(--accent)" : "rgba(255,255,255,0.5)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "white",
          }}
        >{selected ? "✓" : ""}</div>
        <a href={ytUrl} target="_blank" rel="noopener noreferrer">
          {video.thumbnailUrl
            ? <img src={video.thumbnailUrl} alt={video.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
            : <div style={{ width: "100%", aspectRatio: "16/9", background: "var(--border)" }} />
          }
        </a>
        <span style={{
          position: "absolute", bottom: 6, right: 6,
          background: "rgba(0,0,0,0.88)", color: "white", fontSize: 11, fontWeight: 700,
          padding: "2px 6px", borderRadius: 4,
        }}>{video.duration}</span>
        <span style={{
          position: "absolute", top: 6, left: 6,
          background: coeff.bg, color: coeff.color, fontSize: 11, fontWeight: 800,
          padding: "3px 8px", borderRadius: 6, border: `1px solid ${coeff.color}44`,
          backdropFilter: "blur(4px)",
        }}>{coeff.label}</span>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{video.title}</div>
        </a>
        <a href={chanUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{video.channelTitle}</span>
          <span style={{ fontSize: 11, color: "var(--text-subtle)", background: "var(--bg)", padding: "1px 6px", borderRadius: 4 }}>
            {formatNumber(video.channelSubscribers)} subs
          </span>
        </a>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
          {[
            { icon: "👁", val: formatNumber(video.viewCount), label: "vistas" },
            { icon: "👍", val: formatNumber(video.likeCount), label: "likes" },
            { icon: "📊", val: `${video.engagementRate}%`, label: "eng" },
          ].map(({ icon, val, label }) => (
            <div key={label} style={{ background: "var(--bg)", borderRadius: 6, padding: "5px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{icon} {val}</div>
              <div style={{ fontSize: 10, color: "var(--text-subtle)" }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-subtle)" }}>
          <span>⚡ {formatNumber(video.viewsPerDay)}/día</span>
          <span>·</span>
          <span>{timeAgo(video.publishedAt)}</span>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2, width: `${video.viralScore}%`,
                background: video.viralScore >= 70 ? "#22C55E" : video.viralScore >= 45 ? "#EAB308" : "#3B82F6",
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", minWidth: 24 }}>{video.viralScore}</span>
          </div>
        </div>
        {video.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {video.tags.slice(0, 3).map(t => <span key={t} className="tag" style={{ fontSize: 10 }}>{t}</span>)}
          </div>
        )}
        <button
          className="btn-ghost"
          style={{ marginTop: "auto", fontSize: 12, padding: "5px 10px", opacity: saved ? 0.5 : 1 }}
          onClick={() => onSave(video)} disabled={saved}
        >{saved ? "✅ Guardado" : "🔖 Guardar"}</button>
      </div>
    </div>
  );
}

function TableRow({ video, onSave, saved, selected, onSelect }: {
  video: YTVideo; onSave: (v: YTVideo) => void; saved: boolean;
  selected: boolean; onSelect: (id: string) => void;
}) {
  const ytUrl = `https://youtube.com/watch?v=${video.id}`;
  const coeff = coefficientLabel(video.viralCoefficient);
  return (
    <tr style={{ borderBottom: "1px solid var(--border)", background: selected ? "rgba(239,68,68,0.04)" : undefined }}>
      <td style={{ padding: "10px 12px", textAlign: "center" }}>
        <div
          onClick={() => onSelect(video.id)}
          style={{
            width: 18, height: 18, borderRadius: 4, cursor: "pointer", margin: "0 auto",
            background: selected ? "var(--accent)" : "var(--surface)",
            border: `2px solid ${selected ? "var(--accent)" : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "white",
          }}
        >{selected ? "✓" : ""}</div>
      </td>
      <td style={{ padding: "10px 12px", maxWidth: 280 }}>
        <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {video.title}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-subtle)", marginTop: 2 }}>{video.channelTitle} · {formatNumber(video.channelSubscribers)} subs</div>
        </a>
      </td>
      <td style={{ padding: "10px 12px", textAlign: "center" }}>
        <span style={{ background: coeff.bg, color: coeff.color, padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{coeff.label}</span>
      </td>
      <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{formatNumber(video.viewCount)}</td>
      <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13, color: "var(--text-muted)" }}>{video.engagementRate}%</td>
      <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13, color: "var(--text-muted)" }}>{formatNumber(video.viewsPerDay)}/d</td>
      <td style={{ padding: "10px 12px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
          <div style={{ width: 50, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${video.viralScore}%`, background: video.viralScore >= 70 ? "#22C55E" : video.viralScore >= 45 ? "#EAB308" : "#3B82F6", borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 20 }}>{video.viralScore}</span>
        </div>
      </td>
      <td style={{ padding: "10px 12px", fontSize: 11, color: "var(--text-subtle)" }}>{timeAgo(video.publishedAt)}</td>
      <td style={{ padding: "10px 12px" }}>
        <button onClick={() => onSave(video)} disabled={saved} style={{ fontSize: 11, color: saved ? "var(--text-subtle)" : "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
          {saved ? "✅" : "🔖"}
        </button>
      </td>
    </tr>
  );
}

// ─── Ideas Modal ─────────────────────────────────────────────────────────────

function IdeasModal({ ideas, onClose }: { ideas: ContentIdea[]; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
      <div className="card" style={{ width: "100%", maxWidth: 760, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>💡 Ideas de contenido IA</div>
            <div style={{ fontSize: 12, color: "var(--text-subtle)", marginTop: 2 }}>{ideas.length} ideas listas para producir · Nicho IA/tech</div>
          </div>
          <button onClick={onClose} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "var(--text-muted)", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {ideas.map((idea, i) => (
            <div key={i} className="card" style={{ padding: 16, borderLeft: "3px solid var(--accent)", background: "var(--surface)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "white", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>"{idea.titulo}"</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "var(--text-subtle)", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Hook de apertura</div>
                  <div style={{ fontSize: 12, color: "var(--text)", fontStyle: "italic", lineHeight: 1.5 }}>"{idea.hook}"</div>
                </div>
                <div style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "var(--text-subtle)", fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ángulo diferenciador</div>
                  <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{idea.angulo_diferenciador}</div>
                </div>
                <div style={{ background: "var(--bg)", borderRadius: 8, padding: "8px 12px" }}>
                  <span style={{ fontSize: 10, color: "var(--text-subtle)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Formato: </span>
                  <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{idea.formato_recomendado}</span>
                </div>
                <div style={{ background: "var(--bg)", borderRadius: 8, padding: "8px 12px" }}>
                  <span style={{ fontSize: 10, color: "var(--text-subtle)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Potencial viral: </span>
                  <span style={{ fontSize: 12, color: "#22C55E" }}>{idea.razon_viral}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

function ViralPageContent() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [order, setOrder] = useState("viewCount");
  const [period, setPeriod] = useState("");
  const [duration, setDuration] = useState("any");
  const [maxResults, setMaxResults] = useState("20");
  const [maxSubs, setMaxSubs] = useState("");
  const [minViews, setMinViews] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("viralCoefficient");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Multi-select for ideas
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [ideasModal, setIdeasModal] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);

  // Deep-link: auto-search if ?q= present on mount
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      searchWithQuery(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function periodToISO(offset: string): string {
    if (!offset) return "";
    const d = new Date();
    if (offset === "7d")  d.setDate(d.getDate() - 7);
    else if (offset === "14d") d.setDate(d.getDate() - 14);
    else if (offset === "30d") d.setDate(d.getDate() - 30);
    else if (offset === "90d") d.setDate(d.getDate() - 90);
    else if (offset === "1y")  d.setFullYear(d.getFullYear() - 1);
    return d.toISOString();
  }

  async function searchWithQuery(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setAnalysis(null);
    setSelectedIds(new Set());

    const params = new URLSearchParams({ q, order, maxResults });
    if (period) params.set("publishedAfter", periodToISO(period));
    if (duration !== "any") params.set("duration", duration);
    if (maxSubs) params.set("maxSubs", maxSubs);
    if (minViews) params.set("minViews", minViews);

    try {
      const res = await fetch(`/api/youtube/search?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setVideos(data.videos || []);
      fetch("/api/quota", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ units: 102 }) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  function search() { searchWithQuery(query); }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function generateIdeas() {
    const selected = sorted.filter(v => selectedIds.has(v.id));
    if (selected.length < 2) return;
    setGeneratingIdeas(true);
    setIdeas([]);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ideas",
          data: selected.map(v => ({
            title: v.title, viewCount: v.viewCount,
            viralCoefficient: v.viralCoefficient,
            engagementRate: v.engagementRate,
            channelTitle: v.channelTitle,
          })),
        }),
      });
      const data = await res.json();
      if (data.analysis?.ideas) {
        setIdeas(data.analysis.ideas);
        setIdeasModal(true);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setGeneratingIdeas(false);
    }
  }

  async function analyzeWithAI() {
    if (!videos.length) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "videos", data: sorted }),
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

  async function saveVideo(video: YTVideo) {
    if (savedIds.has(video.id)) return;
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video",
          item: { video_id: video.id, title: video.title, channel_title: video.channelTitle, thumbnail_url: video.thumbnailUrl, view_count: video.viewCount, like_count: video.likeCount, viral_score: video.viralScore, published_at: video.publishedAt },
        }),
      });
      if (!res.ok) throw new Error("Error guardando vídeo");
      setSavedIds(prev => new Set([...prev, video.id]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    }
  }

  const sorted = [...videos].sort((a, b) => {
    switch (sortKey) {
      case "viralCoefficient": return b.viralCoefficient - a.viralCoefficient;
      case "viralScore":       return b.viralScore - a.viralScore;
      case "viewCount":        return b.viewCount - a.viewCount;
      case "engagementRate":   return b.engagementRate - a.engagementRate;
      case "viewsPerDay":      return b.viewsPerDay - a.viewsPerDay;
      default: return 0;
    }
  });

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "viralCoefficient", label: "🚀 Coef. viral" },
    { key: "viralScore",       label: "⭐ Score total" },
    { key: "viewCount",        label: "👁 Más vistos" },
    { key: "engagementRate",   label: "📊 Más engagement" },
    { key: "viewsPerDay",      label: "⚡ Más velocidad" },
  ];

  return (
    <div>
      {ideasModal && ideas.length > 0 && <IdeasModal ideas={ideas} onClose={() => setIdeasModal(false)} />}

      <div style={{ marginBottom: 24 }}>
        <h1 className="section-title">🔥 Inteligencia Viral</h1>
        <p className="section-sub">Vídeos IA/tech que explotan en relación al tamaño de su canal · Métrica clave: coeficiente viral (views ÷ suscriptores)</p>
      </div>

      {/* Search row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <input
          className="input"
          style={{ flex: "1 1 300px" }}
          placeholder='Busca en el nicho IA: "claude tutorial", "n8n automation", "cursor ai"...'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
        />
        <button className="btn-primary" onClick={search} disabled={loading} style={{ minWidth: 100 }}>
          {loading ? <span className="spinner" /> : "🔍"} Buscar
        </button>
        <button className="btn-ghost" onClick={() => setShowFilters(f => !f)}>
          ⚙️ Filtros {showFilters ? "▲" : "▼"}
        </button>
      </div>

      {/* AI preset chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: "var(--text-subtle)", alignSelf: "center", marginRight: 2 }}>Nichos IA:</span>
        {VIDEO_PRESETS.map(p => (
          <button key={p} onClick={() => { setQuery(p); searchWithQuery(p); }} style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 20,
            background: query === p ? "var(--accent-dim)" : "var(--card)",
            color: query === p ? "var(--accent)" : "var(--text-muted)",
            border: `1px solid ${query === p ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
            cursor: "pointer",
          }}>{p}</button>
        ))}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card" style={{ padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-subtle)", display: "block", marginBottom: 4 }}>Ordenar YouTube por</label>
            <select className="select" style={{ width: "100%" }} value={order} onChange={e => setOrder(e.target.value)}>
              <option value="viewCount">Más vistos (YT)</option>
              <option value="rating">Mejor valorados</option>
              <option value="date">Más recientes</option>
              <option value="relevance">Relevancia</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-subtle)", display: "block", marginBottom: 4 }}>Publicado</label>
            <select className="select" style={{ width: "100%" }} value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="">Cualquier fecha</option>
              <option value="7d">Últimos 7 días</option>
              <option value="14d">Últimas 2 semanas</option>
              <option value="30d">Último mes</option>
              <option value="90d">Últimos 3 meses</option>
              <option value="1y">Último año</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-subtle)", display: "block", marginBottom: 4 }}>Duración</label>
            <select className="select" style={{ width: "100%" }} value={duration} onChange={e => setDuration(e.target.value)}>
              <option value="any">Cualquiera</option>
              <option value="short">Corto &lt;4 min</option>
              <option value="medium">Medio 4-20 min</option>
              <option value="long">Largo &gt;20 min</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-subtle)", display: "block", marginBottom: 4 }}>Resultados</label>
            <select className="select" style={{ width: "100%" }} value={maxResults} onChange={e => setMaxResults(e.target.value)}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-subtle)", display: "block", marginBottom: 4 }}>Canal máx. subs</label>
            <input className="input" placeholder="ej: 100000" value={maxSubs} onChange={e => setMaxSubs(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-subtle)", display: "block", marginBottom: 4 }}>Min. visualizaciones</label>
            <input className="input" placeholder="ej: 50000" value={minViews} onChange={e => setMinViews(e.target.value)} />
          </div>
        </div>
      )}

      {/* Quick channel size filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "var(--text-subtle)", alignSelf: "center" }}>Canales:</span>
        {[
          { label: "Todos", val: "" },
          { label: "Micro <10K", val: "10000" },
          { label: "Small <100K", val: "100000" },
          { label: "Medium <1M", val: "1000000" },
        ].map(({ label, val }) => (
          <button key={label} onClick={() => setMaxSubs(val)} style={{
            padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
            background: maxSubs === val ? "var(--accent-dim)" : "var(--card)",
            color: maxSubs === val ? "var(--accent)" : "var(--text-muted)",
            border: `1px solid ${maxSubs === val ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
          }}>{label}</button>
        ))}
        {/* Select hint */}
        {videos.length > 0 && (
          <span style={{ fontSize: 11, color: "var(--text-subtle)", alignSelf: "center", marginLeft: "auto" }}>
            Selecciona vídeos para generar ideas con IA
          </span>
        )}
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: 12, marginBottom: 16, color: "#EF4444", fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Results header */}
      {(videos.length > 0 || loading) && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {!loading && <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{sorted.length} vídeos · Ordenados por:</span>}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {sortOptions.map(({ key, label }) => (
              <button key={key} onClick={() => setSortKey(key)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                background: sortKey === key ? "var(--accent)" : "var(--card)",
                color: sortKey === key ? "white" : "var(--text-muted)",
                border: `1px solid ${sortKey === key ? "var(--accent)" : "var(--border)"}`,
              }}>{label}</button>
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
              {analyzing ? <><span className="spinner" /> IA...</> : "🤖 Analizar con IA"}
            </button>
          </div>
        </div>
      )}

      {/* AI Analysis box */}
      {analysis && (
        <div className="analysis-box" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>📊 Análisis IA — Patrones virales detectados</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10, marginBottom: 12 }}>
            {[
              { key: "patron_titulos", label: "Patrón en títulos", color: "var(--accent)" },
              { key: "patron_contenido", label: "Tipo de contenido", color: "#A855F7" },
              { key: "oportunidad", label: "Oportunidad detectada", color: "var(--green)" },
            ].map(({ key, label, color }) => analysis[key] && (
              <div key={key} style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{analysis[key] as string}</div>
              </div>
            ))}
          </div>
          {analysis.idea_video && (
            <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
              <div style={{ color: "var(--green)", fontWeight: 800, fontSize: 11, marginBottom: 6 }}>💡 IDEA DE VÍDEO LISTA PARA PRODUCIR</div>
              <div style={{ fontSize: 13, color: "var(--text)" }}>{analysis.idea_video as string}</div>
            </div>
          )}
          {analysis.hook_sugerido && (
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              <span style={{ color: "var(--yellow)", fontWeight: 700 }}>Hook: </span>"{analysis.hook_sugerido as string}"
            </div>
          )}
          {Array.isArray(analysis.tags_recomendados) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {(analysis.tags_recomendados as string[]).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid-results">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="card" style={{ overflow: "hidden" }}>
              <div className="skeleton" style={{ width: "100%", aspectRatio: "16/9" }} />
              <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="skeleton" style={{ height: 14, width: "90%" }} />
                <div className="skeleton" style={{ height: 12, width: "60%" }} />
                <div className="skeleton" style={{ height: 40, width: "100%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid-results">
          {sorted.map(v => <VideoCard key={v.id} video={v} onSave={saveVideo} saved={savedIds.has(v.id)} selected={selectedIds.has(v.id)} onSelect={toggleSelect} />)}
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                {["☑", "Vídeo / Canal", "Coef. Viral", "Vistas", "Eng.", "Velocidad", "Score", "Fecha", ""].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: h === "Vídeo / Canal" ? "left" : "center", fontSize: 11, color: "var(--text-subtle)", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(v => <TableRow key={v.id} video={v} onSave={saveVideo} saved={savedIds.has(v.id)} selected={selectedIds.has(v.id)} onSelect={toggleSelect} />)}
            </tbody>
          </table>
        </div>
      )}

      {!loading && videos.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-subtle)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔥</div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>Busca un tema de IA/tech para encontrar vídeos virales</div>
          <div style={{ fontSize: 13 }}>El coeficiente viral mide cuántas veces supera un vídeo a los suscriptores del canal</div>
        </div>
      )}

      {/* Floating ideas button */}
      {selectedIds.size >= 2 && (
        <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 50 }}>
          <button
            className="btn-primary"
            onClick={generateIdeas}
            disabled={generatingIdeas}
            style={{ padding: "12px 22px", fontSize: 14, fontWeight: 700, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
          >
            {generatingIdeas
              ? <><span className="spinner" /> Generando ideas...</>
              : `💡 Generar ideas con IA (${selectedIds.size} vídeos)`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ViralPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "var(--text-subtle)" }}>Cargando...</div>}>
      <ViralPageContent />
    </Suspense>
  );
}
