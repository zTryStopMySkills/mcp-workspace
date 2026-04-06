"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { Message } from "@/types";
import { formatTime, initials } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  currentAgentName: string;
  currentAgentNick: string;
}

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

export function MessageBubble({ message, isOwn, showAvatar, currentAgentName, currentAgentNick }: MessageBubbleProps) {
  const agentName = isOwn ? currentAgentName : (message.agent?.name ?? "?");
  const agentNick = isOwn ? currentAgentNick : (message.agent?.nick ?? "?");
  const isImage = isImageUrl(message.content);
  const isCmd = isAICommand(message.content);
  const isAI = isAIResponse(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
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

      {/* Bubble */}
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
          /* AI response bubble */
          <div className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed break-words whitespace-pre-wrap bg-[#00D4AA]/10 border border-[#00D4AA]/25 text-slate-100" style={{ boxShadow: "0 0 20px rgba(0,212,170,0.08)" }}>
            {message.content.slice(2).trim()}
          </div>
        ) : isCmd ? (
          /* /ia command bubble */
          <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap bg-[#00D4AA]/5 border border-[#00D4AA]/15 text-[#00D4AA]/80 italic rounded-br-sm">
            {message.content}
          </div>
        ) : (
          /* Normal text message */
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap ${
            isOwn
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-white/10 text-slate-200 rounded-bl-sm border border-white/10"
          }`}>
            {message.content}
          </div>
        )}

        <p className="text-xs text-slate-600 px-1">{formatTime(message.created_at)}</p>
      </div>
    </motion.div>
  );
}
