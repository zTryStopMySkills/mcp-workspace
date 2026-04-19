"use client";

import { useMemo, useState } from "react";
import {
  BookMarked,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Crown,
  User,
  Search,
  ChevronDown,
} from "lucide-react";

interface Student {
  id: string;
  nick: string;
  tier: string;
  is_active: boolean;
  created_at: string;
  stripe_customer_id: string | null;
}

const PAGE_SIZE = 50;

export function AcademyAdminClient({
  initialStudents,
  initialTotal,
}: {
  initialStudents: Student[];
  initialTotal: number;
}) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");

  const hasMore = students.length < total;

  // Client-side filter by nick
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.nick.toLowerCase().includes(q));
  }, [students, search]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/admin/academy?page=${nextPage}`);
      if (!res.ok) {
        setFeedback("Error al cargar más estudiantes");
        setTimeout(() => setFeedback(""), 3000);
        return;
      }
      const data: { students: Student[]; total: number; page: number } =
        await res.json();
      setStudents((prev) => {
        // Deduplicate by id in case of any overlap
        const ids = new Set(prev.map((s) => s.id));
        const fresh = (data.students ?? []).filter((s) => !ids.has(s.id));
        return [...prev, ...fresh];
      });
      setTotal(data.total ?? total);
      setPage(nextPage);
    } catch {
      setFeedback("Error de red al cargar más estudiantes");
      setTimeout(() => setFeedback(""), 3000);
    } finally {
      setLoadingMore(false);
    }
  }

  async function patch(id: string, update: { tier?: string; is_active?: boolean }) {
    setLoadingId(id);
    const res = await fetch("/api/admin/academy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...update }),
    });
    setLoadingId(null);
    if (!res.ok) {
      setFeedback("Error al guardar cambio");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...update } : s))
    );
  }

  function toggleTier(s: Student) {
    patch(s.id, { tier: s.tier === "premium" ? "free" : "premium" });
  }

  function toggleActive(s: Student) {
    patch(s.id, { is_active: !s.is_active });
  }

  const activeCount = students.filter((s) => s.is_active).length;
  const premiumCount = students.filter((s) => s.tier === "premium").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center">
            <BookMarked size={20} className="text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Academy</h1>
            <p className="text-sm text-[#8B95A9]">Gestión de estudiantes</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-[#8B95A9]">
          <span>
            <span className="text-white font-semibold">{total}</span> total
          </span>
          <span>
            <span className="text-emerald-400 font-semibold">{activeCount}</span>{" "}
            activos
          </span>
          <span>
            <span className="text-[#C9A84C] font-semibold">{premiumCount}</span>{" "}
            premium
          </span>
        </div>
      </div>

      {feedback && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {feedback}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B95A9] pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nick..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/8 text-sm text-white placeholder-[#8B95A9]/60 focus:outline-none focus:border-[#7DD3FC]/50 transition-colors"
        />
        {search && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8B95A9]">
            {visible.length} resultado{visible.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_100px_100px] gap-0 px-5 py-3 border-b border-white/8">
          <span className="text-xs font-medium text-[#8B95A9] uppercase tracking-wider">
            Estudiante
          </span>
          <span className="text-xs font-medium text-[#8B95A9] uppercase tracking-wider">
            Tier
          </span>
          <span className="text-xs font-medium text-[#8B95A9] uppercase tracking-wider">
            Estado
          </span>
          <span className="text-xs font-medium text-[#8B95A9] uppercase tracking-wider">
            Acciones
          </span>
        </div>

        {visible.length === 0 && (
          <div className="px-5 py-12 text-center text-[#8B95A9] text-sm">
            {search
              ? `Sin resultados para "${search}"`
              : "No hay estudiantes registrados aún."}
          </div>
        )}

        {visible.map((s) => {
          const isLoading = loadingId === s.id;
          return (
            <div
              key={s.id}
              className="grid grid-cols-[1fr_120px_100px_100px] gap-0 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
            >
              {/* Student info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#7DD3FC]/10 border border-[#7DD3FC]/20 flex items-center justify-center text-xs font-bold text-[#7DD3FC] shrink-0">
                  {s.nick[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    @{s.nick}
                  </p>
                  {s.stripe_customer_id && (
                    <p className="text-xs text-[#8B95A9] truncate">
                      {s.stripe_customer_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Tier badge */}
              <div>
                {s.tier === "premium" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 text-[#C9A84C] text-xs font-medium">
                    <Crown size={11} />
                    Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#8B95A9] text-xs font-medium">
                    <User size={11} />
                    Free
                  </span>
                )}
              </div>

              {/* Active status */}
              <div>
                {s.is_active ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                    Inactivo
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin text-[#8B95A9]" />
                ) : (
                  <>
                    <button
                      onClick={() => toggleTier(s)}
                      title={s.tier === "premium" ? "Bajar a Free" : "Subir a Premium"}
                      className="p-1.5 rounded-lg hover:bg-[#C9A84C]/10 text-[#8B95A9] hover:text-[#C9A84C] transition-colors"
                    >
                      <Crown size={15} />
                    </button>
                    <button
                      onClick={() => toggleActive(s)}
                      title={s.is_active ? "Desactivar" : "Activar"}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B95A9] hover:text-white transition-colors"
                    >
                      {s.is_active ? (
                        <ToggleRight size={15} className="text-emerald-400" />
                      ) : (
                        <ToggleLeft size={15} />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: loaded count + load more */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs text-[#8B95A9]">
          Mostrando{" "}
          <span className="text-white font-medium">{students.length}</span> de{" "}
          <span className="text-white font-medium">{total}</span> estudiantes
          {search && visible.length < students.length && (
            <span className="text-[#C9A84C]">
              {" "}({visible.length} coinciden con la busqueda)
            </span>
          )}
        </p>

        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/8 text-sm font-medium text-[#8B95A9] hover:text-white hover:border-white/20 hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loadingMore ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Cargar mas ({total - students.length} restantes)
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
