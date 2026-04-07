import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { LeadsClient } from "@/components/admin/LeadsClient";
import { redirect } from "next/navigation";
import { Globe } from "lucide-react";

export default async function AdminLeadsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const [{ data: leads }, { data: agents }] = await Promise.all([
    supabaseAdmin
      .from("public_leads")
      .select("*, assigned_agent:assigned_to(id, nick, name)")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("agents")
      .select("id, nick, name")
      .eq("is_active", true)
      .order("nick"),
  ]);

  const counts = {
    total: leads?.length ?? 0,
    new: leads?.filter((l) => l.status === "new").length ?? 0,
    contacted: leads?.filter((l) => l.status === "contacted").length ?? 0,
    converted: leads?.filter((l) => l.status === "converted").length ?? 0,
    lost: leads?.filter((l) => l.status === "lost").length ?? 0,
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
            <Globe size={20} className="text-[#00D4AA]" />
          </div>
          <div>
            <p className="text-[#C9A84C] text-sm font-medium">Landing Agentalia-webs</p>
            <h1 className="text-2xl font-bold text-white">Leads web</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total", value: counts.total, color: "text-white" },
            { label: "Nuevos", value: counts.new, color: "text-blue-400" },
            { label: "Contactados", value: counts.contacted, color: "text-amber-400" },
            { label: "Convertidos", value: counts.converted, color: "text-[#00D4AA]" },
            { label: "Perdidos", value: counts.lost, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.04] border border-white/8 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#8B95A9] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <LeadsClient leads={leads ?? []} agents={agents ?? []} />
      </div>
    </DashboardLayout>
  );
}
