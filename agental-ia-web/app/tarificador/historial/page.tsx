import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { QuotationHistory } from "@/components/tarificador/QuotationHistory";
import type { Quotation } from "@/types";

export const metadata = { title: "Historial de propuestas — Agental.IA" };

export default async function HistorialPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "admin";

  let query = supabaseAdmin
    .from("quotations")
    .select("*, agent:agent_id(id, nick, name)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (!isAdmin) {
    query = query.eq("agent_id", session.user.id);
  }

  const { data } = await query;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <div>
            <p className="text-[#00D4AA] text-sm font-medium">Tarificador</p>
            <h1 className="text-2xl font-bold text-white">Historial de propuestas</h1>
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-8">
          {isAdmin ? "Todas las propuestas del equipo." : "Tus propuestas enviadas y su estado."}
        </p>
        <QuotationHistory
          initialQuotations={(data ?? []) as unknown as Quotation[]}
          isAdmin={isAdmin}
        />
      </div>
    </DashboardLayout>
  );
}
