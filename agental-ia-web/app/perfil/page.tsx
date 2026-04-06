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
    .select("nick, name, role, avatar_url, created_at")
    .eq("id", session.user.id)
    .single();

  if (!perfil) redirect("/dashboard");

  return (
    <DashboardLayout>
      <PerfilClient perfil={perfil} />
    </DashboardLayout>
  );
}
