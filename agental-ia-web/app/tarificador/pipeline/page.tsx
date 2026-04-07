import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { PipelineClient } from "@/components/tarificador/PipelineClient";
import type { Quotation } from "@/types";

export const metadata = { title: "Pipeline — Agental.IA" };

export default async function PipelinePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "admin";

  let query = supabaseAdmin
    .from("quotations")
    .select("*, agent:agent_id(id, nick, name)")
    .order("updated_at", { ascending: false })
    .limit(500);

  if (!isAdmin) {
    query = query.eq("agent_id", session.user.id);
  }

  const { data } = await query;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <p className="text-[#00D4AA] text-sm font-medium">Tarificador</p>
          <h1 className="text-2xl font-bold text-white">Pipeline Kanban</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdmin ? "Pipeline completo del equipo. Arrastra para cambiar estado." : "Tu pipeline. Arrastra las tarjetas para cambiar el estado."}
          </p>
        </div>
        <PipelineClient
          initialQuotations={(data ?? []) as unknown as Quotation[]}
          isAdmin={isAdmin}
        />
      </div>
    </DashboardLayout>
  );
}
