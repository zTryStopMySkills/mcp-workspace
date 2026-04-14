"use client";
import { useState } from "react";
import { YTVideo, formatNumber, timeAgo, coefficientLabel } from "@/lib/youtube";
import { VIDEO_PRESETS } from "@/lib/ai-presets";

interface SerpAnalysis {
  veredicto: string;
  razon_principal: string;
  angulo_diferenciador: string;
  titulo_sugerido: string;
  mejor_momento: string;
  advertencia: string;
}

function competitionLevel(avgCoeff: number, avgSubs: number, smallCount: number, total: number) {
  if (avgCoeff > 20 || avgSubs > 500000) return { label: "Alta", color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
  if (avgCoeff < 5 || smallCount >= Math.floor(total / 2)) return { label: "Baja", color: "#22C55E", bg: "rgba(34,197,94,0.1)" };
  return { label: "Media", color: "#EAB308", bg: "rgba(234,179,8,0.1)" };
}

export default function SerpPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SerpAnalysis | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function search(q?: string) {
    const term = (q ?? query).trim();
    if (!term) return;
    setQuery(term);
    setLoading(true);
    setError("");
    setVideos([]);
    setAnalysis(null);
    setSearched(false);
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(term)}&order=relevance&maxResults=10`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setVideos(data.videos || []);
      setSearched(true);
      fetch("/api/quota", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ units: 102 }) });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function analyze() {
    if (!videos.length) return;
    setAnalyzing(true);
    setError("");
    try {
      const avgCoeff = Math.round((videos.reduce((s, v) => s + v.viralCoefficient, 0) / videos.length) * 10) / 10;
      const avgSubs = Math.round(videos.reduce((s, v) => s + v.channelSubscribers, 0) / videos.length);
      const smallCount = videos.filter(v => v.channelSubscribers < 50000).length;

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "serp",
          data: {
            keyword: query,
            videos: videos.map(v => ({
              title: v.title,
              channelTitle: v.channelTitle,
              channelSubscribers: v.channelSubscribers,
              viewCount: v.viewCount,
              viralCoefficient: v.viralCoefficient,
            })),
            avgCoeff,
            avgSubs,
            smallCount,
          }
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (e) {
      setError(String(e));
    } finally {
      setAnalyzing(false);
    }
  }

  // Compute aggregates
  const avgCoeff = videos.length
    ? Math.round((videos.reduce((s, v) => s + v.viralCoefficient, 0) / videos.length) * 10) / 10
    : 0;
  const avgSubs = videos.length
    ? Math.round(videos.reduce((s, v) => s + v.channelSubscribers, 0) / videos.length)
    : 0;
  const smallCount = videos.filter(v => v.channelSubscribers < 50000).length;
  const comp = competitionLevel(avgCoeff, avgSubs, smallCount, videos.length);

  const verdictColor = analysis?.veredicto?.startsWith("SÍ") ? "#22C55E"
    : analysis?.veredicto?.startsWith("NO") ? "#EF4444"
    : "#EAB308";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 className="section-title">📊 SERP Analyzer</h1>
      <p className="section-sub">Analiza la competencia real de una keyword en YouTube antes de crear el vídeo</p>

      {/* Search */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            className="search-input"
            style={{ flex: 1 }}
            placeholder="¿En qué keyword quieres competir? Ej: claude ai tutorial"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
          />
          <button className="btn-primary" onClick={() => search()} disabled={loading || !query.trim()}>
            {loading ? "Buscando..." : "Analizar SERP"}
          </button>
        </div>

        {/* Preset chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
          <span style={{ fontSize: 11, color: "var(--text-subtle)", alignSelf: "center", marginRight: 4 }}>Sugerencias IA:</span>
          {VIDEO_PRESETS.slice(0, 8).map(p => (
            <button key={p} onClick={() => search(p)} style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 20,
              background: "var(--surface)", border: "1px solid var(--border)",
              color: "var(--text-muted)", cursor: "pointer",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {error && <div className="card" style={{ padding: 16, marginBottom: 16, color: "#EF4444", fontSize: 13 }}>⚠ {error}</div>}

      {/* Results */}
      {searched && videos.length > 0 && (
        <>
          {/* Competition summary */}
          <div className="card" style={{ padding: 20, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "inline-block", padding: "6px 18px", borderRadius: 20,
                background: comp.bg, color: comp.color, fontWeight: 700, fontSize: 16, marginBottom: 4,
              }}>{comp.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>Nivel competencia</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{avgCoeff}x</div>
              <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>Coef. viral promedio</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{formatNumber(avgSubs)}</div>
              <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>Subs promedio del canal</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#22C55E", marginBottom: 4 }}>{smallCount}/{videos.length}</div>
              <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>Canales {"<"}50K en top</div>
            </div>
          </div>

          {/* AI analysis button */}
          {!analysis && (
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <button className="btn-primary" onClick={analyze} disabled={analyzing} style={{ padding: "10px 28px" }}>
                {analyzing ? "Analizando con IA..." : "🤖 Analizar competencia con IA"}
              </button>
            </div>
          )}

          {/* AI verdict */}
          {analysis && (
            <div className="card" style={{ padding: 20, marginBottom: 16, borderLeft: `4px solid ${verdictColor}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                <div style={{
                  padding: "8px 20px", borderRadius: 8, background: `${verdictColor}22`,
                  color: verdictColor, fontWeight: 800, fontSize: 18, flexShrink: 0,
                }}>{analysis.veredicto?.split("—")[0]?.trim()}</div>
                <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{analysis.razon_principal}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="card" style={{ padding: 14, background: "var(--surface)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ángulo diferenciador</div>
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{analysis.angulo_diferenciador}</div>
                </div>
                <div className="card" style={{ padding: 14, background: "var(--surface)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Título sugerido</div>
                  <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, lineHeight: 1.5 }}>"{analysis.titulo_sugerido}"</div>
                </div>
                <div className="card" style={{ padding: 14, background: "var(--surface)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mejor momento</div>
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{analysis.mejor_momento}</div>
                </div>
                <div className="card" style={{ padding: 14, background: "var(--surface)", borderLeft: "3px solid #EF4444" }}>
                  <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>⚠ Advertencia</div>
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{analysis.advertencia}</div>
                </div>
              </div>
            </div>
          )}

          {/* SERP results — ranked list, order preserved */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {videos.map((v, idx) => {
              const cl = coefficientLabel(v.viralCoefficient);
              return (
                <div key={v.id} className="card" style={{ padding: 14, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  {/* Rank */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: idx < 3 ? "var(--accent)" : "var(--surface)",
                    color: idx < 3 ? "#fff" : "var(--text-subtle)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 14,
                  }}>#{idx + 1}</div>

                  {/* Thumbnail */}
                  <img src={v.thumbnailUrl} alt="" style={{ width: 120, height: 68, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer"
                      style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", textDecoration: "none", lineHeight: 1.3, display: "block", marginBottom: 4 }}>
                      {v.title}
                    </a>
                    <div style={{ fontSize: 12, color: "var(--text-subtle)", marginBottom: 8 }}>
                      {v.channelTitle} · {formatNumber(v.channelSubscribers)} subs · {timeAgo(v.publishedAt)}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "var(--surface)", color: "var(--text-muted)" }}>
                        {formatNumber(v.viewCount)} views
                      </span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: cl.bg, color: cl.color, fontWeight: 600 }}>
                        {cl.label}
                      </span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "var(--surface)", color: "var(--text-muted)" }}>
                        {v.engagementRate}% eng
                      </span>
                      {v.channelSubscribers < 50000 && (
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(34,197,94,0.1)", color: "#22C55E", fontWeight: 600 }}>
                          canal pequeño ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score ring */}
                  <div style={{
                    flexShrink: 0, width: 48, height: 48, borderRadius: "50%",
                    background: `conic-gradient(var(--accent) ${v.viralScore}%, var(--surface) 0)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", background: "var(--card)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "var(--text)",
                    }}>{v.viralScore}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {searched && videos.length === 0 && !loading && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-subtle)" }}>
          No se encontraron resultados para "{query}"
        </div>
      )}
    </div>
  );
}
