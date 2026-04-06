import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { DocumentWithStatus } from "@/types";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const agentId = session.user.id;

  // Documentos visibles para todos
  const { data: allDocs } = await supabaseAdmin
    .from("documents")
    .select("*, creator:created_by(nick, name)")
    .eq("visibility", "all")
    .order("created_at", { ascending: false })
    .limit(10);

  // Asignaciones del agente
  const { data: assignments } = await supabaseAdmin
    .from("document_assignments")
    .select("document_id, seen_at")
    .eq("agent_id", agentId)
    .limit(200);

  const seenMap = new Map((assignments ?? []).map((a) => [a.document_id, a.seen_at]));

  const docs: DocumentWithStatus[] = (allDocs ?? []).map((d) => ({
    ...d,
    seen_at: seenMap.get(d.id) ?? null,
    is_new: !seenMap.has(d.id)
  }));

  const unseen = docs.filter((d) => d.is_new).length;

  // Conteo de mensajes (últimas 24h)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: msgCount } = await supabaseAdmin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .gte("created_at", yesterday);

  return (
    <DashboardLayout>
      <DashboardClient
        agentName={session.user.name}
        agentNick={session.user.nick}
        docs={docs.slice(0, 5)}
        unseenCount={unseen}
        recentMessages={msgCount ?? 0}
      />
    </DashboardLayout>
  );
}
