"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Download, ExternalLink, Loader2, AlertCircle,
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw,
  FileText, Play, Pause, Volume2, VolumeX, RefreshCw, FileDown,
  MessageSquare, Send, Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Document } from "@/types";
import { formatDate, formatFileSize, fileTypeBadgeColor, formatTime, initials } from "@/lib/utils";

async function exportToDocx(doc: Document) {
  const { Document: DocxDoc, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TableRow, TableCell, Table, WidthType } = await import("docx");

  const rows = [
    ["Título", doc.title],
    ["Tipo", doc.file_type.toUpperCase()],
    ["Archivo", doc.file_name],
    doc.file_size ? ["Tamaño", formatFileSize(doc.file_size)] : null,
    ["Subido", formatDate(doc.created_at)],
    doc.creator ? ["Por", `@${doc.creator.nick} · ${doc.creator.name}`] : null,
    ["URL", doc.file_url],
  ].filter(Boolean) as [string, string][];

  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0 },
      bottom: { style: BorderStyle.NONE, size: 0 },
      left: { style: BorderStyle.NONE, size: 0 },
      right: { style: BorderStyle.NONE, size: 0 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
      insideVertical: { style: BorderStyle.NONE, size: 0 },
    },
    rows: rows.map(([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: "64748b", size: 20 })] })],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: value, size: 20 })] })],
          }),
        ],
      })
    ),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentParas: any[] = [];

  // Para archivos de texto, intentar cargar el contenido
  const textExts = ["txt", "md", "csv", "json", "xml", "html", "htm", "js", "ts", "py", "css", "log"];
  const ext = doc.file_name.split(".").pop()?.toLowerCase() ?? "";
  if (textExts.includes(ext)) {
    try {
      const text = await fetch(doc.file_url).then(r => r.text());
      contentParas.push(
        new Paragraph({ text: "", spacing: { before: 400 } }),
        new Paragraph({ children: [new TextRun({ text: "Contenido", bold: true, size: 28 })], heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "", spacing: { before: 100 } }),
        ...text.split("\n").slice(0, 500).map(line =>
          new Paragraph({ children: [new TextRun({ text: line, size: 20, font: "Courier New" })], spacing: { after: 0 } })
        )
      );
    } catch {
      // silently skip if fetch fails
    }
  }

  const docx = new DocxDoc({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: doc.title, bold: true, size: 48, color: "0f172a" })],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          alignment: AlignmentType.LEFT,
        }),
        ...(doc.description ? [
          new Paragraph({
            children: [new TextRun({ text: doc.description, size: 24, color: "475569" })],
            spacing: { after: 400 },
          }),
        ] : []),
        new Paragraph({ children: [new TextRun({ text: "Información del documento", bold: true, size: 28, color: "334155" })], heading: HeadingLevel.HEADING_2, spacing: { after: 160 } }),
        metaTable,
        ...contentParas,
        new Paragraph({ text: "", spacing: { before: 600 } }),
        new Paragraph({
          children: [new TextRun({ text: "Exportado desde Agental.IA · " + new Date().toLocaleDateString("es-ES"), size: 16, color: "94a3b8", italics: true })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(docx);
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: `${doc.title.replace(/[^a-z0-9áéíóúüñ ]/gi, "_")}.docx` });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface DocumentViewerProps { doc: Document; }

function getExt(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

type ViewMode = "pdf-google" | "office" | "image" | "video" | "text" | "audio" | "fallback";

function detectViewMode(doc: Document): ViewMode {
  const ext = getExt(doc.file_name);
  if (doc.file_type === "image") return "image";
  if (doc.file_type === "video") return "video";
  if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext)) return "audio";
  if (doc.file_type === "pdf") return "pdf-google";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "odp"].includes(ext)) return "office";
  if (["txt", "md", "csv", "json", "xml", "html", "htm", "js", "ts", "py", "css", "log"].includes(ext)) return "text";
  return "pdf-google";
}

/* ─── Sub-viewers ─── */

