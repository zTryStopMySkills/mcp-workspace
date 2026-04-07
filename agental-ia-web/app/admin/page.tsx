import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, FolderOpen, MessageCircle, Upload, TrendingUp, Eye, UserPlus, FileText, Hash, Globe, Star } from "lucide-react";

function dayLabel(d: Date) {
  return d.toLocaleDateString("es-ES", { weekday: "short" });
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/dashboard");

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const currentMonth = now.toISOString().slice(0, 7);

  // Last 6 months for billing chart
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const [
    { count: activeAgents },
    { count: totalDocs },
    { count: totalMessages },
    { count: newAgents30d },
    { count: newDocs30d },
    { count: messages24h },
    { data: recentMsgs },
    { data: recentDocs },
    { data: docsSeenWeek },
    { data: billingData },
    { data: agentBillingData },
    { data: funnelData },
    { data: landingSlotsData },
  ] = await Promise.all([
    supabaseAdmin.from("agents").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabaseAdmin.from("documents").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("messages").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("agents").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
    supabaseAdmin.from("documents").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
    supabaseAdmin.from("messages").select("id", { count: "exact", head: true }).gte("created_at", yesterday),
    supabaseAdmin.from("messages").select("created_at, agent_id").gte("created_at", sevenDaysAgo).order("created_at"),
    supabaseAdmin.from("documents").select("id, title, file_type, created_at").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin.from("document_assignments").select("id", { count: "exact", head: true }).gte("seen_at", sevenDaysAgo).not("seen_at", "is", null),
    // Closed quotations last 6 months for billing chart
    supabaseAdmin.from("quotations").select("total_once, updated_at").eq("status", "closed").gte("updated_at", sixMonthsAgo.toISOString()),
    // Agent billing this month
    supabaseAdmin.from("quotations").select("agent_id, total_once, agent:agent_id(nick, name)").eq("status", "closed").gte("updated_at", currentMonth + "-01"),
    // Funnel: all quotations counts by status
    supabaseAdmin.from("quotations").select("status"),
    // Landing slots
    supabaseAdmin.from("landing_config").select("value").eq("key", "slots_available").single(),
  ]);

  // Build daily message counts for last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return { date: d.toDateString(), label: dayLabel(d), count: 0 };
  });
  (recentMsgs ?? []).forEach(msg => {
    const d = new Date(msg.created_at).toDateString();
    const slot = days.find(x => x.date === d);
    if (slot) slot.count++;
  });

  // Monthly billing chart (last 6 months)
  const monthlyBillingMap = new Map<string, number>();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (5 - i));
    monthlyBillingMap.set(d.toISOString().slice(0, 7), 0);
  }
  (billingData ?? []).forEach(q => {
    const m = q.updated_at.slice(0, 7);
    if (monthlyBillingMap.has(m)) {
      monthlyBillingMap.set(m, (monthlyBillingMap.get(m) ?? 0) + (q.total_once ?? 0));
    }
  });
  const monthlyBilling = [...monthlyBillingMap.entries()].map(([month, amount]) => ({
    label: new Date(month + "-01").toLocaleDateString("es-ES", { month: "short" }),
    amount,
  }));

  // Agent billing this month
  const agentBillingMap = new Map<string, { nick: string; name: string; amount: number; count: number }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (agentBillingData ?? []).forEach((q: any) => {
    const agent = Array.isArray(q.agent) ? q.agent[0] : q.agent;
    const prev = agentBillingMap.get(q.agent_id) ?? { nick: agent?.nick ?? "?", name: agent?.name ?? "?", amount: 0, count: 0 };
    agentBillingMap.set(q.agent_id, { ...prev, amount: prev.amount + (q.total_once ?? 0), count: prev.count + 1 });
  });
  const agentBilling = [...agentBillingMap.values()]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)
    .map(a => ({ nick: a.nick, name: a.name, closedAmount: a.amount, closedCount: a.count }));

  // Funnel
  const statusOrder = ["draft", "sent", "negotiating", "closed", "lost"];
  const statusLabels: Record<string, string> = { draft: "Borrador", sent: "Enviada", negotiating: "Negociando", closed: "Cerrada", lost: "Perdida" };
  const statusColors: Record<string, string> = { draft: "#64748b", sent: "#60a5fa", negotiating: "#fbbf24", closed: "#00D4AA", lost: "#f87171" };
  const statusCounts = new Map<string, number>();
  (funnelData ?? []).forEach((q: { status: string }) => {
    statusCounts.set(q.status, (statusCounts.get(q.status) ?? 0) + 1);
  });
  const funnel = statusOrder
    .filter(s => s !== "lost")
    .map(s => ({ status: s, label: statusLabels[s], count: statusCounts.get(s) ?? 0, color: statusColors[s] }));

  const landingSlots = landingSlotsData ? parseInt((landingSlotsData as { value: string }).value, 10) : 3;

  // All quotations for CSV export
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allQuotationsForExport = (agentBillingData ?? []).map((q: any) => {
    const agent = Array.isArray(q.agent) ? q.agent[0] : q.agent;
    return { client_name: "", client_sector: null, plan_name: "", total_once: q.total_once ?? 0, status: "closed", created_at: new Date().toISOString(), agent_nick: agent?.nick ?? "?" };
  });

  // Top 5 agents by message count (last 7 days)
  const agentMsgMap = new Map<string, number>();
  (recentMsgs ?? []).forEach(msg => {
    agentMsgMap.set(msg.agent_id, (agentMsgMap.get(msg.agent_id) ?? 0) + 1);
  });
  const topAgentIds = [...agentMsgMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
  let topAgents: { nick: string; name: string; count: number }[] = [];
  if (topAgentIds.length > 0) {
    const { data: agentData } = await supabaseAdmin.from("agents").select("id, nick, name").in("id", topAgentIds);
    topAgents = topAgentIds.map(id => {
      const a = (agentData ?? []).find(x => x.id === id);
      return { nick: a?.nick ?? "?", name: a?.name ?? "?", count: agentMsgMap.get(id) ?? 0 };
    });
  }

  const bigStats = [
    { label: "Agentes activos", value: activeAgents ?? 0, sub: `+${newAgents30d ?? 0} este mes`, icon: Users, color: "indigo", href: "/admin/agentes" },
    { label: "Documentos", value: totalDocs ?? 0, sub: `+${newDocs30d ?? 0} este mes`, icon: FolderOpen, color: "amber", href: "/admin/documentos" },
    { label: "Mensajes totales", value: totalMessages ?? 0, sub: `${messages24h ?? 0} hoy`, icon: MessageCircle, color: "purple", href: "/chat" }
  ];

  const smallStats = [
    { label: "Msgs esta semana", value: (recentMsgs ?? []).length, icon: TrendingUp, color: "text-indigo-400" },
    { label: "Docs vistos esta semana", value: docsSeenWeek ?? 0, icon: Eye, color: "text-[#00D4AA]" },
    { label: "Nuevos agentes (30d)", value: newAgents30d ?? 0, icon: UserPlus, color: "text-amber-400" },
    { label: "Docs nuevos (30d)", value: newDocs30d ?? 0, icon: FileText, color: "text-purple-400" }
  ];

  const fileTypeEmoji: Record<string, string> = { pdf: "📄", image: "🖼️", video: "🎥", text: "📝", other: "📎" };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl">
        <div className="mb-8">
          <p className="text-[#C9A84C] text-sm font-medium mb-1">Administración</p>
          <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
        </div>

        {/* Big stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {bigStats.map((s) => {
            const Icon = s.icon;
            const bg: Record<string, string> = {
              indigo: "bg-indigo-600/10 border-indigo-500/20",
              amber: "bg-[#C9A84C]/10 border-[#C9A84C]/20",
              purple: "bg-purple-500/10 border-purple-500/20"
            };
            const ic: Record<string, string> = {
              indigo: "text-indigo-400",
              amber: "text-[#C9A84C]",
              purple: "text-purple-400"
            };
            return (
              <Link key={s.label} href={s.href} className={`p-6 ${bg[s.color]} border rounded-2xl hover:brightness-125 transition-all`}>
                <Icon size={22} className={ic[s.color] + " mb-3"} />
                <p className="text-3xl font-bold text-white">{s.value.toLocaleString("es-ES")}</p>
                <p className="text-sm text-[#8B95A9] mt-1">{s.label}</p>
                <p className="text-xs text-[#8B95A9]/50 mt-0.5">{s.sub}</p>
              </Link>
            );
          })}
        </div>

        {/* Small stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          {smallStats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                <Icon size={14} className={s.color + " mb-2"} />
                <p className="text-xl font-bold text-white">{s.value.toLocaleString("es-ES")}</p>
                <p className="text-xs text-[#8B95A9] mt-0.5 leading-snug">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <AdminDashboardClient
          dailyMessages={days}
          topAgents={topAgents}
          monthlyBilling={monthlyBilling}
          agentBilling={agentBilling}
          funnel={funnel}
          allQuotations={allQuotationsForExport}
          landingSlots={isNaN(landingSlots) ? 3 : landingSlots}
        />

        {/* Últimos docs + Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Recent docs */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Últimos documentos</span>
              <Link href="/admin/documentos" className="text-xs text-[#8B95A9] hover:text-white transition-colors">Gestionar →</Link>
            </div>
            {(recentDocs ?? []).length === 0 ? (
              <p className="text-xs text-[#8B95A9]/60 text-center py-6">Sin documentos aún</p>
            ) : (
              <div className="space-y-2.5">
                {(recentDocs ?? []).map(doc => (
                  <Link key={doc.id} href={`/documentos/${doc.id}`} className="flex items-center gap-3 group">
                    <span className="text-lg shrink-0">{fileTypeEmoji[doc.file_type] ?? "📎"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate group-hover:text-[#00D4AA] transition-colors">{doc.title}</p>
                      <p className="text-xs text-[#8B95A9]/60">{new Date(doc.created_at).toLocaleDateString("es-ES")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            <Link href="/admin/agentes" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Users size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Gestionar agentes</p>
                <p className="text-xs text-[#8B95A9]">Crear, activar o desactivar cuentas</p>
              </div>
            </Link>
            <Link href="/admin/documentos" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                <Upload size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Subir documentos</p>
                <p className="text-xs text-[#8B95A9]">Compartir archivos con los agentes</p>
              </div>
            </Link>
            <Link href="/admin/canales" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/20 border border-[#00D4AA]/30 flex items-center justify-center shrink-0">
                <Hash size={18} className="text-[#00D4AA]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Canales de chat</p>
                <p className="text-xs text-[#8B95A9]">Crear y gestionar canales del equipo</p>
              </div>
            </Link>
            <Link href="/admin/leads" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Globe size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Leads web</p>
                <p className="text-xs text-[#8B95A9]">Solicitudes desde la landing Agentalia-webs</p>
              </div>
            </Link>
            <Link href="/admin/resenas" className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                <Star size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Reseñas</p>
                <p className="text-xs text-[#8B95A9]">Aprobar o rechazar reseñas de clientes</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
