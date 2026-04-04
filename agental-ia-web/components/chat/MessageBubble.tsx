"use client";

import { motion } from "framer-motion";
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

export function MessageBubble({ message, isOwn, showAvatar, currentAgentName, currentAgentNick }: MessageBubbleProps) {
  const agentName = isOwn ? currentAgentName : (message.agent?.name ?? "?");
  const agentNick = isOwn ? currentAgentNick : (message.agent?.nick ?? "?");
  const isImage = isImageUrl(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 ${showAvatar ? "visible" : "invisible"}`}>
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${
          isOwn
            ? "bg-indigo-600/40 border-indigo-500/40 text-indigo-300"
            : "bg-slate-700/60 border-slate-600/40 text-slate-300"
        }`}>
          {initials(agentName)}
        </div>
      </div>

      {/* Bubble */}
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {showAvatar && (
          <p className={`text-xs text-slate-500 px-1 ${isOwn ? "text-right" : "text-left"}`}>
            {agentName} <span className="text-slate-600">@{agentNick}</span>
          </p>
        )}

        {isImage ? (
          /* Image message */
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
        ) : (
          /* Text message */
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
