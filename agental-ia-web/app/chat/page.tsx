import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Message, Channel } from "@/types";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  // Cargar canales
  const { data: channels } = await supabaseAdmin
    .from("channels")
    .select("id, name, description, color, is_default")
    .order("is_default", { ascending: false })
    .order("name");

  // Canal por defecto
  const defaultChannel = (channels ?? []).find(c => c.is_default) ?? channels?.[0] ?? null;

  // Últimos 40 mensajes del canal por defecto
  let messagesQuery = supabaseAdmin
    .from("messages")
    .select("id, agent_id, content, created_at, channel_id, agent:agent_id(nick, name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(40);

  if (defaultChannel) {
    messagesQuery = messagesQuery.eq("channel_id", defaultChannel.id);
  }

  const { data: messages } = await messagesQuery
    .then(({ data, error }) => ({ data: (data ?? []).reverse(), error }));

  // Agentes activos para menciones
  const { data: agents } = await supabaseAdmin
    .from("agents")
    .select("id, nick, name")
    .eq("is_active", true)
    .order("nick");

  return (
    <DashboardLayout>
      <ChatWindow
        initialMessages={(messages ?? []) as unknown as Message[]}
        initialChannelId={defaultChannel?.id ?? null}
        channels={(channels ?? []) as unknown as Channel[]}
        currentAgentId={session.user.id}
        currentAgentNick={session.user.nick}
        currentAgentName={session.user.name}
        agents={(agents ?? []) as { id: string; nick: string; name: string }[]}
      />
    </DashboardLayout>
  );
}
