import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { ComisionesClient } from "@/components/comisiones/ComisionesClient";
import type { Quotation } from "@/types";

export const metadata = { title: "Mis Comisiones — Agental.IA" };

export default async function ComisionesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const agentId = session.user.id;

  const [{ data: quotations }, { data: rateData }] = await Promise.all([
    supabaseAdmin
      .from("quotations")
      .select("id, client_name, client_sector, plan_name, total_once, status, updated_at, created_at")
      .eq("agent_id", agentId)
      .eq("status", "closed")
      .order("updated_at", { ascending: false }),
    supabaseAdmin
      .from("commission_rates")
      .select("rate_percent")
      .eq("agent_id", agentId)
      .single(),
  ]);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="mb-6">
          <p className="text-[#00D4AA] text-sm font-medium">Mi espacio</p>
          <h1 className="text-2xl font-bold text-white">Mis Comisiones</h1>
          <p className="text-slate-400 text-sm mt-1">
            Desglose de tus comisiones por cada propuesta cerrada.
          </p>
        </div>
        <ComisionesClient
          quotations={(quotations ?? []) as unknown as Quotation[]}
          ratePercent={rateData?.rate_percent ?? null}
          agentName={session.user.name}
        />
      </div>
    </DashboardLayout>
  );
}
