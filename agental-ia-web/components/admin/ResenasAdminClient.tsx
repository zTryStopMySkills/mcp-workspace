"use client";

import { useState } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";

interface Review {
  id: string;
  author_name: string;
  business_name?: string;
  location?: string;
  rating: number;
  content: string;
  approved: boolean;
  created_at: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? "text-[#C9A84C] fill-[#C9A84C]" : "text-white/20"}
        />
      ))}
    </div>
  );
}

export function ResenasAdminClient({ reviews: initialReviews }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filtered = filter === "all"
    ? reviews
    : filter === "pending"
    ? reviews.filter((r) => !r.approved)
    : reviews.filter((r) => r.approved);

  const handleToggleApproval = async (review: Review) => {
    setUpdatingId(review.id);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !review.approved }),
      });
      if (!res.ok) throw new Error("Error");
      setReviews((prev) =>
        prev.map((r) => r.id === review.id ? { ...r, approved: !r.approved } : r)
      );
    } catch {
      alert("Error al actualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("¿Eliminar esta reseña permanentemente?")) return;
    setUpdatingId(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch {
      alert("Error al eliminar");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => {
          const count = f === "all" ? reviews.length : f === "pending" ? reviews.filter((r) => !r.approved).length : reviews.filter((r) => r.approved).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f ? "bg-white/15 text-white" : "text-[#8B95A9] hover:text-white hover:bg-white/8"
              }`}
            >
              {f === "all" ? "Todas" : f === "pending" ? "Pendientes" : "Aprobadas"} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#8B95A9] py-12">No hay reseñas en este filtro</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={`border rounded-xl p-5 transition-all ${
                review.approved
                  ? "bg-[#00D4AA]/[0.04] border-[#00D4AA]/20"
                  : "bg-white/[0.03] border-amber-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white text-sm">{review.author_name}</p>
                    {review.approved ? (
                      <span className="text-xs bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 px-2 py-0.5 rounded-full">Aprobada</span>
                    ) : (
                      <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">Pendiente</span>
                    )}
                  </div>
                  {(review.business_name || review.location) && (
                    <p className="text-xs text-[#8B95A9]">
                      {[review.business_name, review.location].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StarDisplay rating={review.rating} />
                  <p className="text-xs text-[#8B95A9]">
                    {new Date(review.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#8B95A9] leading-relaxed mb-4">{review.content}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleApproval(review)}
                  disabled={updatingId === review.id}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                    review.approved
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                      : "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 hover:bg-[#00D4AA]/25"
                  }`}
                >
                  {review.approved ? (
                    <><X size={12} /> Rechazar</>
                  ) : (
                    <><Check size={12} /> Aprobar</>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={updatingId === review.id}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
