import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Glowing number */}
        <div className="relative inline-block mb-8">
          <span
            className="text-[120px] font-black leading-none select-none"
            style={{
              background: "linear-gradient(135deg, #00D4AA, #2DD4BF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(0,212,170,0.4))"
            }}
          >
            404
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-[#8B95A9] text-sm mb-8 leading-relaxed">
          La página que buscas no existe o ha sido movida. Vuelve al panel principal.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-black transition-colors"
          style={{ background: "linear-gradient(135deg, #00D4AA, #2DD4BF)" }}
        >
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}