function ImageViewer({ doc }: { doc: Document }) {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative bg-[#060A10] ${fullscreen ? "fixed inset-0 z-50 flex flex-col" : ""}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D1117]/90 border-b border-white/8 backdrop-blur">
        <span className="text-xs text-[#8B95A9] font-mono">{doc.file_name}</span>
        <div className="flex items-center gap-1">
          <ToolBtn onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} title="Reducir"><ZoomOut size={14} /></ToolBtn>
          <span className="text-xs text-[#8B95A9] w-12 text-center">{Math.round(zoom * 100)}%</span>
          <ToolBtn onClick={() => setZoom(z => Math.min(4, z + 0.25))} title="Ampliar"><ZoomIn size={14} /></ToolBtn>
          <ToolBtn onClick={() => setZoom(1)} title="Restablecer"><span className="text-xs font-mono">1:1</span></ToolBtn>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolBtn onClick={() => setRotation(r => (r + 90) % 360)} title="Rotar"><RotateCw size={14} /></ToolBtn>
          <ToolBtn onClick={() => setFullscreen(!fullscreen)} title={fullscreen ? "Salir" : "Pantalla completa"}>
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </ToolBtn>
        </div>
      </div>
      {/* Image */}
      <div className={`flex items-center justify-center overflow-auto ${fullscreen ? "flex-1" : "min-h-[400px] max-h-[70vh]"} p-6`}>
        {imgError ? (
          <FallbackViewer />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.file_url}
            alt={doc.title}
            onError={() => setImgError(true)}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 0 60px rgba(0,212,170,0.1)"
            }}
          />
        )}
      </div>
    </div>
  );
}

