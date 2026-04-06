import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { RankingClient } from "@/components/ranking/RankingClient";
import type { RankingEntry } from "@/types";

export const metadata = { title: "Ranking — Agental.IA" };

export default async function RankingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { data: quotations } = await supabaseAdmin
    .from("quotations")
    .select("agent_id, status, total_once, agent:agent_id(id, nick, name)");

  // Aggregate per agent
  const map = new Map<string, { nick: string; name: string; total: number; closed: number; pipeline: number }>();

  for (const q of quotations ?? []) {
    const agent = q.agent as unknown as { id: string; nick: string; name: string } | null;
    if (!agent) continue;
    const existing = map.get(q.agent_id) ?? { nick: agent.nick, name: agent.name, total: 0, closed: 0, pipeline: 0 };
    existing.total += 1;
    if (q.status === "closed") existing.closed += 1;
    if (!["closed", "lost"].includes(q.status)) existing.pipeline += q.total_once ?? 0;
    map.set(q.agent_id, existing);
  }

  const entries: RankingEntry[] = [...map.entries()]
    .sort((a, b) => b[1].closed - a[1].closed || b[1].pipeline - a[1].pipeline)
    .map(([agentId, s], i) => ({
      agentId,
      nick: s.nick,
      name: s.name,
      total: s.total,
      closed: s.closed,
      pipeline: s.pipeline,
      closeRate: s.total ? Math.round((s.closed / s.total) * 100) : 0,
      position: i + 1,
    }));

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <p className="text-[#C9A84C] text-sm font-medium">Equipo comercial</p>
            <h1 className="text-2xl font-bold text-white">Ranking del Equipo</h1>
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-8">Clasificación por propuestas cerradas y pipeline activo.</p>
        <RankingClient entries={entries} currentAgentId={session.user.id} />
      </div>
    </DashboardLayout>
  );
}
