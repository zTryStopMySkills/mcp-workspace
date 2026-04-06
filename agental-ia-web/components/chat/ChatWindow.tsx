"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Loader2, ImageIcon, WifiOff, ChevronUp, Sparkles, Hash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Message, Channel } from "@/types";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  initialMessages: Message[];
  initialChannelId: string | null;
  channels: Channel[];
  currentAgentId: string;
  currentAgentNick: string;
  currentAgentName: string;
}

export function ChatWindow({
  initialMessages,
  initialChannelId,
  channels,
  currentAgentId,
  currentAgentNick,
  currentAgentName,
}: ChatWindowProps) {
  const [activeChannelId, setActiveChannelId] = useState<string | null>(initialChannelId);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [askingAI, setAskingAI] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialMessages.length >= 40);
  const [switchingChannel, setSwitchingChannel] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId) ?? channels[0] ?? null;

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "nearest" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Suscripción Supabase Realtime — filtra por canal activo
  useEffect(() => {
    const channel = supabase
      .channel(`public:messages:${activeChannelId ?? "all"}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const newMsg = payload.new as { id: string; agent_id: string; content: string; created_at: string; channel_id: string | null };

          // Ignore messages from other channels
          if (activeChannelId && newMsg.channel_id !== activeChannelId) return;

          const { data: agent } = await supabase
            .from("agents")
            .select("nick, name, avatar_url")
            .eq("id", newMsg.agent_id)
            .single();

          const enriched: Message = {
            ...newMsg,
            agent: agent ?? { nick: "?", name: "Agente", avatar_url: null }
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === enriched.id)) return prev;
            return [...prev, enriched];
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setConnected(true);
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") setConnected(false);
      });

    return () => { supabase.removeChannel(channel); };
  }, [activeChannelId]);

  async function switchChannel(channelId: string) {
    if (channelId === activeChannelId) return;
    setSwitchingChannel(true);
    setError("");
    try {
      const res = await fetch(`/api/messages?limit=40&channel_id=${channelId}`);
      if (res.ok) {
        const data: Message[] = await res.json();
        setMessages(data);
        setHasMore(data.length >= 40);
        setActiveChannelId(channelId);
      }
    } catch {
      // silently ignore
    } finally {
      setSwitchingChannel(false);
    }
  }

  async function loadMoreMessages() {
    if (loadingMore || !hasMore || messages.length === 0) return;
    setLoadingMore(true);
    try {
      const oldest = messages[0];
      const params = new URLSearchParams({ before: oldest.created_at, limit: "40" });
      if (activeChannelId) params.set("channel_id", activeChannelId);
      const res = await fetch(`/api/messages?${params}`);
      if (res.ok) {
        const older: Message[] = await res.json();
        if (older.length < 40) setHasMore(false);
        if (older.length > 0) {
          const container = messagesContainerRef.current;
          const prevScrollHeight = container?.scrollHeight ?? 0;
          setMessages((prev) => [...older, ...prev]);
          requestAnimationFrame(() => {
            if (container) container.scrollTop = container.scrollHeight - prevScrollHeight;
          });
        } else {
          setHasMore(false);
        }
      }
    } catch {
      // Red caída — el banner de reconexión ya lo indica
    } finally {
      setLoadingMore(false);
    }
  }

  async function postMessage(content: string) {
    const body: Record<string, unknown> = { content };
    if (activeChannelId) body.channel_id = activeChannelId;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al enviar. Inténtalo de nuevo.");
      return false;
    }
    return true;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    // Detectar comando /ia
    const iaMatch = text.match(/^\/ia\s+([\s\S]+)/i);
    if (iaMatch) {
      const question = iaMatch[1].trim();
      setSending(true);
      setError("");
      setInput("");

      await postMessage(`/ia ${question}`);
      setSending(false);

      setAskingAI(true);
      try {
        const context = messages.slice(-6).map(m => ({
          role: "user" as const,
          content: m.content
        }));
        const res = await fetch("/api/chat/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, context })
        });
        const data = await res.json();
        if (res.ok) {
          await postMessage(`🤖 ${data.response}`);
        } else {
          setError(data.error ?? "Error al consultar la IA");
        }
      } catch {
        setError("No se pudo conectar con la IA");
      } finally {
        setAskingAI(false);
      }
      return;
    }

    setSending(true);
    setError("");
    setInput("");

    const ok = await postMessage(text);
    setSending(false);
    if (!ok) setInput(text);
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const files = Array.from(e.clipboardData.files);
    const imageFile = files.find((f) => f.type.startsWith("image/"));
    if (!imageFile) return;

    e.preventDefault();
    setUploadingImage(true);
    setError("");

    const fd = new FormData();
    fd.append("file", imageFile);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });

    if (!uploadRes.ok) {
      const data = await uploadRes.json();
      setError(data.error ?? "Error al subir la imagen.");
      setUploadingImage(false);
      return;
    }

    const { url } = await uploadRes.json();
    await postMessage(url);
    setUploadingImage(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const groupedMessages = messages.reduce<Array<{ messages: Message[]; agentId: string }>>((acc, msg) => {
    const last = acc[acc.length - 1];
    if (last && last.agentId === msg.agent_id) {
      last.messages.push(msg);
    } else {
      acc.push({ agentId: msg.agent_id, messages: [msg] });
    }
    return acc;
  }, []);

  const isBusy = sending || uploadingImage || askingAI;

  return (
    <div className="flex h-[calc(100vh-0px)] lg:h-screen">
      {/* Channel sidebar */}
      {channels.length > 1 && (
        <div className="hidden md:flex flex-col w-48 border-r border-white/8 bg-[#0A0F1E] shrink-0">
          <div className="px-3 py-4 border-b border-white/8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Canales</p>
          </div>
          <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
            {channels.map(ch => {
              const active = ch.id === activeChannelId;
              return (
                <button
                  key={ch.id}
                  onClick={() => switchChannel(ch.id)}
                  disabled={switchingChannel}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-left ${
                    active
                      ? "bg-white/8 text-white font-medium"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Hash size={13} style={{ color: active ? ch.color : undefined }} />
                  <span className="truncate">{ch.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
            <MessageCircle size={18} className="text-indigo-400" />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-white text-base truncate">
              {activeChannel ? `#${activeChannel.name}` : "Chat del Equipo"}
            </h1>
            <p className="text-xs text-slate-400 truncate">
              {activeChannel?.description ?? "Comunicación privada entre agentes"}
              {" · Ctrl+V para pegar imágenes"}
            </p>
          </div>
          {/* Mobile channel selector */}
          {channels.length > 1 && (
            <div className="md:hidden ml-auto flex gap-1 overflow-x-auto shrink-0 max-w-[160px]">
              {channels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => switchChannel(ch.id)}
                  className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                    ch.id === activeChannelId
                      ? "bg-white/10 text-white font-medium"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Hash size={11} />
                  {ch.name}
                </button>
              ))}
            </div>
          )}
          <div className={`ml-auto flex items-center gap-1.5 shrink-0 ${channels.length > 1 ? "hidden md:flex" : ""}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-xs text-slate-400">{connected ? "Conectado" : "Sin conexión"}</span>
          </div>
        </div>

        {/* Disconnected banner */}
        <AnimatePresence>
          {!connected && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-between gap-3 px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-sm text-red-400 shrink-0"
            >
              <div className="flex items-center gap-2">
                <WifiOff size={14} />
                Conexión perdida — los mensajes nuevos no llegarán en tiempo real
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-xs px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors shrink-0"
              >
                Reconectar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Channel switching overlay */}
        <AnimatePresence>
          {switchingChannel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0A0F1E]/60 backdrop-blur-sm z-10 flex items-center justify-center"
            >
              <Loader2 size={24} className="animate-spin text-[#00D4AA]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {hasMore && messages.length > 0 && (
            <div className="flex justify-center pb-2">
              <button
                onClick={loadMoreMessages}
                disabled={loadingMore}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors disabled:opacity-50"
              >
                {loadingMore
                  ? <Loader2 size={12} className="animate-spin" />
                  : <ChevronUp size={12} />
                }
                {loadingMore ? "Cargando…" : "Cargar mensajes anteriores"}
              </button>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium mb-1">El canal está vacío</p>
              <p className="text-sm">¡Sé el primero en escribir un mensaje!</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {groupedMessages.map((group, gi) => (
                <div key={`${group.agentId}-${gi}`} className="space-y-1">
                  {group.messages.map((msg, mi) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isOwn={msg.agent_id === currentAgentId}
                      showAvatar={mi === 0}
                      currentAgentName={currentAgentName}
                      currentAgentNick={currentAgentNick}
                    />
                  ))}
                </div>
              ))}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 mb-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Uploading image indicator */}
        <AnimatePresence>
          {uploadingImage && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 mb-2 flex items-center gap-2 text-sm text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2"
            >
              <Loader2 size={14} className="animate-spin" />
              Subiendo imagen…
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI thinking indicator */}
        <AnimatePresence>
          {askingAI && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-4 mb-2 flex items-center gap-2 text-sm text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-xl px-3 py-2"
            >
              <Sparkles size={14} className="animate-pulse" />
              Agental.IA está pensando…
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="px-4 py-4 border-t border-white/10 bg-[#0A0F1E]/80 backdrop-blur shrink-0">
          <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:border-indigo-500/50 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Escribe un mensaje… · /ia [pregunta] para consultar la IA · Ctrl+V para pegar imágenes"
              rows={1}
              maxLength={2000}
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none focus:outline-none max-h-32 leading-relaxed"
              style={{ height: "auto" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 128) + "px";
              }}
            />
            <motion.button
              onClick={sendMessage}
              disabled={!input.trim() || isBusy}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-colors"
              title="Enviar mensaje"
            >
              {sending
                ? <Loader2 size={15} className="animate-spin text-white" />
                : <Send size={15} className="text-white" />
              }
            </motion.button>
          </div>
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-xs text-slate-600 flex items-center gap-2">
              <span className="flex items-center gap-1"><ImageIcon size={11} /> Ctrl+V imagen</span>
              <span className="flex items-center gap-1"><Sparkles size={11} className="text-[#00D4AA]/60" /> /ia pregunta</span>
            </span>
            {input.length > 1800 && (
              <p className="text-xs text-amber-400">{2000 - input.length} caracteres restantes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
