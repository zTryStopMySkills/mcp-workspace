import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FolderOpen, MessageCircle, Upload } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const [{ count: agentCount }, { count: docCount }, { count: msgCount }] = await Promise.all([
    supabaseAdmin.from("agents").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabaseAdmin.from("documents").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("messages").select("id", { count: "exact", head: true })
  ]);

  const stats = [
    { label: "Agentes activos", value: agentCount ?? 0, icon: Users, color: "indigo", href: "/admin/agentes" },
    { label: "Documentos", value: docCount ?? 0, icon: FolderOpen, color: "amber", href: "/admin/documentos" },
    { label: "Mensajes totales", value: msgCount ?? 0, icon: MessageCircle, color: "purple", href: "/chat" }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <div className="mb-8">
          <p className="text-amber-400 text-sm font-medium mb-1">Administración</p>
          <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {stats.map((s) => {
            const Icon = s.icon;
            const colors: Record<string, string> = {
              indigo: "bg-indigo-600/10 border-indigo-500/20",
              amber: "bg-amber-500/10 border-amber-500/20",
              purple: "bg-purple-500/10 border-purple-500/20"
            };
            const iconColors: Record<string, string> = {
              indigo: "text-indigo-400",
              amber: "text-amber-400",
              purple: "text-purple-400"
            };
            return (
              <Link
                key={s.label}
                href={s.href}
                className={`p-6 ${colors[s.color]} border rounded-2xl hover:brightness-125 transition-all`}
              >
                <Icon size={22} className={iconColors[s.color] + " mb-3"} />
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/agentes"
            className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Users size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Gestionar agentes</p>
              <p className="text-xs text-slate-400">Crear, activar o desactivar cuentas</p>
            </div>
          </Link>
          <Link
            href="/admin/documentos"
            className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Upload size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Subir documentos</p>
              <p className="text-xs text-slate-400">Compartir archivos con los agentes</p>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
