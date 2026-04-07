"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Message } from "@/types";
import { formatTime, initials } from "@/lib/utils";

export interface ReactionGroup {
  emoji: string;
  count: number;
  agents: string[];
  hasMe: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  currentAgentName: string;
  currentAgentNick: string;
  currentAgentId: string;
  reactions?: ReactionGroup[];
  onReact?: (messageId: string, emoji: string) => void;
}

const EMOJI_PICKER = ["👍", "❤️", "🔥", "😂", "😮", "✅"];

function isImageUrl(content: string): boolean {
  return (
    content.startsWith("http") &&
    /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(content)
  );
}

function isAICommand(content: string): boolean {
  return content.startsWith("/ia ");
}

function isAIResponse(content: string): boolean {
  return content.startsWith("🤖 ");
}

function renderWithMentions(content: string, currentNick: string): React.ReactNode {
  const parts = content.split(/(\B@\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@") && /^@\w+$/.test(part)) {
      const isMe = part.slice(1).toLowerCase() === currentNick.toLowerCase();
      return (
        <span
          key={i}
          className={`font-semibold rounded px-0.5 ${
            isMe
              ? "text-[#00D4AA] bg-[#00D4AA]/15"
              : "text-indigo-300 bg-indigo-500/10"
          }`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar,
  currentAgentName,
  currentAgentNick,
  currentAgentId,
  reactions = [],
  onReact,
}: MessageBubbleProps) {
  const [showPicker, setShowPicker] = useState(false);

  const agentName = isOwn ? currentAgentName : (message.agent?.name ?? "?");
  const agentNick = isOwn ? currentAgentNick : (message.agent?.nick ?? "?");
  const isImage = isImageUrl(message.content);
  const isCmd = isAICommand(message.content);
  const isAI = isAIResponse(message.content);

  function handleReact(emoji: string) {
    setShowPicker(false);
    onReact?.(message.id, emoji);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 group ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 ${showAvatar ? "visible" : "invisible"}`}>
        {isAI ? (
          <div className="w-8 h-8 rounded-full border border-[#00D4AA]/40 bg-[#00D4AA]/20 flex items-center justify-center">
            <Sparkles size={14} className="text-[#00D4AA]" />
          </div>
        ) : (
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${
            isOwn
              ? "bg-indigo-600/40 border-indigo-500/40 text-indigo-300"
              : "bg-slate-700/60 border-slate-600/40 text-slate-300"
          }`}>
            {initials(agentName)}
          </div>
        )}
      </div>

      {/* Bubble + reactions */}
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {showAvatar && (
          <p className={`text-xs px-1 ${isOwn ? "text-right" : "text-left"} ${isAI ? "text-[#00D4AA]/70" : "text-slate-500"}`}>
            {isAI ? (
              <span className="flex items-center gap-1 text-[#00D4AA]/70">
                <Sparkles size={10} /> Agental.IA
              </span>
            ) : (
              <>{agentName} <span className="text-slate-600">@{agentNick}</span></>
            )}
          </p>
        )}

        <div className={`relative flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end gap-1.5`}>
          {/* Message content */}
          {isImage ? (
            <div className={`rounded-2xl overflow-hidden border ${
              isOwn ? "border-indigo-500/30 rounded-br-sm" : "border-white/10 rounded-bl-sm"
            }`}>
              <a href={message.content} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={message.content}
                  alt="Imagen compartida"
                  className="max-w-[280px] max-h-[320px] object-cover block hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
              </a>
            </div>
          ) : isAI ? (
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed break-words whitespace-pre-wrap bg-[#00D4AA]/10 border border-[#00D4AA]/25 text-slate-100" style={{ boxShadow: "0 0 20px rgba(0,212,170,0.08)" }}>
              {message.content.slice(2).trim()}
            </div>
          ) : isCmd ? (
            <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap bg-[#00D4AA]/5 border border-[#00D4AA]/15 text-[#00D4AA]/80 italic rounded-br-sm">
              {message.content}
            </div>
          ) : (
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap ${
              isOwn
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-white/10 text-slate-200 rounded-bl-sm border border-white/10"
            }`}>
              {renderWithMentions(message.content, currentAgentNick)}
            </div>
          )}

          {/* Reaction picker button — shows on group hover */}
          {onReact && (
            <div className={`relative opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mb-0.5`}>
              <button
                onClick={() => setShowPicker(p => !p)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-[11px] transition-colors"
                title="Reaccionar"
              >
                😊
              </button>
              {showPicker && (
                <div className={`absolute bottom-8 ${isOwn ? "right-0" : "left-0"} flex items-center gap-1 bg-[#0D1117] border border-white/15 rounded-2xl px-2 py-1.5 shadow-xl z-10`}>
                  {EMOJI_PICKER.map(e => (
                    <button
                      key={e}
                      onClick={() => handleReact(e)}
                      className="text-base hover:scale-125 transition-transform p-0.5"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reaction summary */}
        {reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 px-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            {reactions.map(r => (
              <button
                key={r.emoji}
                onClick={() => onReact?.(message.id, r.emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                  r.hasMe
                    ? "bg-indigo-500/25 border-indigo-500/40 text-white"
                    : "bg-white/8 border-white/15 text-slate-300 hover:bg-white/12"
                }`}
              >
                <span>{r.emoji}</span>
                <span className="font-semibold text-[10px]">{r.count}</span>
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-600 px-1">{formatTime(message.created_at)}</p>
      </div>
    </motion.div>
  );
}
