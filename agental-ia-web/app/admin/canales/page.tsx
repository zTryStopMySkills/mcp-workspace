import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { CanalesClient } from "@/components/admin/CanalesClient";
import type { Channel } from "@/types";

export const metadata = { title: "Canales de chat — Admin Agental.IA" };

export default async function CanalesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const { data } = await supabaseAdmin
    .from("channels")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name");

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-3xl">
        <div className="mb-8">
          <p className="text-[#C9A84C] text-sm font-medium mb-1">Administración</p>
          <h1 className="text-2xl font-bold text-white">Canales de chat</h1>
          <p className="text-slate-400 text-sm mt-1">Gestiona los canales de comunicación del equipo.</p>
        </div>
        <CanalesClient initialChannels={(data ?? []) as unknown as Channel[]} />
      </div>
    </DashboardLayout>
  );
}
