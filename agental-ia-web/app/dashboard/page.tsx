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

  const currentMonth = new Date().toISOString().slice(0, 7);
  const prevMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

  const [
    { data: allDocs },
    { data: assignments },
    { count: msgCount },
    { data: quotations },
    { data: targetData },
    { data: overdueFollowUpsData },
    { data: prevMonthQuotations },
    { data: commissionRateData },
    { data: monthClosedQuotations },
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
    supabaseAdmin
      .from("agent_monthly_targets")
      .select("target_amount")
      .eq("agent_id", agentId)
      .eq("month", currentMonth)
      .single(),
    supabaseAdmin
      .from("quotations")
      .select("id, client_name, follow_up_date, status, client_phone")
      .eq("agent_id", agentId)
      .not("follow_up_date", "is", null)
      .lte("follow_up_date", new Date().toISOString().slice(0, 10))
      .not("status", "in", '("closed","lost")')
      .order("follow_up_date"),
    supabaseAdmin
      .from("quotations")
      .select("id, status, total_once")
      .eq("agent_id", agentId)
      .gte("created_at", prevMonth + "-01")
      .lt("created_at", currentMonth + "-01"),
    supabaseAdmin
      .from("commission_rates")
      .select("rate_percent")
      .eq("agent_id", agentId)
      .single(),
    supabaseAdmin
      .from("quotations")
      .select("total_once")
      .eq("agent_id", agentId)
      .eq("status", "closed")
      .gte("updated_at", currentMonth + "-01"),
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

  const monthlyTarget = targetData?.target_amount ?? null;

  const overdueFollowUps = (overdueFollowUpsData ?? []) as { id: string; client_name: string; follow_up_date: string; client_phone: string | null }[];

  const pmqs = prevMonthQuotations ?? [];
  const prevMonthStat = {
    closed: pmqs.filter(q => q.status === "closed").length,
    pipeline: pmqs.filter(q => !["closed", "lost"].includes(q.status)).reduce((s, q) => s + (q.total_once ?? 0), 0),
  };

  const commissionRate = commissionRateData?.rate_percent ?? null;
  const monthClosedAmount = (monthClosedQuotations ?? []).reduce((s, q) => s + (q.total_once ?? 0), 0);

  return (
    <DashboardLayout>
      <DashboardClient
        agentName={session.user.name}
        agentNick={session.user.nick}
        agentId={agentId}
        docs={docs.slice(0, 5)}
        unseenCount={unseen}
        recentMessages={msgCount ?? 0}
        quoteStat={quoteStat}
        monthlyTarget={monthlyTarget}
        overdueFollowUps={overdueFollowUps}
        prevMonthStat={prevMonthStat}
        commissionRate={commissionRate}
        monthClosedAmount={monthClosedAmount}
      />
    </DashboardLayout>
  );
}
