"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Loader2, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  initialMessages: Message[];
  currentAgentId: string;
  currentAgentNick: string;
  currentAgentName: string;
}

export function ChatWindow({ initialMessages, currentAgentId, currentAgentNick, currentAgentName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Suscripción Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const newMsg = payload.new as { id: string; agent_id: string; content: string; created_at: string };

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
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function postMessage(content: string) {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
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
    if (!imageFile) return; // paste de texto normal

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

  const isBusy = sending || uploadingImage;

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] lg:h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-[#0A0F1E]/80 backdrop-blur shrink-0">
        <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
          <MessageCircle size={18} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="font-semibold text-white text-base">Chat del Equipo</h1>
          <p className="text-xs text-slate-400">Comunicación privada entre agentes · Puedes pegar imágenes con Ctrl+V</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-400">Conectado</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium mb-1">El chat está vacío</p>
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

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/10 bg-[#0A0F1E]/80 backdrop-blur shrink-0">
        <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:border-indigo-500/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Escribe un mensaje… (Enter para enviar · Shift+Enter para salto · Ctrl+V para pegar imágenes)"
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
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <ImageIcon size={11} />
            Pega imágenes con Ctrl+V
          </span>
          {input.length > 1800 && (
            <p className="text-xs text-amber-400">{2000 - input.length} caracteres restantes</p>
          )}
        </div>
      </div>
    </div>
  );
}
