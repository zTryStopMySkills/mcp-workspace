"use client";
import { useState, useRef, useCallback, useEffect } from "react";

type ThumbnailAnalysis = {
  colores_dominantes?: string;
  elementos_clave?: string[];
  texto_en_thumbnail?: string;
  emocion_facial?: string;
  composicion?: string;
  prompt_generacion?: string;
  errores_comunes?: string;
  // Image analysis fields
  descripcion_imagen?: string;
  elementos_a_incorporar?: string[];
  sugerencias_estilo?: string;
  texto_sugerido?: string;
  raw?: string;
};

const STYLES = [
  { value: "bold dramatic text, shocked expression, bright neon colors, clickbait style", label: "Drama / Clickbait" },
  { value: "clean minimalist design, professional, subtle gradients, modern typography", label: "Minimalista Pro" },
  { value: "educational infographic style, clear readable typography, informational layout", label: "Educacional" },
  { value: "vlog style, candid authentic, warm colors, lifestyle photography", label: "Vlog / Lifestyle" },
  { value: "gaming thumbnail, intense action, dark background, red and blue neon glow", label: "Gaming" },
  { value: "finance business professional, charts and graphs, dark premium feel", label: "Finanzas / Negocios" },
  { value: "fitness athletic energetic, gym setting, strong contrast, motivational", label: "Fitness" },
  { value: "cooking food photography, appetizing colorful, warm golden lighting, rustic", label: "Cocina / Gastronomía" },
  { value: "travel adventure, vibrant landscape, golden hour lighting, wanderlust", label: "Viajes" },
  { value: "tech review, product showcase, clean white background, modern gadgets", label: "Tech / Reviews" },
];

