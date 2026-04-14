"use client";
import { useState, useRef } from "react";
import { KEYWORD_PRESETS } from "@/lib/ai-presets";

type KeywordAnalysis = {
  intension_busqueda?: string;
  dificultad_estimada?: string;
  mejor_keyword?: string;
  keywords_long_tail?: string[];
  tipo_video_ideal?: string;
  titulo_optimizado?: string;
  raw?: string;
};

type TitleVariation = {
  titulo: string;
  ctr_improvement_estimate: string;
  reason: string;
  psychological_trigger: string;
};

function KeywordPill({ kw, onSelect }: { kw: string; onSelect: (k: string) => void }) {
  return (
    <button
      onClick={() => onSelect(kw)}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "6px 12px",
        color: "var(--text-muted)",
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.15s",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      onMouseEnter={e => {
        (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
        (e.target as HTMLButtonElement).style.color = "var(--text)";
      }}
      onMouseLeave={e => {
        (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.target as HTMLButtonElement).style.color = "var(--text-muted)";
      }}
    >
      <span style={{ color: "var(--accent)", fontSize: 10 }}>▶</span> {kw}
    </button>
  );
}

export default function KeywordsPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<KeywordAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Title optimizer
  const [error, setError] = useState("");

  // Title optimizer
  const [titleInput, setTitleInput] = useState("");
  const [titleVariations, setTitleVariations] = useState<TitleVariation[]>([]);
  const [generatingTitles, setGeneratingTitles] = useState(false);
  const [titleError, setTitleError] = useState("");

  async function search(q?: string) {
    const term = q || query;
    if (!term.trim()) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch(`/api/youtube/keywords?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setKeywords(data.keywords || []);
    } finally {
      setLoading(false);
    }
  }

  async function analyzeWithAI() {
    if (!keywords.length) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "keyword", data: { keyword: query, suggestions: keywords } }),
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

  async function saveKeyword() {
    if (!query.trim() || saved.includes(query)) return;
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "keyword",
        item: { keyword: query, related: keywords.slice(0, 10) },
      }),
    });
    setSaved(prev => [...prev, query]);
  }

  function selectKeyword(kw: string) {
    setQuery(kw);
    search(kw);
  }

  async function generateTitleVariations() {
    if (!titleInput.trim()) return;
    setGeneratingTitles(true);
    setTitleError("");
    setTitleVariations([]);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "title", data: { title: titleInput } }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTitleVariations(data.analysis?.variaciones || []);
    } catch (e) {
      setTitleError(String(e));
    } finally {
      setGeneratingTitles(false);
    }
  }

  const triggerColor = (t: string) => {
    if (t?.includes("Curiosidad")) return "#A855F7";
    if (t?.includes("Urgencia") || t?.includes("FOMO")) return "#EF4444";
    if (t?.includes("Beneficio")) return "#22C55E";
    if (t?.includes("Sorpresa")) return "#EAB308";
    return "#3B82F6";
  };

  const dificultadColor = (d?: string) => {
    if (!d) return "var(--text-muted)";
    if (d.toLowerCase().includes("baja")) return "#22C55E";
    if (d.toLowerCase().includes("media")) return "#EAB308";
    return "#EF4444";
  };

  return (
    <div>
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: 12, marginBottom: 16, color: "#EF4444", fontSize: 13 }}>
          {error}
        </div>
      )}
      <h1 className="section-title">🔑 Generador de Keywords</h1>
      <p className="section-sub">Autocomplete de YouTube + análisis de intención con Claude IA</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <input
          ref={inputRef}
          className="input"
          style={{ flex: "1 1 300px" }}
          placeholder='Escribe una keyword seed IA: "claude api", "n8n automation", "cursor ai"...'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
        />
        <button className="btn-primary" onClick={() => search()} disabled={loading}>
          {loading ? <span className="spinner" /> : "🔑"} Generar
        </button>
      </div>

      {/* AI preset chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
        <span style={{ fontSize: 11, color: "var(--text-subtle)", alignSelf: "center", marginRight: 2 }}>Keywords IA:</span>
        {KEYWORD_PRESETS.map(p => (
          <button key={p} onClick={() => selectKeyword(p)} style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 20,
            background: query === p ? "var(--accent-dim)" : "var(--card)",
            color: query === p ? "var(--accent)" : "var(--text-muted)",
            border: `1px solid ${query === p ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
            cursor: "pointer",
          }}>{p}</button>
        ))}
      </div>

      {keywords.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{keywords.length} keywords encontradas para "{query}"</span>
            <button className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={saveKeyword} disabled={saved.includes(query)}>
              {saved.includes(query) ? "✅ Guardada" : "🔖 Guardar sesión"}
            </button>
            <button className="btn-ghost" onClick={analyzeWithAI} disabled={analyzing} style={{ fontSize: 13, padding: "7px 14px" }}>
              {analyzing ? <><span className="spinner" /> Analizando...</> : "🤖 Analizar con IA"}
            </button>
          </div>

          {analysis && (
            <div className="analysis-box" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>📊 Análisis de Keyword — Claude IA</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
                {analysis.intension_busqueda && (
                  <div style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 4 }}>Intención de búsqueda</div>
                    <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{analysis.intension_busqueda}</div>
                  </div>
                )}
                {analysis.dificultad_estimada && (
                  <div style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 4 }}>Dificultad estimada</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: dificultadColor(analysis.dificultad_estimada) }}>{analysis.dificultad_estimada}</div>
                  </div>
                )}
                {analysis.mejor_keyword && (
                  <div style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 4 }}>Mejor keyword</div>
                    <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{analysis.mejor_keyword}</div>
                  </div>
                )}
                {analysis.tipo_video_ideal && (
                  <div style={{ background: "var(--bg)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 4 }}>Formato ideal</div>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>{analysis.tipo_video_ideal}</div>
                  </div>
                )}
              </div>

              {analysis.titulo_optimizado && (
                <div style={{ padding: "10px 14px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700, marginBottom: 4 }}>🎬 TÍTULO OPTIMIZADO LISTO PARA USAR</div>
                  <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>"{analysis.titulo_optimizado}"</div>
                </div>
              )}

              {analysis.keywords_long_tail && analysis.keywords_long_tail.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-subtle)", marginBottom: 8, fontWeight: 600 }}>Keywords long-tail recomendadas:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {analysis.keywords_long_tail.map(k => (
                      <button key={k} onClick={() => selectKeyword(k)} className="tag" style={{ cursor: "pointer", border: "1px solid rgba(239,68,68,0.3)", background: "var(--accent-dim)" }}>
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {keywords.map(kw => (
              <KeywordPill key={kw} kw={kw} onSelect={selectKeyword} />
            ))}
          </div>
        </>
      )}

      {loading && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Array(20).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 34, width: `${80 + Math.random() * 80}px`, borderRadius: 8 }} />
          ))}
        </div>
      )}

      {!loading && keywords.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-subtle)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔑</div>
          <div style={{ fontSize: 15 }}>Escribe una keyword seed para generar sugerencias de YouTube</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Luego usa IA para analizar intención y dificultad</div>
        </div>
      )}

      {/* ─── Title A/B Optimizer ─────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--border)", marginTop: 32, paddingTop: 28 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>✏️ Optimizador de Títulos A/B</h2>
          <p style={{ fontSize: 13, color: "var(--text-subtle)" }}>Escribe tu título y Claude genera 5 variaciones optimizadas para CTR en el nicho IA/tech</p>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder='Ej: "Cómo usar Claude AI para automatizar tu trabajo"'
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generateTitleVariations()}
          />
          <button className="btn-primary" onClick={generateTitleVariations} disabled={generatingTitles || !titleInput.trim()}>
            {generatingTitles ? <><span className="spinner" /> Generando...</> : "Generar 5 variaciones"}
          </button>
        </div>

        {titleError && <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>⚠ {titleError}</div>}

        {titleVariations.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {titleVariations.map((v, i) => (
              <div key={i} className="card" style={{ padding: 16, borderLeft: `3px solid ${i === 0 ? "#22C55E" : i === 1 ? "#3B82F6" : "var(--border)"}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                    background: i === 0 ? "#22C55E" : i === 1 ? "#3B82F6" : "var(--surface)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: i < 2 ? "white" : "var(--text-muted)",
                  }}>#{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.4, marginBottom: 6 }}>"{v.titulo}"</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 700,
                        background: "rgba(34,197,94,0.1)", color: "#22C55E",
                      }}>{v.ctr_improvement_estimate}</span>
                      <span style={{
                        fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                        background: `${triggerColor(v.psychological_trigger)}18`,
                        color: triggerColor(v.psychological_trigger),
                      }}>{v.psychological_trigger}</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-subtle)", lineHeight: 1.5, paddingLeft: 40 }}>{v.reason}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
