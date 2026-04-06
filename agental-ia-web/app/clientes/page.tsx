import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { ClientesClient } from "@/components/crm/ClientesClient";
import type { CRMClient, Quotation } from "@/types";

export const metadata = { title: "Clientes — Agental.IA" };

export default async function ClientesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "admin";

  let query = supabaseAdmin
    .from("quotations")
    .select("*, agent:agent_id(nick, name)")
    .order("created_at", { ascending: false });

  if (!isAdmin) query = query.eq("agent_id", session.user.id);

  const { data: quotations } = await query;

  // Group by client_name
  const map = new Map<string, CRMClient>();
  for (const q of (quotations ?? []) as unknown as (Quotation & { agent?: { nick: string; name: string } })[]) {
    const key = q.client_name.trim().toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.proposals.push(q);
      if (q.created_at > existing.lastDate) existing.lastDate = q.created_at;
      if (q.status === "closed") existing.totalBilled += q.total_once;
      if (q.agent && !existing.agentNicks.includes(q.agent.nick)) existing.agentNicks.push(q.agent.nick);
    } else {
      map.set(key, {
        clientName: q.client_name,
        sector: q.client_sector,
        email: q.client_email,
        phone: q.client_phone,
        proposals: [q],
        lastDate: q.created_at,
        totalBilled: q.status === "closed" ? q.total_once : 0,
        agentNicks: q.agent ? [q.agent.nick] : [],
      });
    }
  }

  const clients = [...map.values()].sort(
    (a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()
  );

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="mb-2">
          <p className="text-[#00D4AA] text-sm font-medium">CRM</p>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          {isAdmin ? "Todos los clientes del equipo." : "Clientes de tus propuestas."}{" "}
          {clients.length > 0 && `${clients.length} cliente${clients.length !== 1 ? "s" : ""} encontrado${clients.length !== 1 ? "s" : ""}.`}
        </p>
        <ClientesClient clients={clients} isAdmin={isAdmin} />
      </div>
    </DashboardLayout>
  );
}
