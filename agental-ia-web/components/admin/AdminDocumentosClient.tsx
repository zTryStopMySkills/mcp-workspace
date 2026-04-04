"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FolderOpen, Loader2, X, FileText, Users, Send, Monitor } from "lucide-react";
import type { Document, Agent } from "@/types";
import { formatDate, fileTypeIcon, formatFileSize, getFileType, fileTypeBadgeColor } from "@/lib/utils";

interface AdminDocumentosClientProps {
  initialDocs: Document[];
  agents: Agent[];
}

export function AdminDocumentosClient({ initialDocs, agents }: AdminDocumentosClientProps) {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [showForm, setShowForm] = useState(false);
  const [sendingDoc, setSendingDoc] = useState<string | null>(null);
  const [sendTarget, setSendTarget] = useState<{ agentId: string; folderName: string }>({ agentId: "", folderName: "Recibidos" });
  const [sendMsg, setSendMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    visibility: "all" as "all" | "specific",
    agentIds: [] as string[],
    sendToWorkspace: false,
    workspaceAgentId: "",
    workspaceFolderName: "Recibidos"
  });

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) setSelectedFiles((prev) => [...prev, ...files]);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleAgent(id: string) {
    setForm((prev) => ({
      ...prev,
      agentIds: prev.agentIds.includes(id)
        ? prev.agentIds.filter((a) => a !== id)
        : [...prev.agentIds, id]
    }));
  }

  async function handleSendToWorkspace(docId: string) {
    if (!sendTarget.agentId) return;
    const res = await fetch("/api/workspace/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: sendTarget.agentId, document_id: docId, folder_name: sendTarget.folderName || "Recibidos" })
    });
    const data = await res.json();
    setSendingDoc(null);
    if (res.ok) { setSendMsg("Enviado al escritorio ✓"); setTimeout(() => setSendMsg(""), 3000); }
    else setSendMsg(data.error ?? "Error al enviar");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFiles.length === 0) { setError("Selecciona al menos un archivo."); return; }
    setError("");
    setUploading(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    const newDocs: Document[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setUploadProgress({ current: i + 1, total: selectedFiles.length });

      // 1. Subir archivo
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const uploaded = await uploadRes.json();
      if (!uploadRes.ok) {
        setError(`Error al subir "${file.name}": ${uploaded.error ?? "Error desconocido"}`);
        setUploading(false);
        return;
      }

      // 2. Crear documento
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title && selectedFiles.length === 1 ? form.title : file.name,
          description: form.description || null,
          file_url: uploaded.url,
          file_name: file.name,
          file_type: getFileType(file.name, file.type),
          file_size: file.size,
          visibility: form.visibility,
          agent_ids: form.visibility === "specific" ? form.agentIds : []
        })
      });
      const doc = await docRes.json();
      if (!docRes.ok) {
        setError(`Error al guardar "${file.name}": ${doc.error ?? "Error desconocido"}`);
        setUploading(false);
        return;
      }
      // 3. Send to workspace if requested
      if (form.sendToWorkspace && form.workspaceAgentId) {
        await fetch("/api/workspace/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent_id: form.workspaceAgentId,
            document_id: doc.id,
            folder_name: form.workspaceFolderName || "Recibidos"
          })
        });
      }

      newDocs.push(doc);
    }

    setUploading(false);
    setDocs((prev) => [...newDocs.reverse(), ...prev]);
    setSelectedFiles([]);
    setForm({ title: "", description: "", visibility: "all", agentIds: [], sendToWorkspace: false, workspaceAgentId: "", workspaceFolderName: "Recibidos" });
    setShowForm(false);
    const n = newDocs.length;
    setSuccess(`${n} documento${n > 1 ? "s" : ""} compartido${n > 1 ? "s" : ""} correctamente.`);
    setTimeout(() => setSuccess(""), 5000);
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-amber-400 text-sm font-medium mb-1">Administración</p>
          <h1 className="text-3xl font-bold text-white">Documentos</h1>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-colors"
        >
          <Upload size={16} />
          Subir documentos
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-8">Comparte archivos con todos o con agentes específicos. Puedes subir varios a la vez.</p>

      {/* Upload Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">Subir documentos</h2>
                <p className="text-xs text-slate-500 mt-0.5">Puedes seleccionar o arrastrar varios archivos a la vez</p>
              </div>
              <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                dragOver ? "border-amber-400 bg-amber-500/10" : "border-white/20 hover:border-white/40"
              }`}
            >
              <Upload size={22} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-400">
                Arrastra archivos aquí o <span className="text-amber-400 underline">haz clic para seleccionar</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">PDF, imágenes, vídeos, documentos… varios a la vez</p>
              <input ref={fileRef} type="file" onChange={handleFileSelect} multiple className="hidden" />
            </div>

            {/* File list */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400">{selectedFiles.length} archivo{selectedFiles.length > 1 ? "s" : ""} seleccionado{selectedFiles.length > 1 ? "s" : ""}</p>
                {selectedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-lg shrink-0">{fileTypeIcon(getFileType(file.name))}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-slate-500 hover:text-white transition-colors shrink-0"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Title (solo si hay 1 archivo) */}
            {selectedFiles.length <= 1 && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Título (opcional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Se usará el nombre del archivo si se deja vacío"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Descripción (opcional{selectedFiles.length > 1 ? " — se aplicará a todos" : ""})
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descripción del documento..."
                rows={2}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Visibilidad</label>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "Todos los agentes", icon: Users },
                  { value: "specific", label: "Agentes específicos", icon: FileText }
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, visibility: opt.value as "all" | "specific" })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${
                        form.visibility === opt.value
                          ? "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                          : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon size={14} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Send to workspace */}
            <div className="border border-white/8 rounded-xl p-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sendToWorkspace}
                  onChange={(e) => setForm({ ...form, sendToWorkspace: e.target.checked })}
                  className="accent-amber-400 w-4 h-4"
                />
                <Monitor size={14} className="text-amber-400" />
                <span className="text-sm text-slate-300">Enviar al escritorio de un agente</span>
              </label>
              {form.sendToWorkspace && (
                <div className="space-y-3 pl-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Agente destino</label>
                    <select
                      value={form.workspaceAgentId}
                      onChange={(e) => setForm({ ...form, workspaceAgentId: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="" className="bg-[#0D1117]">Seleccionar agente…</option>
                      {agents.map((a) => (
                        <option key={a.id} value={a.id} className="bg-[#0D1117]">@{a.nick} — {a.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Carpeta destino</label>
                    <input
                      type="text"
                      value={form.workspaceFolderName}
                      onChange={(e) => setForm({ ...form, workspaceFolderName: e.target.value })}
                      placeholder="Recibidos"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <p className="text-xs text-slate-600 mt-1">Se creará si no existe</p>
                  </div>
                </div>
              )}
            </div>

            {/* Agent selector (visibility specific) */}
            {form.visibility === "specific" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Seleccionar agentes</label>
                <div className="flex flex-wrap gap-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => toggleAgent(agent.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        form.agentIds.includes(agent.id)
                          ? "bg-indigo-600/30 border border-indigo-500/50 text-indigo-300"
                          : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      @{agent.nick}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-400">⚠️ {error}</p>}

            <div className="flex items-center justify-end gap-3">
              {uploading && uploadProgress.total > 1 && (
                <span className="text-xs text-slate-400">
                  Subiendo {uploadProgress.current} de {uploadProgress.total}…
                </span>
              )}
              <button
                type="submit"
                disabled={uploading || selectedFiles.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold rounded-xl text-sm transition-colors"
              >
                {uploading && <Loader2 size={14} className="animate-spin" />}
                {uploading
                  ? `Subiendo${uploadProgress.total > 1 ? ` (${uploadProgress.current}/${uploadProgress.total})` : ""}…`
                  : `Compartir${selectedFiles.length > 1 ? ` ${selectedFiles.length} archivos` : ""}`}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
          >
            ✓ {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send msg */}
      <AnimatePresence>
        {sendMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mb-3 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            {sendMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Docs list */}
      {docs.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FolderOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p>Aún no has subido documentos.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="space-y-2">
              <div className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/10 rounded-xl">
                <span className="text-2xl shrink-0">{fileTypeIcon(doc.file_type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs border px-1.5 py-0.5 rounded-full ${fileTypeBadgeColor(doc.file_type)}`}>
                      {doc.file_type.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(doc.created_at)}</span>
                    {doc.file_size && <span className="text-xs text-slate-500">{formatFileSize(doc.file_size)}</span>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                  doc.visibility === "all"
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}>
                  {doc.visibility === "all" ? "Todos" : "Específico"}
                </span>
                <button
                  onClick={() => setSendingDoc(sendingDoc === doc.id ? null : doc.id)}
                  title="Enviar al escritorio de agente"
                  className="shrink-0 p-2 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-slate-400 hover:text-amber-300 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
              {/* Inline send panel */}
              <AnimatePresence>
                {sendingDoc === doc.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-end gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                      <Monitor size={14} className="text-amber-400 mb-2 shrink-0" />
                      <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">Agente</label>
                        <select
                          value={sendTarget.agentId}
                          onChange={(e) => setSendTarget({ ...sendTarget, agentId: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                        >
                          <option value="" className="bg-[#0D1117]">Elegir agente…</option>
                          {agents.map((a) => (
                            <option key={a.id} value={a.id} className="bg-[#0D1117]">@{a.nick} — {a.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-slate-400 mb-1">Carpeta</label>
                        <input
                          type="text"
                          value={sendTarget.folderName}
                          onChange={(e) => setSendTarget({ ...sendTarget, folderName: e.target.value })}
                          placeholder="Recibidos"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => handleSendToWorkspace(doc.id)}
                        disabled={!sendTarget.agentId}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold rounded-xl text-xs transition-colors shrink-0"
                      >
                        Enviar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
