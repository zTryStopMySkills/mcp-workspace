"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Agental.IA] Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Algo ha salido mal</h1>
        <p className="text-[#8B95A9] text-sm mb-6 leading-relaxed">
          Se produjo un error inesperado. Puedes intentar recargar la página o volver al panel principal.
        </p>

        {error.digest && (
          <p className="text-xs text-[#8B95A9]/50 font-mono mb-6">
            Referencia: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/8 border border-white/10 text-white hover:bg-white/14 transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-colors"
            style={{ background: "linear-gradient(135deg, #00D4AA, #2DD4BF)" }}
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
