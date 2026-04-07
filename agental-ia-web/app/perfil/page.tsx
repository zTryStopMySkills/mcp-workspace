import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { PerfilClient } from "@/components/perfil/PerfilClient";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { data: perfil } = await supabaseAdmin
    .from("agents")
    .select("nick, name, role, avatar_url, created_at, email")
    .eq("id", session.user.id)
    .single();

  if (!perfil) redirect("/dashboard");

  const [{ data: quotationStats }, { data: waTemplate }] = await Promise.all([
    supabaseAdmin.from("quotations").select("status, total_once").eq("agent_id", session.user.id),
    supabaseAdmin.from("whatsapp_templates").select("template_text").eq("agent_id", session.user.id).single(),
  ]);

  const qs = quotationStats ?? [];
  const agentStats = {
    total: qs.length,
    closed: qs.filter(q => q.status === "closed").length,
    totalBilled: qs.filter(q => q.status === "closed").reduce((s, q) => s + (q.total_once ?? 0), 0),
    closeRate: qs.length ? Math.round((qs.filter(q => q.status === "closed").length / qs.length) * 100) : 0,
  };

  return (
    <DashboardLayout>
      <PerfilClient
        perfil={perfil}
        agentStats={agentStats}
        waTemplate={waTemplate?.template_text ?? null}
      />
    </DashboardLayout>
  );
}
