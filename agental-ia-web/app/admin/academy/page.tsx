import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { AcademyAdminClient } from "@/components/admin/AcademyAdminClient";
import { redirect } from "next/navigation";

export default async function AdminAcademyPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/chat");

  const supabase = getSupabaseAdmin();
  const { data: students, count } = await supabase
    .from("academy_users")
    .select("id, nick, tier, is_active, created_at, stripe_customer_id", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <DashboardLayout>
      <AcademyAdminClient
        initialStudents={students ?? []}
        initialTotal={count ?? (students?.length ?? 0)}
      />
    </DashboardLayout>
  );
}
