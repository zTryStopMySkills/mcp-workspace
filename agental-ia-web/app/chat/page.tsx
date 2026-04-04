import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { Message } from "@/types";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  // Cargar últimos 60 mensajes
  const { data: messages } = await supabaseAdmin
    .from("messages")
    .select("id, agent_id, content, created_at, agent:agent_id(nick, name, avatar_url)")
    .order("created_at", { ascending: true })
    .limit(60);

  return (
    <DashboardLayout>
      <ChatWindow
        initialMessages={(messages ?? []) as unknown as Message[]}
        currentAgentId={session.user.id}
        currentAgentNick={session.user.nick}
        currentAgentName={session.user.name}
      />
    </DashboardLayout>
  );
}
