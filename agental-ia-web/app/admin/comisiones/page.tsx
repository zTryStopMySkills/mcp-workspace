import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { AdminComisionesClient } from "@/components/comisiones/AdminComisionesClient";

export const metadata = { title: "Comisiones del equipo — Agental.IA" };

export default async function AdminComisionesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [{ data: agents }, { data: rates }, { data: closedThisMonth }] = await Promise.all([
    supabaseAdmin
      .from("agents")
      .select("id, nick, name, is_active")
      .eq("is_active", true)
      .order("name"),
    supabaseAdmin.from("commission_rates").select("agent_id, rate_percent"),
    supabaseAdmin
      .from("quotations")
      .select("agent_id, total_once")
      .eq("status", "closed")
      .gte("updated_at", currentMonth + "-01"),
  ]);

  // Build map: agent_id -> { rate, closedAmount, closedCount }
  const rateMap = new Map((rates ?? []).map(r => [r.agent_id, r.rate_percent]));
  const closedMap = new Map<string, { amount: number; count: number }>();
  for (const q of closedThisMonth ?? []) {
    const prev = closedMap.get(q.agent_id) ?? { amount: 0, count: 0 };
    closedMap.set(q.agent_id, { amount: prev.amount + q.total_once, count: prev.count + 1 });
  }

  const agentsWithStats = (agents ?? []).map(a => ({
    ...a,
    ratePercent: rateMap.get(a.id) ?? null,
    closedAmount: closedMap.get(a.id)?.amount ?? 0,
    closedCount: closedMap.get(a.id)?.count ?? 0,
    commission: Math.round((closedMap.get(a.id)?.amount ?? 0) * (rateMap.get(a.id) ?? 0) / 100),
  }));

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="mb-6">
          <p className="text-[#C9A84C] text-sm font-medium">Administración</p>
          <h1 className="text-2xl font-bold text-white">Comisiones del equipo</h1>
          <p className="text-slate-400 text-sm mt-1">
            Configura el porcentaje de comisión de cada agente y consulta el acumulado del mes.
          </p>
        </div>
        <AdminComisionesClient agents={agentsWithStats} />
      </div>
    </DashboardLayout>
  );
}
