"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Loader2, Eye, EyeOff, GraduationCap, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick: nick.trim(), password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      router.push("/app");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al acceder");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#7DD3FC]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-[#C9A84C]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#8B95A9] hover:text-white mb-6"
        >
          <ArrowLeft size={14} /> Volver a la landing
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7DD3FC] to-[#C9A84C] items-center justify-center mb-4">
            <GraduationCap size={28} className="text-[#0D1117]" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-[#C9A84C]">Cortes</span>
            <span className="text-[#7DD3FC]">IA</span>
            <span className="text-[#8B95A9] text-lg font-medium ml-2">Academy</span>
          </h1>
          <p className="text-[#8B95A9] text-sm mt-1">Zona privada de alumnos</p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Accede a tu cuenta</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                required
                placeholder="tu_usuario"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-[#8B95A9] focus:outline-none focus:border-[#7DD3FC]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-[#7DD3FC]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B95A9] hover:text-white"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-[#0D1117] font-bold disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? "Accediendo..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#8B95A9]/60 text-xs mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/#precio" className="text-[#7DD3FC] hover:underline">
            Suscríbete aquí
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
