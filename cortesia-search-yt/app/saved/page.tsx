"use client";
import { useState, useEffect } from "react";
import { formatNumber, timeAgo, coefficientLabel, type YTVideo } from "@/lib/youtube";
import { AI_REFERENCE_CHANNELS } from "@/lib/ai-presets";

type Tab = "videos" | "channels" | "keywords" | "thumbnails";

type SavedVideo = {
  id: string; video_id: string; title: string; channel_title: string;
  thumbnail_url: string; view_count: number; like_count: number;
  viral_score: number; published_at: string; created_at: string;
};
type SavedChannel = {
  id: string; channel_id: string; title: string; thumbnail_url: string;
  subscriber_count: number; avg_views_per_video: number; growth_score: number; created_at: string;
};
type SavedKeyword = {
  id: string; keyword: string; related: string[]; created_at: string;
};
type ThumbnailJob = {
  id: string; prompt: string; style: string; result_url: string; created_at: string;
};

export default function SavedPage() {
  const [tab, setTab] = useState<Tab>("videos");
  const [items, setItems] = useState<(SavedVideo | SavedChannel | SavedKeyword | ThumbnailJob)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reference channels watchlist
  const [watchlistVideos, setWatchlistVideos] = useState<Record<string, YTVideo[]>>({});
  const [watchlistLoading, setWatchlistLoading] = useState<Record<string, boolean>>({});
  const [watchlistOpen, setWatchlistOpen] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [tab]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/saved?type=${tab}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setItems(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando guardados");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este elemento guardado?")) return;
    const typeMap: Record<Tab, string> = { videos: "video", channels: "channel", keywords: "keyword", thumbnails: "thumbnail" };
    try {
      await fetch(`/api/saved?type=${typeMap[tab]}&id=${id}`, { method: "DELETE" });
      setItems(prev => prev.filter((i: { id: string }) => i.id !== id));
    } catch {
      setError("Error al eliminar. Inténtalo de nuevo.");
    }
  }

  async function loadChannelVideos(channelId: string) {
    if (watchlistVideos[channelId] || watchlistLoading[channelId]) {
      setWatchlistOpen(watchlistOpen === channelId ? null : channelId);
      return;
    }
    setWatchlistLoading(prev => ({ ...prev, [channelId]: true }));
    setWatchlistOpen(channelId);
    try {
      const res = await fetch(`/api/youtube/search?q=AI&channelId=${channelId}&order=viewCount&maxResults=5`);
      const data = await res.json();
      setWatchlistVideos(prev => ({ ...prev, [channelId]: data.videos || [] }));
    } catch {
      setWatchlistVideos(prev => ({ ...prev, [channelId]: [] }));
    } finally {
      setWatchlistLoading(prev => ({ ...prev, [channelId]: false }));
    }
  }

  async function saveReferenceChannel(ch: typeof AI_REFERENCE_CHANNELS[0]) {
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "channel",
        item: { channel_id: ch.id, title: ch.name, thumbnail_url: "", subscriber_count: 0, avg_views_per_video: 0, growth_score: 0 },
      }),
    });
  }

  const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: "videos", icon: "🎬", label: "Vídeos" },
    { key: "channels", icon: "📺", label: "Canales" },
    { key: "keywords", icon: "🔑", label: "Keywords" },
    { key: "thumbnails", icon: "🖼️", label: "Miniaturas" },
  ];

  return (
    <div>
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: 12, marginBottom: 16, color: "#EF4444", fontSize: 13 }}>
          {error}
        </div>
      )}
      <h1 className="section-title">🔖 Guardados</h1>
      <p className="section-sub">Vídeos, canales, keywords y miniaturas que has guardado</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--card)", borderRadius: 10, padding: 4, width: "fit-content", border: "1px solid var(--border)" }}>
        {tabs.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: "7px 16px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
              background: tab === key ? "var(--accent)" : "transparent",
              color: tab === key ? "white" : "var(--text-muted)",
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid-results">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="card" style={{ padding: 16, height: 120 }}>
              <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 11, width: "40%" }} />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-subtle)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔖</div>
          <div style={{ fontSize: 15 }}>No hay {tabs.find(t => t.key === tab)?.label.toLowerCase()} guardados aún</div>
        </div>
      ) : tab === "videos" ? (
        <div className="grid-results">
          {(items as SavedVideo[]).map(item => (
            <div key={item.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
              <a href={`https://youtube.com/watch?v=${item.video_id}`} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                {item.thumbnail_url && (
                  <img src={item.thumbnail_url} alt={item.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                )}
              </a>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4, lineHeight: 1.4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-subtle)", marginBottom: 8 }}>{item.channel_title}</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>👁 {formatNumber(item.view_count)}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Score: {item.viral_score}</span>
                </div>
                <button onClick={() => remove(item.id)} style={{ fontSize: 12, color: "var(--text-subtle)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  🗑 Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : tab === "channels" ? (
        <div className="grid-results">
          {(items as SavedChannel[]).map(item => (
            <div key={item.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                {item.thumbnail_url && (
                  <img src={item.thumbnail_url} alt={item.title} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-subtle)" }}>{formatNumber(item.subscriber_count)} subs</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                Avg views/vídeo: {formatNumber(item.avg_views_per_video)} · Score crecimiento: {item.growth_score}
              </div>
              <button onClick={() => remove(item.id)} style={{ fontSize: 12, color: "var(--text-subtle)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                🗑 Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : tab === "keywords" ? (
        <div className="grid-results">
          {(items as SavedKeyword[]).map(item => (
            <div key={item.id} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>{item.keyword}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                {(item.related || []).slice(0, 8).map(k => (
                  <span key={k} className="tag" style={{ fontSize: 11 }}>{k}</span>
                ))}
              </div>
              <button onClick={() => remove(item.id)} style={{ fontSize: 12, color: "var(--text-subtle)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                🗑 Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-results">
          {(items as ThumbnailJob[]).map(item => (
            <div key={item.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
              {item.result_url && (
                <img src={item.result_url} alt="Miniatura" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
              )}
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "var(--text-subtle)", marginBottom: 8, fontFamily: "monospace", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {item.prompt}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={item.result_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none" }}>⬇️ Descargar</a>
                  <button onClick={() => remove(item.id)} style={{ fontSize: 12, color: "var(--text-subtle)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── AI Reference Channels Watchlist ─────────────────────────────── */}
      <div style={{ borderTop: "1px solid var(--border)", marginTop: 40, paddingTop: 28 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>📡 Canales de referencia IA</h2>
          <p style={{ fontSize: 13, color: "var(--text-subtle)" }}>Los creadores más relevantes del nicho IA/tech · Haz clic para ver sus vídeos más virales</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {AI_REFERENCE_CHANNELS.map(ch => (
            <div key={ch.id}>
              <div className="card" style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                    {ch.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>{ch.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-subtle)" }}>{ch.handle}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => loadChannelVideos(ch.id)}
                    style={{
                      flex: 1, fontSize: 11, padding: "6px 8px", borderRadius: 6, cursor: "pointer",
                      background: watchlistOpen === ch.id ? "var(--accent)" : "var(--surface)",
                      color: watchlistOpen === ch.id ? "white" : "var(--text-muted)",
                      border: `1px solid ${watchlistOpen === ch.id ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    {watchlistLoading[ch.id] ? "Cargando..." : watchlistOpen === ch.id ? "▲ Ocultar" : "▶ Ver virales"}
                  </button>
                  <a
                    href={`https://youtube.com/channel/${ch.id}`}
                    target="_blank" rel="noreferrer"
                    style={{ fontSize: 11, padding: "6px 8px", borderRadius: 6, background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", textDecoration: "none", display: "flex", alignItems: "center" }}
                  >YT</a>
                </div>
              </div>

              {/* Expanded video list */}
              {watchlistOpen === ch.id && (
                <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                  {watchlistLoading[ch.id] ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="card skeleton" style={{ height: 52 }} />
                    ))
                  ) : (watchlistVideos[ch.id] || []).length === 0 ? (
                    <div className="card" style={{ padding: 10, fontSize: 12, color: "var(--text-subtle)" }}>No hay vídeos disponibles</div>
                  ) : (watchlistVideos[ch.id] || []).map(v => {
                    const coeff = coefficientLabel(v.viralCoefficient);
                    return (
                      <div key={v.id} className="card" style={{ padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
                        <img src={v.thumbnailUrl} alt="" style={{ width: 60, height: 34, borderRadius: 4, objectFit: "cover", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <a href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", textDecoration: "none", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {v.title}
                          </a>
                          <div style={{ fontSize: 10, color: "var(--text-subtle)", marginTop: 2 }}>{formatNumber(v.viewCount)} · {timeAgo(v.publishedAt)}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: coeff.color, background: coeff.bg, padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>{coeff.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
