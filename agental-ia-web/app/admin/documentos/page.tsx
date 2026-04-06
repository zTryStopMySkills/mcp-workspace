import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { AdminDocumentosClient } from "@/components/admin/AdminDocumentosClient";
import { redirect } from "next/navigation";
import type { Agent } from "@/types";

export default async function AdminDocumentosPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const [{ data: docs }, { data: agents }] = await Promise.all([
    supabaseAdmin
      .from("documents")
      .select("*, creator:created_by(nick, name)")
      .order("created_at", { ascending: false })
      .limit(500),
    supabaseAdmin
      .from("agents")
      .select("id, nick, name, role, is_active, created_at, avatar_url")
      .eq("is_active", true)
      .order("name")
  ]);

  return (
    <DashboardLayout>
      <AdminDocumentosClient
        initialDocs={docs ?? []}
        agents={(agents ?? []) as Agent[]}
      />
    </DashboardLayout>
  );
}