// ─── Image Upload Zone ────────────────────────────────────────────────────────
function ImageUploadZone({
  onImage,
  previewUrl,
  onClear,
}: {
  onImage: (base64: string, mediaType: string, previewUrl: string) => void;
  previewUrl: string | null;
  onClear: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(",")[1];
      const mediaType = file.type;
      onImage(base64, mediaType, result);
    };
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  // Paste from clipboard
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  if (previewUrl) {
    return (
      <div style={{ position: "relative" }}>
        <img src={previewUrl} alt="Referencia" style={{ width: "100%", borderRadius: 8, maxHeight: 200, objectFit: "cover", display: "block" }} />
        <button
          onClick={onClear}
          style={{
            position: "absolute", top: 6, right: 6,
            background: "rgba(0,0,0,0.7)", color: "white",
            border: "none", borderRadius: "50%", width: 24, height: 24,
            cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
        <div style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(34,197,94,0.9)", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
          ✅ Imagen lista
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => fileRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
        borderRadius: 10,
        padding: "24px 16px",
        textAlign: "center",
        cursor: "pointer",
        transition: "border-color 0.2s, background 0.2s",
        background: dragging ? "var(--accent-dim)" : "var(--bg)",
      }}
    >
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
      <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
        Arrastra una foto aquí, pégala con <kbd style={{ background: "var(--border)", padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>Ctrl+V</kbd> o haz clic
      </div>
      <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>
        Foto de tu cara, logo, producto o cualquier referencia visual
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ThumbnailsPage() {
  const [videoTitle, setVideoTitle] = useState("");
  const [style, setStyle] = useState(STYLES[0].value);
  const [analysis, setAnalysis] = useState<ThumbnailAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [history, setHistory] = useState<{ url: string; title: string }[]>([]);
  const [error, setError] = useState("");
  const [genError, setGenError] = useState("");
  const [mode, setMode] = useState<"title" | "image">("title");
  // Image upload
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState("image/jpeg");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!generating) { setElapsed(0); return; }
    const interval = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [generating]);

  function handleImage(base64: string, mediaType: string, preview: string) {
    setImageBase64(base64);
    setImageMediaType(mediaType);
    setImagePreview(preview);
    setAnalysis(null);
    setCustomPrompt("");
  }

  function clearImage() {
    setImageBase64(null);
    setImagePreview(null);
    setAnalysis(null);
    setCustomPrompt("");
  }

  async function analyze() {
    setError("");
    setAnalysis(null);
    setAnalyzing(true);

    try {
      if (mode === "image" && imageBase64) {
        // Vision analysis
        const res = await fetch("/api/ai/thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "analyze-image", videoTitle, style, imageBase64, imageMediaType }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setAnalysis(data.analysis);
        if (data.analysis?.prompt_generacion) setCustomPrompt(data.analysis.prompt_generacion);
      } else {
        // Text-only analysis
        if (!videoTitle.trim()) { setError("Escribe el título del vídeo"); return; }
        const res = await fetch("/api/ai/thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "analyze", videoTitle, style }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setAnalysis(data.analysis);
        if (data.analysis?.prompt_generacion) setCustomPrompt(data.analysis.prompt_generacion);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error en análisis");
    } finally {
      setAnalyzing(false);
    }
  }

  async function generate() {
    if (!customPrompt.trim()) { setGenError("Necesitas un prompt. Analiza primero con Claude."); return; }
    setGenerating(true);
    setGenError("");

    try {
      const res = await fetch("/api/ai/thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", videoTitle, style, prompt: customPrompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.imageUrl) throw new Error("No se recibió imagen de Replicate");

      setGeneratedUrl(data.imageUrl);
      setHistory(prev => [{ url: data.imageUrl, title: videoTitle }, ...prev.slice(0, 5)]);

      // Save to Supabase
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "thumbnail",
          item: { prompt: customPrompt, style, result_url: data.imageUrl, analysis: JSON.stringify(analysis) },
        }),
      });
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Error generando");
    } finally {
      setGenerating(false);
    }
  }

  const canAnalyze = mode === "image" ? !!imageBase64 : !!videoTitle.trim();

  return (
    <div>
      <h1 className="section-title">🖼️ Miniaturas con IA</h1>
      <p className="section-sub">Analiza patrones virales, sube tu foto y genera miniaturas con Flux AI</p>

      {/* Mode tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--card)", borderRadius: 10, padding: 4, width: "fit-content", border: "1px solid var(--border)" }}>
        {[
          { key: "title", icon: "📝", label: "Por título" },
          { key: "image", icon: "📷", label: "Por imagen / foto" },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setMode(key as "title" | "image")}
            style={{
              padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
              background: mode === key ? "var(--accent)" : "transparent",
              color: mode === key ? "white" : "var(--text-muted)",
              transition: "all 0.15s",
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Left — config */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Config card */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
              {mode === "title" ? "📝 Por título del vídeo" : "📷 Por imagen de referencia"}
            </div>

            {/* Title input (always visible as context) */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--text-subtle)", display: "block", marginBottom: 6 }}>
                Título del vídeo {mode === "image" && <span style={{ color: "var(--text-subtle)" }}>(opcional, da contexto)</span>}
              </label>
              <input
                className="input"
                placeholder='ej: "Perdí 10kg en 30 días sin pasar hambre"'
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
              />
            </div>

            {/* Image upload (only in image mode) */}
            {mode === "image" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "var(--text-subtle)", display: "block", marginBottom: 6 }}>
                  Imagen de referencia · tu cara, logo, producto...
                </label>
                <ImageUploadZone
                  onImage={handleImage}
                  previewUrl={imagePreview}
                  onClear={clearImage}
                />
                {mode === "image" && !imageBase64 && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-subtle)", lineHeight: 1.5 }}>
                    Claude analizará la imagen con visión IA → detectará rasgos, expresiones y elementos → generará un prompt específico para crear la miniatura con esa referencia.
                  </div>
                )}
              </div>
            )}

            {/* Style selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--text-subtle)", display: "block", marginBottom: 6 }}>Estilo de miniatura</label>
              <select className="select" style={{ width: "100%" }} value={style} onChange={e => setStyle(e.target.value)}>
                {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: 10, marginBottom: 12, color: "#EF4444", fontSize: 12 }}>
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={analyze}
              disabled={analyzing || !canAnalyze}
            >
              {analyzing
                ? <><span className="spinner" /> Analizando con Claude IA...</>
                : mode === "image" && imageBase64
                  ? "🔍 Analizar imagen con Claude Vision"
                  : "🤖 Analizar patrones virales"
              }
            </button>
          </div>

          {/* Analysis result */}
          {analysis && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>
                {mode === "image" ? "🔍 Análisis de imagen (Claude Vision)" : "📊 Patrones virales detectados"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                {analysis.descripcion_imagen && (
                  <div style={{ padding: "8px 12px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 6 }}>
                    <div style={{ color: "#3B82F6", fontWeight: 700, fontSize: 11, marginBottom: 4 }}>👁 LO QUE VE CLAUDE</div>
                    <div style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>{analysis.descripcion_imagen}</div>
                  </div>
                )}
                {analysis.colores_dominantes && (
                  <div><span style={{ color: "var(--accent)", fontWeight: 600 }}>🎨 Paleta: </span><span style={{ color: "var(--text-muted)" }}>{analysis.colores_dominantes}</span></div>
                )}
                {(analysis.elementos_clave || analysis.elementos_a_incorporar) && (
                  <div>
                    <span style={{ color: "#A855F7", fontWeight: 600 }}>✨ Elementos clave:</span>
                    <ul style={{ margin: "4px 0 0 16px", color: "var(--text-muted)", fontSize: 12 }}>
                      {(analysis.elementos_clave || analysis.elementos_a_incorporar || []).map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </div>
                )}
                {(analysis.texto_en_thumbnail || analysis.texto_sugerido) && (
                  <div><span style={{ color: "#3B82F6", fontWeight: 600 }}>📝 Texto: </span><span style={{ color: "var(--text-muted)" }}>{analysis.texto_en_thumbnail || analysis.texto_sugerido}</span></div>
                )}
                {analysis.emocion_facial && (
                  <div><span style={{ color: "#EAB308", fontWeight: 600 }}>😮 Expresión: </span><span style={{ color: "var(--text-muted)" }}>{analysis.emocion_facial}</span></div>
                )}
                {(analysis.composicion || analysis.sugerencias_estilo) && (
                  <div><span style={{ color: "#22C55E", fontWeight: 600 }}>📐 Composición: </span><span style={{ color: "var(--text-muted)" }}>{analysis.composicion || analysis.sugerencias_estilo}</span></div>
                )}
                {analysis.errores_comunes && (
                  <div style={{ padding: "8px 12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 6 }}>
                    <span style={{ color: "var(--accent)", fontWeight: 600 }}>⚠️ Evitar: </span>
                    <span style={{ color: "var(--text-muted)" }}>{analysis.errores_comunes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prompt editor + generate */}
          {(analysis || customPrompt) && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>⚡ Prompt de generación</div>
              <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 10 }}>
                Generado por Claude. Edítalo libremente antes de generar.
              </div>
              <textarea
                className="input"
                style={{ minHeight: 120, resize: "vertical", fontFamily: "monospace", fontSize: 11, lineHeight: 1.5 }}
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="El prompt aparece aquí tras el análisis. También puedes escribirlo manualmente."
              />

              {genError && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: 10, marginTop: 10, color: "#EF4444", fontSize: 12 }}>
                  {genError}
                </div>
              )}

              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: 12 }}
                onClick={generate}
                disabled={generating || !customPrompt.trim()}
              >
                {generating
                  ? <><span className="spinner" /> Generando... {elapsed}s{elapsed > 15 ? " (puede tardar ~30s)" : ""}</>
                  : "⚡ Generar miniatura con Flux AI"
                }
              </button>
              <div style={{ fontSize: 11, color: "var(--text-subtle)", textAlign: "center", marginTop: 8 }}>
                Powered by Flux Schnell · Vercel serverless · max 60s
              </div>
            </div>
          )}

          {/* Manual prompt (no analysis needed) */}
          {!analysis && !customPrompt && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, color: "var(--text-subtle)", marginBottom: 10 }}>O escribe un prompt directamente:</div>
              <textarea
                className="input"
                style={{ minHeight: 80, resize: "vertical", fontSize: 12 }}
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="YouTube thumbnail, person with shocked face, bright red background, bold white text..."
              />
              {customPrompt.trim() && (
                <button className="btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={generate} disabled={generating}>
                  {generating
                    ? <><span className="spinner" /> Generando... {elapsed}s{elapsed > 15 ? " (puede tardar ~30s)" : ""}</>
                    : "⚡ Generar"
                  }
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right — result */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {generating && (
            <div className="card" style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3, marginBottom: 16 }} />
              <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 4 }}>Generando con Flux AI...</div>
              <div style={{ fontSize: 12, color: "var(--text-subtle)" }}>Puede tardar 10-30 segundos</div>
            </div>
          )}

          {generatedUrl && !generating && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>✅ Miniatura generada</div>
              <img
                src={generatedUrl}
                alt="Miniatura generada"
                style={{ width: "100%", borderRadius: 8, display: "block", border: "1px solid var(--border)" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <a href={generatedUrl} download="thumbnail.webp" target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                  <button className="btn-ghost" style={{ width: "100%" }}>⬇️ Descargar</button>
                </a>
                <button className="btn-primary" style={{ flex: 1 }} onClick={generate} disabled={generating}>
                  🔄 Otra versión
                </button>
              </div>
            </div>
          )}

          {!generatedUrl && !generating && (
            <div className="card" style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 280 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🖼️</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>La miniatura aparecerá aquí</div>
              <div style={{ fontSize: 12, color: "var(--text-subtle)", lineHeight: 1.8 }}>
                <b style={{ color: "var(--text-muted)" }}>Modo título:</b><br />
                1. Escribe el título · 2. Analiza · 3. Genera<br /><br />
                <b style={{ color: "var(--text-muted)" }}>Modo imagen:</b><br />
                1. Sube tu foto · 2. Analiza con Vision · 3. Genera
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 1 && (
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, fontWeight: 600 }}>Generadas en esta sesión</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {history.slice(1).map((h, i) => (
                  <img
                    key={i}
                    src={h.url}
                    alt={h.title}
                    onClick={() => setGeneratedUrl(h.url)}
                    style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 6, cursor: "pointer", border: "1px solid var(--border)", transition: "border-color 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
