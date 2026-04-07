import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { ResenasAdminClient } from "@/components/admin/ResenasAdminClient";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";

export default async function AdminResenasPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const { data: reviews } = await supabaseAdmin
    .from("public_reviews")
    .select("*")
    .order("created_at", { ascending: false });

  const pending = reviews?.filter((r) => !r.approved).length ?? 0;
  const approved = reviews?.filter((r) => r.approved).length ?? 0;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
            <Star size={20} className="text-[#C9A84C]" />
          </div>
          <div>
            <p className="text-[#C9A84C] text-sm font-medium">Agentalia-webs</p>
            <h1 className="text-2xl font-bold text-white">Reseñas</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{reviews?.length ?? 0}</p>
            <p className="text-xs text-[#8B95A9] mt-1">Total reseñas</p>
          </div>
          <div className="bg-[#00D4AA]/5 border border-[#00D4AA]/15 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#00D4AA]">{approved}</p>
            <p className="text-xs text-[#8B95A9] mt-1">Aprobadas</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{pending}</p>
            <p className="text-xs text-[#8B95A9] mt-1">Pendientes</p>
          </div>
        </div>

        <ResenasAdminClient reviews={reviews ?? []} />
      </div>
    </DashboardLayout>
  );
}
