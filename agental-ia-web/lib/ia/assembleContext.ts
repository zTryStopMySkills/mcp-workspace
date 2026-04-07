import { supabaseAdmin } from "@/lib/supabase";
import type { AgentStats, TeamStats, OverdueFollowUp } from "@/types/ia";
import type { Quotation } from "@/types";

export interface AgentIAContext {
  agentStats: AgentStats;
  teamStats: TeamStats;
  overdueFollowUps: OverdueFollowUp[];
  openQuotations: Quotation[];
  allQuotations: Quotation[];
}

export async function assembleAgentContext(
  agentId: string,
  agentName: string,
  agentNick: string
): Promise<AgentIAContext> {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const prevMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .slice(0, 7);

  const [
    { data: allQuotations },
    { data: prevMonthQuotations },
    { data: targetData },
    { data: commissionRateData },
    { data: overdueData },
    { data: teamQuotations },
    { data: monthClosedData },
  ] = await Promise.all([
    supabaseAdmin
      .from("quotations")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("quotations")
      .select("id, status, total_once")
      .eq("agent_id", agentId)
      .gte("created_at", prevMonth + "-01")
      .lt("created_at", currentMonth + "-01"),
    supabaseAdmin
      .from("agent_monthly_targets")
      .select("target_amount")
      .eq("agent_id", agentId)
      .eq("month", currentMonth)
      .single(),
    supabaseAdmin
      .from("commission_rates")
      .select("rate_percent")
      .eq("agent_id", agentId)
      .single(),
    supabaseAdmin
      .from("quotations")
      .select("id, client_name, follow_up_date, status, client_phone, plan_name, total_once")
      .eq("agent_id", agentId)
      .not("follow_up_date", "is", null)
      .lte("follow_up_date", new Date().toISOString().slice(0, 10))
      .not("status", "in", '("closed","lost")')
      .order("follow_up_date"),
    supabaseAdmin
      .from("quotations")
      .select("agent_id, status, total_once"),
    supabaseAdmin
      .from("quotations")
      .select("total_once")
      .eq("agent_id", agentId)
      .eq("status", "closed")
      .gte("updated_at", currentMonth + "-01"),
  ]);

  const qs = (allQuotations ?? []) as Quotation[];
  const openQuotations = qs.filter((q) => !["closed", "lost"].includes(q.status));

  const total = qs.length;
  const closed = qs.filter((q) => q.status === "closed").length;
  const pipeline = qs
    .filter((q) => !["closed", "lost"].includes(q.status))
    .reduce((s, q) => s + (q.total_once ?? 0), 0);
  const closeRate = total ? Math.round((closed / total) * 100) : 0;

  const pmqs = prevMonthQuotations ?? [];
  const prevClosed = pmqs.filter((q) => q.status === "closed").length;
  const prevPipeline = pmqs
    .filter((q) => !["closed", "lost"].includes(q.status as string))
    .reduce((s, q) => s + ((q as { total_once?: number }).total_once ?? 0), 0);

  const monthClosedAmount = (monthClosedData ?? []).reduce(
    (s, q) => s + (q.total_once ?? 0),
    0
  );

  // Team stats
  const tqs = teamQuotations ?? [];
  const agentMap = new Map<string, { total: number; closed: number; pipeline: number }>();
  for (const q of tqs) {
    const entry = agentMap.get(q.agent_id) ?? { total: 0, closed: 0, pipeline: 0 };
    entry.total += 1;
    if (q.status === "closed") entry.closed += 1;
    if (!["closed", "lost"].includes(q.status)) entry.pipeline += q.total_once ?? 0;
    agentMap.set(q.agent_id, entry);
  }
  const agentEntries = [...agentMap.entries()].sort(
    (a, b) => b[1].closed - a[1].closed
  );
  const rankingPosition =
    agentEntries.findIndex(([id]) => id === agentId) + 1 || agentEntries.length + 1;

  const teamAgents = agentEntries.length || 1;
  const avgCloseRate = Math.round(
    agentEntries.reduce(
      (s, [, e]) => s + (e.total ? (e.closed / e.total) * 100 : 0),
      0
    ) / teamAgents
  );
  const avgPipeline = Math.round(
    agentEntries.reduce((s, [, e]) => s + e.pipeline, 0) / teamAgents
  );

  return {
    agentStats: {
      agentName,
      agentNick,
      total,
      closed,
      pipeline,
      closeRate,
      prevClosed,
      prevPipeline,
      monthlyTarget: targetData?.target_amount ?? null,
      commissionRate: commissionRateData?.rate_percent ?? null,
      monthClosedAmount,
      rankingPosition,
    },
    teamStats: {
      avgCloseRate,
      avgPipeline,
      totalAgents: teamAgents,
    },
    overdueFollowUps: (overdueData ?? []) as OverdueFollowUp[],
    openQuotations,
    allQuotations: qs,
  };
}
