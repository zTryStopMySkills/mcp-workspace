import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { GraduationCap, Video, MessageSquare, BookMarked, LogOut, Construction } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";

export default async function AppPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const isPremium = session.tier === "premium";

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7DD3FC] to-[#C9A84C] flex items-center justify-center">
            <GraduationCap size={16} className="text-[#0D1117]" />
          </div>
          <span className="font-bold tracking-tight">
            <span className="text-[#C9A84C]">Cortes</span>
            <span className="text-[#7DD3FC]">IA</span>
            <span className="text-[#8B95A9] text-xs font-medium ml-1.5">Academy</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
            style={{
              background: isPremium ? "rgba(201,168,76,0.15)" : "rgba(139,146,169,0.15)",
              color: isPremium ? "#C9A84C" : "#8B95A9"
            }}
          >
            {isPremium ? "★ Premium" : "Free"}
          </span>
          <span className="text-sm text-white">@{session.nick}</span>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Bienvenido a CortesIA Academy</h1>
          <p className="text-[#8B95A9]">
            {isPremium
              ? "Tienes acceso completo a cursos, videollamadas y comunidad premium."
              : "Tienes acceso a los canales públicos. Sube a premium para cursos + videollamadas."}
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#C9A84C]/10 to-[#7DD3FC]/5 border border-[#C9A84C]/20 p-8 mb-8 flex gap-4 items-start">
          <Construction size={28} className="text-[#C9A84C] shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold mb-2">
              Academy está en Fase 1 — construyéndose en directo
            </h2>
            <p className="text-sm text-[#8B95A9] leading-relaxed mb-3">
              Ya puedes loguearte y tener cuenta, pero los cursos y videollamadas llegan en las próximas semanas.
              Si acabas de pagar tu primera mensualidad, ¡gracias! Eres de los primeros. Mientras tanto, estás en
              la lista VIP para el lanzamiento de Fase 2 (videollamadas) y Fase 3 (cursos completos).
            </p>
            <p className="text-xs text-[#8B95A9]/70">
              Progreso: F1 login + pago ✓ · F2 videollamadas (próximo) · F3 cursos (después)
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <PlaceholderCard
            icon={BookMarked}
            title="Cursos"
            desc="Vídeos + ejercicios + recursos. En camino."
            color="#7DD3FC"
            disabled
          />
          <PlaceholderCard
            icon={Video}
            title="Videollamadas"
            desc="Sesiones semanales en directo con el equipo."
            color="#EF4444"
            disabled
          />
          <PlaceholderCard
            icon={MessageSquare}
            title="Chat comunidad"
            desc="Canales públicos y premium. Chat compartido con el equipo."
            color="#00D4AA"
            disabled
          />
        </div>

        {/* Profile / Account settings */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-[#8B949E] uppercase tracking-wider mb-4">
            Cuenta
          </h2>
          <div className="max-w-md">
            <ChangePasswordForm />
          </div>
        </div>
      </main>
    </div>
  );
}

function PlaceholderCard({
  icon: Icon,
  title,
  desc,
  color,
  disabled
}: {
  icon: typeof BookMarked;
  title: string;
  desc: string;
  color: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-white/[0.03] border border-white/8 p-5 ${
        disabled ? "opacity-60" : "hover:border-white/20"
      }`}
    >
      <div
        className="w-10 h-10 rounded-xl border flex items-center justify-center mb-3"
        style={{ background: `${color}15`, borderColor: `${color}40` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-[#8B95A9] leading-relaxed">{desc}</p>
      {disabled && (
        <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-[#8B95A9]/60 font-bold">
          Próximamente
        </span>
      )}
    </div>
  );
}
