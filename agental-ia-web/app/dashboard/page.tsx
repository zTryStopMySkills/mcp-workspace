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
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: allDocs },
    { data: assignments },
    { count: msgCount },
    { data: quotations },
  ] = await Promise.all([
    supabaseAdmin
      .from("documents")
      .select("*, creator:created_by(nick, name)")
      .eq("visibility", "all")
      .order("created_at", { ascending: false })
      .limit(10),
    supabaseAdmin
      .from("document_assignments")
      .select("document_id, seen_at")
      .eq("agent_id", agentId)
      .limit(200),
    supabaseAdmin
      .from("messages")
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterday),
    supabaseAdmin
      .from("quotations")
      .select("id, status, total_once")
      .eq("agent_id", agentId),
  ]);

  const seenMap = new Map((assignments ?? []).map((a) => [a.document_id, a.seen_at]));

  const docs: DocumentWithStatus[] = (allDocs ?? []).map((d) => ({
    ...d,
    seen_at: seenMap.get(d.id) ?? null,
    is_new: !seenMap.has(d.id)
  }));

  const unseen = docs.filter((d) => d.is_new).length;

  const qs = quotations ?? [];
  const quoteStat = {
    total: qs.length,
    closed: qs.filter(q => q.status === "closed").length,
    pipeline: qs.filter(q => !["closed", "lost"].includes(q.status)).reduce((s, q) => s + (q.total_once ?? 0), 0),
    closeRate: qs.length ? Math.round((qs.filter(q => q.status === "closed").length / qs.length) * 100) : 0,
  };

  return (
    <DashboardLayout>
      <DashboardClient
        agentName={session.user.name}
        agentNick={session.user.nick}
        docs={docs.slice(0, 5)}
        unseenCount={unseen}
        recentMessages={msgCount ?? 0}
        quoteStat={quoteStat}
      />
    </DashboardLayout>
  );
}
