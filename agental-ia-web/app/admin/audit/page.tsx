import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  agent_created:          { label: "Agente creado",          color: "text-[#00D4AA] bg-[#00D4AA]/10 border-[#00D4AA]/20" },
  agent_activated:        { label: "Agente activado",        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  agent_deactivated:      { label: "Agente desactivado",     color: "text-red-400 bg-red-500/10 border-red-500/20" },
  agent_password_changed: { label: "Contraseña cambiada",    color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  agent_updated:          { label: "Agente actualizado",     color: "text-[#8B95A9] bg-white/5 border-white/10" },
  document_uploaded:      { label: "Documento subido",       color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
};

export default async function AuditPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const { data: logs } = await supabaseAdmin
    .from("audit_log")
    .select("id, action, target_type, target_id, details, created_at, actor:actor_id(nick, name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Shield size={22} className="text-[#C9A84C]" />
          <div>
            <h1 className="text-2xl font-bold text-white">Registro de Auditoría</h1>
            <p className="text-[#8B95A9] text-sm">Últimas 100 acciones del sistema</p>
          </div>
        </div>

        {(!logs || logs.length === 0) ? (
          <div className="text-center py-20 text-[#8B95A9]">
            <Shield size={36} className="mx-auto mb-3 opacity-20" />
            <p>Sin registros aún. Las acciones de administración aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map(log => {
              const actor = log.actor as unknown as { nick: string; name: string } | null;
              const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: "text-[#8B95A9] bg-white/5 border-white/10" };
              const details = log.details as Record<string, unknown> | null;

              return (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/8 rounded-xl hover:bg-white/[0.04] transition-colors">
                  <span className={`text-xs border px-2 py-1 rounded-lg font-medium shrink-0 ${meta.color}`}>
                    {meta.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{actor?.name ?? "Sistema"}</span>
                      <span className="text-xs text-[#8B95A9]">@{actor?.nick ?? "system"}</span>
                      {details && Object.keys(details).length > 0 && (
                        <span className="text-xs text-[#8B95A9]/60 font-mono truncate max-w-xs">
                          {Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-[#8B95A9]/50 shrink-0">
                    {new Date(log.created_at).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
