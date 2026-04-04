import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { AgentesClient } from "@/components/admin/AgentesClient";
import { redirect } from "next/navigation";

export default async function AdminAgentesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const { data: agents } = await supabaseAdmin
    .from("agents")
    .select("id, nick, name, role, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <AgentesClient initialAgents={agents ?? []} />
    </DashboardLayout>
  );
}