function VideoViewer({ doc }: { doc: Document }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  }

  return (
    <div className={`relative bg-black ${fullscreen ? "fixed inset-0 z-50 flex flex-col" : ""}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D1117]/90 border-b border-white/8">
        <span className="text-xs text-[#8B95A9] font-mono">{doc.file_name}</span>
        <div className="flex items-center gap-1">
          <ToolBtn onClick={togglePlay} title={playing ? "Pausar" : "Reproducir"}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </ToolBtn>
          <ToolBtn onClick={() => { setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted; }} title="Silenciar">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </ToolBtn>
          <ToolBtn onClick={() => setFullscreen(!fullscreen)} title={fullscreen ? "Salir" : "Pantalla completa"}>
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </ToolBtn>
        </div>
      </div>
      <div className={`${fullscreen ? "flex-1 flex items-center justify-center" : ""}`}>
        {videoError ? (
          <FallbackViewer />
        ) : (
          <video
            ref={videoRef}
            src={doc.file_url}
            controls
            className={`w-full ${fullscreen ? "max-h-full" : "max-h-[65vh]"}`}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setVideoError(true)}
          />
        )}
      </div>
    </div>
  );
}

function AudioViewer({ doc }: { doc: Document }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 gap-6">
      {/* Waveform visual */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/30 flex items-center justify-center">
            <span className="text-3xl">🎵</span>
          </div>
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border border-[#00D4AA]/15 animate-ping" style={{ animationDuration: "2s" }} />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold mb-1">{doc.title}</p>
        <p className="text-[#8B95A9] text-sm font-mono">{doc.file_name}</p>
      </div>
      <audio controls className="w-full max-w-md" preload="metadata" style={{ accentColor: "#00D4AA" }}>
        <source src={doc.file_url} />
      </audio>
    </div>
  );
}

function TextViewer({ doc }: { doc: Document }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const ext = getExt(doc.file_name);

  useEffect(() => {
    fetch(doc.file_url)
      .then(r => r.text())
      .then(t => { setContent(t); setLoading(false); })
      .catch(() => { setContent("No se pudo cargar el contenido."); setLoading(false); });
  }, [doc.file_url]);

  const langColor = ext === "json" ? "text-[#C9A84C]"
    : ext === "csv" ? "text-[#2DD4BF]"
    : ["js", "ts", "py", "css", "html", "xml"].includes(ext) ? "text-[#8B5CF6]"
    : "text-slate-200";

  const langLabel = ext === "json" ? "JSON"
    : ext === "csv" ? "CSV"
    : ext === "md" ? "Markdown"
    : ["js", "ts"].includes(ext) ? "JavaScript/TypeScript"
    : ext === "py" ? "Python"
    : ext === "xml" ? "XML"
    : ext === "html" || ext === "htm" ? "HTML"
    : "Texto";

  return (
    <div>
      {/* Header toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-[#060A10]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-[#00D4AA]/60" />
          </div>
          <span className="text-xs text-[#8B95A9] font-mono ml-2">{doc.file_name}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-[#8B95A9] font-mono">{langLabel}</span>
      </div>
      {/* Line numbers + content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#00D4AA]" />
        </div>
      ) : (
        <div className="flex overflow-auto max-h-[68vh]">
          {/* Line numbers */}
          <div className="select-none px-4 py-5 text-right text-xs font-mono text-[#8B95A9]/40 bg-[#060A10] border-r border-white/5 leading-relaxed min-w-[52px]" aria-hidden>
            {content?.split("\n").map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Code */}
          <pre className={`flex-1 p-5 text-sm font-mono leading-relaxed whitespace-pre-wrap break-words ${langColor} bg-[#060A10]`}>
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}

type OfficeApp = "word" | "excel" | "powerpoint" | "pdf";

function getOfficeApp(ext: string): OfficeApp {
  if (["doc", "docx", "odt"].includes(ext)) return "word";
  if (["xls", "xlsx", "ods", "csv"].includes(ext)) return "excel";
  if (["ppt", "pptx", "odp"].includes(ext)) return "powerpoint";
  return "pdf";
}

const OFFICE_ICONS: Record<OfficeApp, { icon: string; color: string; name: string }> = {
  word:        { icon: "📘", color: "#2B579A", name: "Word" },
  excel:       { icon: "📗", color: "#217346", name: "Excel" },
  powerpoint:  { icon: "📙", color: "#D24726", name: "PowerPoint" },
  pdf:         { icon: "📄", color: "#E44B4B", name: "PDF" },
};

function OfficeViewer({ doc }: { doc: Document }) {
  const ext = getExt(doc.file_name);
  const app = getOfficeApp(ext);
  const info = OFFICE_ICONS[app];
  const encodedUrl = encodeURIComponent(doc.file_url);
  const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
  const openUrl  = `https://view.officeapps.live.com/op/view.aspx?src=${encodedUrl}`;
  const googleUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;

  const [mode, setMode] = useState<"office" | "google">("office");
  const [loaded, setLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const currentUrl = mode === "office" ? embedUrl : googleUrl;
  const currentLabel = mode === "office" ? `Microsoft Office Online · ${ext.toUpperCase()}` : `Google Docs Viewer · ${ext.toUpperCase()}`;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-[#060A10] flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl">{info.icon}</span>
          <div>
            <p className="text-xs font-semibold text-white leading-none">{ext.toUpperCase()} — {info.name}</p>
            <p className="text-[10px] text-[#8B95A9] mt-0.5 truncate">{currentLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Toggle viewer */}
          <button
            onClick={() => { setMode(m => m === "office" ? "google" : "office"); setLoaded(false); setIframeError(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-[#8B95A9] hover:text-white transition-colors"
            title="Cambiar visor"
          >
            <RefreshCw size={11} />
            {mode === "office" ? "Usar Google Docs" : "Usar Office Online"}
          </button>
          {/* Open in new tab */}
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold text-white transition-colors"
            style={{ background: info.color }}
          >
            <ExternalLink size={11} />
            Abrir en {info.name}
          </a>
        </div>
      </div>

      {/* Iframe */}
      <div className="relative">
        <AnimatePresence>
          {!loaded && !iframeError && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D1117]/95 z-10 gap-5 py-20"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-[#00D4AA]/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-[#00D4AA] animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm text-white font-medium">Cargando documento…</p>
                <p className="text-xs text-[#8B95A9] mt-1">
                  {mode === "office" ? "Microsoft Office Online" : "Google Docs Viewer"}
                </p>
              </div>
              <button
                onClick={() => { setMode("google"); setLoaded(false); setIframeError(false); retryKey; }}
                className="text-xs text-[#00D4AA] hover:underline"
              >
                ¿Tarda mucho? Prueba con Google Docs
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {iframeError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-5 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl" style={{ background: `${info.color}20` }}>
              {info.icon}
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Vista previa no disponible</p>
              <p className="text-[#8B95A9] text-sm max-w-sm">
                El visor en línea no pudo cargar el documento. Ábrelo directamente en {info.name} o descárgalo.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <a href={openUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: info.color }}>
                <ExternalLink size={14} />
                Abrir en {info.name}
              </a>
              <a href={doc.file_url} download={doc.file_name}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black bg-[#00D4AA]">
                <Download size={14} />
                Descargar
              </a>
              {mode === "office" && (
                <button
                  onClick={() => { setMode("google"); setLoaded(false); setIframeError(false); setRetryKey(k => k + 1); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-[#8B95A9] bg-white/5 border border-white/10 hover:text-white transition-colors">
                  <RefreshCw size={14} />
                  Probar con Google Docs
                </button>
              )}
            </div>
          </div>
        ) : (
          <iframe
            key={`${mode}-${retryKey}`}
            src={currentUrl}
            className="w-full h-[72vh]"
            title={currentLabel}
            onLoad={() => setLoaded(true)}
            onError={() => setIframeError(true)}
            allow="autoplay"
          />
        )}
      </div>
    </div>
  );
}

function IframeViewer({ url, label, color }: { url: string; label: string; color: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-[#060A10]">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs text-[#8B95A9]">{label}</span>
        {!loaded && !error && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-[#8B95A9]">
            <Loader2 size={11} className="animate-spin" /> Cargando...
          </span>
        )}
      </div>
      <AnimatePresence>
        {!loaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 top-10 flex flex-col items-center justify-center bg-[#0D1117]/95 z-10 gap-4"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-[#00D4AA]/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-[#00D4AA] animate-spin" />
              <div className="absolute inset-2 rounded-full border border-[#C9A84C]/20" />
            </div>
            <p className="text-sm text-[#8B95A9]">Preparando el documento…</p>
          </motion.div>
        )}
      </AnimatePresence>
      {error ? (
        <FallbackViewer />
      ) : (
        <iframe
          src={url}
          className="w-full h-[72vh]"
          title={label}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          allow="autoplay"
        />
      )}
    </div>
  );
}

function FallbackViewer() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
        <AlertCircle size={28} className="text-[#C9A84C]" />
      </div>
      <div>
        <p className="text-white font-semibold mb-1">Vista previa no disponible</p>
        <p className="text-[#8B95A9] text-sm max-w-sm">
          Este tipo de archivo no puede previsualizarse en el navegador. Usa los botones de arriba para descargarlo o abrirlo.
        </p>
      </div>
    </div>
  );
}

function ToolBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B95A9] hover:text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </button>
  );
}

/* ─── TYPE ICON mapping ─── */
function TypeBadge({ ext, fileType }: { ext: string; fileType: string }) {
  const label = ext.toUpperCase() || fileType.toUpperCase();
  const cls = fileTypeBadgeColor(fileType as never);
  return (
    <span className={`text-xs border px-2.5 py-0.5 rounded-full font-mono font-semibold ${cls}`}>
      {label}
    </span>
  );
}

/* ─── Comments Section ─── */

interface CommentData {
  id: string;
  content: string;
  created_at: string;
  agent: { id: string; nick: string; name: string; avatar_url: string | null } | null;
}

function CommentsSection({ docId }: { docId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/documents/${docId}/comments`)
      .then(r => r.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel(`doc-comments-${docId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "document_comments", filter: `document_id=eq.${docId}` }, async (payload) => {
          try {
            const row = payload.new as { id: string; content: string; created_at: string; agent_id: string };
            const { data: agent } = await supabase.from("agents").select("id, nick, name, avatar_url").eq("id", row.agent_id).single();
            setComments(prev => {
              if (prev.some(c => c.id === row.id)) return prev;
              return [...prev, { id: row.id, content: row.content, created_at: row.created_at, agent: agent ?? null }];
            });
          } catch { /* ignore realtime payload errors */ }
        })
        .on("postgres_changes", { event: "DELETE", schema: "public", table: "document_comments" }, (payload) => {
          try {
            const deleted = payload.old as { id: string };
            setComments(prev => prev.filter(c => c.id !== deleted.id));
          } catch { /* ignore */ }
        })
        .subscribe();
    } catch { /* table may not exist yet — comments will still load via API */ }

    return () => { if (channel) supabase.removeChannel(channel).catch(() => {}); };
  }, [docId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [comments]);

  async function postComment() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    const res = await fetch(`/api/documents/${docId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text })
    });
    setSending(false);
    if (!res.ok) setInput(text);
  }

  async function deleteComment(commentId: string) {
    await fetch(`/api/documents/${docId}/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId })
    });
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8">
        <MessageSquare size={15} className="text-[#00D4AA]" />
        <span className="text-sm font-semibold text-white">Comentarios</span>
        {comments.length > 0 && (
          <span className="ml-auto text-xs text-[#8B95A9]">{comments.length}</span>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto px-5 py-4 space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-sm text-[#8B95A9]/60 py-6">Sin comentarios aún. ¡Sé el primero!</p>
        ) : (
          comments.map(comment => {
            const isOwn = comment.agent?.id === session?.user.id;
            const isAdmin = session?.user.role === "admin";
            return (
              <div key={comment.id} className="flex items-start gap-3 group">
                <div className="w-7 h-7 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/20 flex items-center justify-center text-[10px] font-bold text-[#00D4AA] shrink-0 mt-0.5">
                  {comment.agent ? initials(comment.agent.name) : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-white">{comment.agent?.name ?? "?"}</span>
                    <span className="text-[10px] text-[#8B95A9]">@{comment.agent?.nick ?? "?"}</span>
                    <span className="text-[10px] text-[#8B95A9]/40 ml-auto">{formatTime(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed break-words">{comment.content}</p>
                </div>
                {(isOwn || isAdmin) && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8B95A9] hover:text-red-400 shrink-0 mt-0.5"
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-white/8 flex items-end gap-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postComment(); } }}
          placeholder="Añadir comentario…"
          maxLength={1000}
          rows={1}
          className="flex-1 bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-[#8B95A9]/60 focus:outline-none focus:border-[#00D4AA]/40 resize-none max-h-24 leading-relaxed"
          onInput={e => {
            const t = e.currentTarget;
            t.style.height = "auto";
            t.style.height = Math.min(t.scrollHeight, 96) + "px";
          }}
        />
        <button
          onClick={postComment}
          disabled={!input.trim() || sending}
          className="w-8 h-8 rounded-xl bg-[#00D4AA] text-black flex items-center justify-center shrink-0 hover:bg-[#00b894] transition-colors disabled:opacity-40"
        >
          {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export function DocumentViewer({ doc }: DocumentViewerProps) {
  const [exportingDocx, setExportingDocx] = useState(false);
  const viewMode = detectViewMode(doc);
  const encodedUrl = encodeURIComponent(doc.file_url);
  const googleUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
  const ext = getExt(doc.file_name);

  const viewerLabel = viewMode === "pdf-google" ? "Google Docs Viewer · PDF"
    : viewMode === "office" ? "Microsoft Office Online"
    : viewMode === "image" ? "Visor de imagen"
    : viewMode === "video" ? "Reproductor de vídeo"
    : viewMode === "audio" ? "Reproductor de audio"
    : viewMode === "text" ? "Editor de texto"
    : "Documento";

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
        <Link
          href="/documentos"
          className="inline-flex items-center gap-1.5 text-[#8B95A9] hover:text-white transition-colors group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Documentos
        </Link>
        <span className="text-[#8B95A9]/30">/</span>
        <span className="text-white font-medium truncate max-w-xs md:max-w-none" title={doc.title}>
          {doc.title}
        </span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row gap-5 mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/8">
          {/* Logo + file type icon */}
          <div className="flex items-center gap-4 sm:gap-0 sm:flex-col sm:items-center sm:justify-center sm:w-24 shrink-0">
            <div className="relative w-14 h-14 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/20" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                {viewMode === "image" ? "🖼️"
                  : viewMode === "video" ? "🎥"
                  : viewMode === "audio" ? "🎵"
                  : viewMode === "office" ? "📊"
                  : viewMode === "text" ? "📝"
                  : "📄"}
              </div>
            </div>
            <TypeBadge ext={ext} fileType={doc.file_type} />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{doc.title}</h1>
            {doc.description && (
              <p className="text-[#8B95A9] text-sm leading-relaxed mb-3">{doc.description}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-[#8B95A9]/60 flex-wrap">
              <span>Subido el {formatDate(doc.created_at)}</span>
              {doc.creator && <span>· por <span className="text-[#00D4AA]/80">@{doc.creator.nick}</span></span>}
              {doc.file_size && <span>· {formatFileSize(doc.file_size)}</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col gap-2 shrink-0 sm:justify-center">
            <a
              href={doc.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white/8 hover:bg-white/14 text-white rounded-xl transition-colors border border-white/10 flex-1 sm:flex-none justify-center"
            >
              <ExternalLink size={14} />
              <span>Abrir</span>
            </a>
            <a
              href={doc.file_url}
              download={doc.file_name}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors flex-1 sm:flex-none justify-center"
              style={{ background: "linear-gradient(135deg, #00D4AA, #2DD4BF)", color: "#0D1117" }}
            >
              <Download size={14} />
              <span>Descargar</span>
            </a>
            <button
              onClick={async () => {
                setExportingDocx(true);
                try {
                  await exportToDocx(doc);
                } catch (err) {
                  console.error("Export error:", err);
                  alert("No se pudo exportar el documento. Inténtalo de nuevo.");
                } finally {
                  setExportingDocx(false);
                }
              }}
              disabled={exportingDocx}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-colors flex-1 sm:flex-none justify-center border border-[#C9A84C]/30 text-[#C9A84C] bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 disabled:opacity-50"
              title="Exportar como documento Word"
            >
              {exportingDocx ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
              <span>Exportar .docx</span>
            </button>
          </div>
        </div>

        {/* ── Viewer container ── */}
        <div className="rounded-2xl overflow-hidden border border-white/8 bg-[#060A10]" style={{ boxShadow: "0 0 0 1px rgba(0,212,170,0.05), 0 24px 64px rgba(0,0,0,0.6)" }}>
          {/* Viewer label bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#0D1117]/60 border-b border-white/5">
            <div className="flex gap-1 mr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00D4AA]/50" />
            </div>
            <FileText size={12} className="text-[#8B95A9]" />
            <span className="text-xs text-[#8B95A9]">{viewerLabel}</span>
            <div className="ml-auto flex items-center gap-1">
              <Image src="/logo.jpg" alt="Agental.IA" width={16} height={16} className="rounded opacity-60" />
              <span className="text-xs text-[#8B95A9]/40">Agental.IA</span>
            </div>
          </div>

          {viewMode === "image"      && <ImageViewer doc={doc} />}
          {viewMode === "video"      && <VideoViewer doc={doc} />}
          {viewMode === "audio"      && <AudioViewer doc={doc} />}
          {viewMode === "text"       && <TextViewer doc={doc} />}
          {viewMode === "pdf-google" && <IframeViewer url={googleUrl} label={`PDF — ${doc.file_name}`} color="bg-red-400" />}
          {viewMode === "office"     && <OfficeViewer doc={doc} />}
          {viewMode === "fallback"   && <FallbackViewer />}
        </div>

        {/* Viewer attribution */}
        {(viewMode === "pdf-google" || viewMode === "office") && (
          <p className="text-xs text-[#8B95A9]/40 text-center mt-3">
            {viewMode === "pdf-google" ? "Vista previa vía Google Docs Viewer" : "Vista previa vía Microsoft Office Online"}
            {" · "}Si no carga, usa Descargar.
          </p>
        )}

        {/* Comments */}
        <CommentsSection docId={doc.id} />
      </motion.div>
    </div>
  );
}
