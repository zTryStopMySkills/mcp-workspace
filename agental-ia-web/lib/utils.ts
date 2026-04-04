import type { FileType } from "@/types";

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileType(fileName: string, mimeType?: string): FileType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["txt", "md", "csv", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) return "text";
  return "other";
}

export function fileTypeIcon(type: FileType): string {
  switch (type) {
    case "pdf": return "📄";
    case "image": return "🖼️";
    case "video": return "🎥";
    case "text": return "📝";
    default: return "📎";
  }
}

export function fileTypeBadgeColor(type: FileType): string {
  switch (type) {
    case "pdf": return "bg-red-500/20 text-red-300 border-red-500/30";
    case "image": return "bg-green-500/20 text-green-300 border-green-500/30";
    case "video": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "text": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function isNewDoc(createdAt: string): boolean {
  const ms = Date.now() - new Date(createdAt).getTime();
  return ms < 7 * 24 * 60 * 60 * 1000; // menos de 7 días
}
